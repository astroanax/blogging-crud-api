import mongoose, { Schema, Document } from 'mongoose';
import { Blog } from './blog';
import { Comment } from './comment';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
}
export const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 20
        },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true, minLength: 3, maxLength: 30 }
    },
    { timestamps: true }
);

userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err: any) {
        return next(err);
    }
});
// delete all associated posts
userSchema.post('findOneAndDelete', async function remove(doc, next) {
    try {
        await Blog.deleteMany({ author: doc._id });
        next();
    } catch (error: any) {
        next(error);
    }
});
// delete all associated comments
userSchema.post('findOneAndDelete', async function remove(doc, next) {
    try {
        await Comment.deleteMany({ author: doc._id });
        next();
    } catch (error: any) {
        next(error);
    }
});
userSchema.methods.validatePassword = async function validatePassword(data: string) {
    return bcrypt.compare(data, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
