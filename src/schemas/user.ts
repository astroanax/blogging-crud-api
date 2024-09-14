import { z } from 'zod';

// creating a schema for strings
const UserCreate = z.object({
    // see https://stackoverflow.com/a/12019115/13213725
    // username must be 3 to 24 chars long and can only contain alphanumeric chars, dots and underscores
    // see https://stackoverflow.com/a/3831442/13213725
    // username can't be a number
    username: z
        .string()
        .min(3)
        .max(20)
        .regex(/(?=^(?=.{3,24}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$)(?=(?!^d+$)^.+$)/),
    email: z.string().email(),
    // see https://stackoverflow.com/a/21456918/13213725
    //password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/),
    password: z.string(),
    name: z.string().min(3).max(30)
});

export default UserCreate;
