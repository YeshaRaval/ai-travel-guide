import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const db = await getDatabase();
    const itinerary = await db.collection('itineraries').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    // Build conversation history
    const messages: any[] = [
      {
        role: 'system',
        content: `You are a helpful travel assistant. The user has a travel itinerary for ${itinerary.destination}. Here's their itinerary:\n\n${itinerary.content}\n\nHelp them with questions about their trip, suggest modifications, recommend additional activities, or provide travel tips. Be specific and reference their itinerary when relevant.`,
      },
    ];

    // Add chat history
    if (itinerary.chatHistory && Array.isArray(itinerary.chatHistory)) {
      messages.push(...itinerary.chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })));
    }

    // Add new user message
    messages.push({
      role: 'user',
      content: message,
    });

    // Create a TransformStream for streaming
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Send response immediately
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    // Process in background
    (async () => {
      try {
        let fullResponse = '';

        // Get streaming response from Azure OpenAI
        const aiStream = await client.chat.completions.create({
          model: deploymentName,
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          stream: true,
        });

        // Stream the content
        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            fullResponse += delta;
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ type: 'content', content: delta })}\n\n`)
            );
          }
        }

        // Update chat history in database
        const newChatHistory = [
          ...(itinerary.chatHistory || []),
          { role: 'user', content: message, timestamp: new Date() },
          { role: 'assistant', content: fullResponse, timestamp: new Date() },
        ];

        const { id } = await params;
        await db.collection('itineraries').updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              chatHistory: newChatHistory,
              updatedAt: new Date(),
            }
          }
        );

        // Send done signal
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Chat streaming error:', error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', content: 'An error occurred while processing your message.' })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return response;
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
