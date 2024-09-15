import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 5,
            maxLength: 50
        },
        content: { type: String, required: true, minLength: 10, maxLength: 2500 },
        author: { type: mongoose.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

export const Blog = mongoose.model('Blog', blogSchema);
