import mongoose, { Schema } from 'mongoose';
import { User } from './user';
import { IComment, Comment } from './comment';

interface IBlog extends Document {
    _id: string;
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    comments: IComment[];
}
export const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 50
        },
        content: { type: String, required: true, minLength: 10, maxLength: 2500 },
        author: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    },
    { timestamps: true }
);
// delete all associated comments
blogSchema.pre<IBlog>('deleteOne', async function remove(next) {
    try {
        await Comment.deleteMany({ blog: this._id });
        next();
    } catch (error: any) {
        next(error);
    }
});
export const Blog = mongoose.model<IBlog>('Blog', blogSchema);
