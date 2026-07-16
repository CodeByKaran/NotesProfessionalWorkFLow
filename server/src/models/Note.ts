
import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
    {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] }
},
{
    timestamps: true,
}
);

export default mongoose.model<INote>('Note', NoteSchema);