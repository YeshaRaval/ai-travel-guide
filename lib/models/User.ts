import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItinerary {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
  accommodation: string;
  pace: string;
  additionalNotes: string;
  content: string;
  chatHistory: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
