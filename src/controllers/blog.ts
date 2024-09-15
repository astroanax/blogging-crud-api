import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Authenticated } from '../decorators/jwt';
import { Validate, ValidateOut } from '../decorators/validate';
import BlogSchema from '../schemas/blog';
import AuthSchema from '../schemas/auth';
import CommentSchema from '../schemas/comment';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import { MongoGet } from '../decorators/mongoose/blog/get';
import { MongoGetAll } from '../decorators/mongoose/blog/getAll';
import { MongoDelete } from '../decorators/mongoose/blog/delete';
import { MongoUpdate } from '../decorators/mongoose/blog/update';
import { MongoCreate } from '../decorators/mongoose/blog/create';
import { MongoCommentGet } from '../decorators/mongoose/comment/get';
import { MongoCommentGetAll } from '../decorators/mongoose/comment/getAll';
import { MongoCommentDelete } from '../decorators/mongoose/comment/delete';
import { MongoCommentUpdate } from '../decorators/mongoose/comment/update';
import { MongoCommentCreate } from '../decorators/mongoose/comment/create';

@Controller('/blogs')
class BlogController {
    @Route('get', '/all')
    @MongoGetAll(Blog)
    @ValidateOut(BlogSchema.Read, true)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('get', '/:id')
    @Validate(BlogSchema.Id, true)
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
    @Validate(BlogSchema.Id, true)
    @Validate(BlogSchema.Update)
    @MongoUpdate(Blog)
    @ValidateOut(BlogSchema.Read, false)
    update(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('delete', '/:id')
    @Authenticated()
    @Validate(BlogSchema.Id, true)
    @MongoDelete(Blog)
    remove(req: Request, res: Response, next: NextFunction) {
        return res.status(204).json({});
    }

    @Route('get', '/:id/comments/all')
    @Validate(BlogSchema.Id)
    @MongoCommentGetAll(Comment)
    @ValidateOut(CommentSchema.Read, true)
    getAllComments(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('post', '/:id/comments/new')
    @Authenticated()
    @Validate(BlogSchema.Id, true)
    @Validate(CommentSchema.Create)
    @MongoCommentCreate(Comment)
    @ValidateOut(CommentSchema.Read, false)
    createComment(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('patch', '/:id/comments/:comment_id')
    @Authenticated()
    @Validate(BlogSchema.Id.merge(CommentSchema.Id), true)
    @Validate(CommentSchema.Update)
    @MongoCommentUpdate(Comment)
    @ValidateOut(CommentSchema.Read, false)
    updateComment(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    @Route('delete', '/:id/comments/:comment_id')
    @Authenticated()
    @Validate(BlogSchema.Id.merge(CommentSchema.Id), true)
    @MongoCommentDelete(Comment)
    deleteComment(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }
}

export default BlogController;
