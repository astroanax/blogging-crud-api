import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Authenticated } from '../decorators/jwt';
import { Validate, ValidateOut } from '../decorators/validate';
import BlogSchema from '../schemas/blog';
import AuthSchema from '../schemas/auth';
import { Blog } from '../models/blog';
import { MongoGet } from '../decorators/mongoose/blog/get';
import { MongoGetAll } from '../decorators/mongoose/blog/getAll';
import { MongoDelete } from '../decorators/mongoose/blog/delete';
import { MongoUpdate } from '../decorators/mongoose/blog/update';
import { MongoCreate } from '../decorators/mongoose/blog/create';

interface AuthRequest extends Request {
    auth?: any;
}

@Controller('/posts')
class BlogController {
    @Route('get', '/all')
    @MongoGetAll(Blog)
    @ValidateOut(BlogSchema.Read, true)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('get', '/:id')
    @MongoGet(Blog)
    @ValidateOut(BlogSchema.Read, false)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('post', '/new')
    @Authenticated()
    @Validate(BlogSchema.Create)
    @MongoCreate(Blog)
    @ValidateOut(BlogSchema.Read, false)
    create(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('patch', '/:id')
    @Authenticated()
    @Validate(BlogSchema.Update)
    @MongoUpdate(Blog)
    @ValidateOut(BlogSchema.Read, false)
    update(req: AuthRequest, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('delete', '/:id')
    @Authenticated()
    @MongoDelete(Blog)
    remove(req: AuthRequest, res: Response, next: NextFunction) {
        return res.status(204).json({});
    }
}

export default BlogController;
