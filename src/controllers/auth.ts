import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Validate } from '../decorators/validate';
import AuthSchema from '../schemas/auth';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

@Controller('/auth')
class AuthController {
    @Route('post', '/login')
    @Validate(AuthSchema.Login)
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user: any = await User.findOne({ username: req.body.username });
            const token = jwt.sign({ _id: user._id }, JWT_SECRET);
            return res.status(200).json({ jwt: token });
        } catch (error: any) {
            logging.error('error attempting login - no user with username: ', req.body.username);
            return res.status(400).json('invalid username');
        }
    }

    //@Route('post', '/change-password')
    //changePassword(req: Request, res: Response, next: NextFunction) {
    //    return res.status(200).json(res.locals.data);
    //}
}

export default AuthController;
