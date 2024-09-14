import mongoose, { Schema } from 'mongoose';

export const userSchema = new Schema({
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
});

export const User = mongoose.model('User', userSchema);
