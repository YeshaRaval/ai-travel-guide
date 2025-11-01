import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests,
      accommodation,
      pace,
      additionalNotes,
      content,
    } = body;

    if (!destination || !content) {
      return NextResponse.json(
        { error: 'Destination and content are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const itinerary = {
      userId: new ObjectId(session.user.id),
      title: title || `${destination} Trip`,
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      interests,
      accommodation,
      pace,
      additionalNotes,
      content,
      chatHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('itineraries').insertOne(itinerary);

    return NextResponse.json(
      {
        message: 'Itinerary saved successfully',
        itineraryId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save itinerary error:', error);
    return NextResponse.json(
      { error: 'Failed to save itinerary' },
      { status: 500 }
    );
  }
}
