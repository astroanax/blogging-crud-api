import mongoose, { Document, Schema } from 'mongoose';
import { Blog } from './blog';
import { User } from './user';

interface IComment extends Document {
    author: mongoose.Types.ObjectId;
    content: string;
    blog: mongoose.Types.ObjectId;
}

const commentSchema: Schema<IComment> = new Schema(
    {
        author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        content: { type: String, required: true, minLength: 2, maxLength: 500 },
        blog: { type: Schema.Types.ObjectId, required: true, ref: 'Blog' }
    },
    { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export { IComment, Comment };
