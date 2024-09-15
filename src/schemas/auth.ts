import { z } from 'zod';
import mongoose from 'mongoose';

const Login = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8).max(20)
});

export default { Login };
