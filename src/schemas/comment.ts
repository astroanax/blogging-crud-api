import { z } from 'zod';
import mongoose from 'mongoose';

const Create = z.object({
    content: z.string().min(5).max(500)
});

const Read = Create.extend({
    _id: z.custom<mongoose.Types.ObjectId>(),
    author: z.custom<mongoose.Types.ObjectId>(),
    blog: z.custom<mongoose.Types.ObjectId>()
});
const Update = Create;

const Id = z.object({
    comment_id: z.string().regex(/^[a-f\d]{24}$/i)
});

export default { Create, Read, Update, Id };
