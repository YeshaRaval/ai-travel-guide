import OpenAI from 'openai';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, startDate, endDate, budget, travelers, interests, accommodation, pace, additionalNotes } = body;

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Create system prompt
    const systemPrompt = `You are an expert travel planner with deep knowledge of destinations worldwide. Create detailed, personalized travel itineraries that are practical, exciting, and tailored to the user's preferences. Include specific recommendations for activities, restaurants, accommodations, and insider tips.`;

    // Create user prompt
    const userPrompt = `Create a detailed ${duration}-day travel itinerary for ${destination}.

**Trip Details:**
- Dates: ${startDate} to ${endDate} (${duration} days)
- Budget: ${budget}
- Travelers: ${travelers}
- Accommodation: ${accommodation}
- Travel Pace: ${pace}
- Interests: ${interests}
${additionalNotes ? `- Special Requests: ${additionalNotes}` : ''}

**Please provide:**

1. **Trip Overview**: Brief introduction about ${destination} and why it's perfect for this trip

2. **Day-by-Day Itinerary**: For each day, include:
   - Morning activities (with specific times and locations)
   - Lunch recommendations (restaurant names and cuisine types)
   - Afternoon activities
   - Dinner recommendations
   - Evening activities or entertainment
   - Estimated daily budget breakdown

3. **Must-Know Tips**:
   - Best way to get around
   - Money-saving tips
   - Local customs and etiquette
   - What to pack

4. **Hidden Gems**: 3-5 less touristy spots that match their interests

5. **Budget Summary**: Total estimated cost breakdown

Format the response in clean Markdown with clear headings and bullet points. Make it engaging and exciting!`;

    // Chain of Thought prompts
    const chainOfThoughtSteps = [
      `Analyzing destination: ${destination}...`,
      `Considering ${duration} days with ${budget} budget...`,
      `Matching activities to interests: ${interests}...`,
      `Optimizing daily schedule for ${pace} pace...`,
      `Finding best ${accommodation} options...`,
      `Adding hidden gems and local favorites...`,
      `Creating detailed itinerary...`,
    ];

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
        // Send chain of thought steps
        for (const thought of chainOfThoughtSteps) {
          await writer.write(
            encoder.encode(`data: ${JSON.stringify({ type: 'thought', content: thought })}\n\n`)
          );
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Get streaming response from Azure OpenAI using OpenAI SDK
        const stream = await client.chat.completions.create({
          model: deploymentName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 4000,
          temperature: 0.7,
          top_p: 0.95,
          stream: true,
        });

        // Stream the content
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            await writer.write(
              encoder.encode(`data: ${JSON.stringify({ type: 'content', content: delta })}\n\n`)
            );
          }
        }

        // Send done signal
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'error', content: 'An error occurred while generating your itinerary.' })}\n\n`
          )
        );
      } finally {
        await writer.close();
      }
    })();

    return response;
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate itinerary' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
