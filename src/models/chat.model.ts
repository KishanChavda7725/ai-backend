import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  name: string;
  createdAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Chat = mongoose.model<IChat>('chat', ChatSchema);
