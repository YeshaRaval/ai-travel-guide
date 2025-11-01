import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDatabase } from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(
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

    return NextResponse.json(itinerary, { status: 200 });
  } catch (error) {
    console.error('Fetch itinerary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await params;
    const body = await req.json();
    const { content, chatHistory } = body;

    const db = await getDatabase();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (content !== undefined) updateData.content = content;
    if (chatHistory !== undefined) updateData.chatHistory = chatHistory;

    const result = await db.collection('itineraries').updateOne(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(session.user.id),
      },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Itinerary updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update itinerary error:', error);
    return NextResponse.json(
      { error: 'Failed to update itinerary' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { id } = await params;
    const db = await getDatabase();
    const result = await db.collection('itineraries').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Itinerary deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete itinerary error:', error);
    return NextResponse.json(
      { error: 'Failed to delete itinerary' },
      { status: 500 }
    );
  }
}
