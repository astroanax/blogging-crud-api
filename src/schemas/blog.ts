import { z } from 'zod';
import mongoose from 'mongoose';

const Create = z.object({
    title: z.string().min(3).max(50),
    content: z.string().min(10).max(2500)
});

const Read = Create.extend({
    _id: z.custom<mongoose.Types.ObjectId>(),
    author: z.custom<mongoose.Types.ObjectId>()
});
const Update = Create.partial();

const Id = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i)
});

export default { Create, Read, Update, Id};
