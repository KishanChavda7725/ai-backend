import mongoose, { Schema, Document, Types  } from 'mongoose';

export interface ISearch extends Document {
  chatId: Types.ObjectId; // 
  prompt: string;
  images: string[];
  result: string;
  resImages:string[];
  createdAt: Date;
}

const SearchSchema: Schema = new Schema<ISearch>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'chat', required: true },
    prompt: { type: String, required: true },
    images: [{ type: String }], // Store image paths
    result: { type: String },
    resImages:[{ type: String }],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Search = mongoose.model<ISearch>('Search', SearchSchema);
