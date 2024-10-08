import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Authenticated } from '../decorators/jwt';
import { Validate, ValidateQuery, ValidateOut } from '../decorators/validate';
import UserSchema from '../schemas/user';
import AuthSchema from '../schemas/auth';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/user';
import { MongoGet } from '../decorators/mongoose/user/get';
import { MongoGetAll } from '../decorators/mongoose/user/getAll';
import { MongoDelete } from '../decorators/mongoose/user/delete';
import { MongoQuery } from '../decorators/mongoose/user/query';
import { MongoUpdate } from '../decorators/mongoose/user/update';
import { MongoCreate } from '../decorators/mongoose/user/create';
import { MongoFollow, MongoFollowCount } from '../decorators/mongoose/user/follow';
import { MongoFullActivity, MongoGetTopUsers } from '../decorators/mongoose/user/pipelines';

@Controller('/users')
class UserController {
    @Route('get', '/all')
    @MongoGetAll(User)
    @ValidateOut(UserSchema.Read, true)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('get', '/top/')
    @ValidateQuery(UserSchema.TopQuery)
    @MongoGetTopUsers(User)
    getTopUsers(req: Request, res: Response, next: NextFunction) {
        return res.json(res.locals.data);
    }

    @Route('get', '/:id')
    @Validate(UserSchema.Id, true)
    @MongoGet(User)
    @ValidateOut(UserSchema.Read, false)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('post', '/new')
    @Validate(UserSchema.Create)
    @MongoCreate(User)
    @ValidateOut(UserSchema.Read, false)
    create(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
    }

    //@Route('post', '/query')
    //@MongoQuery(User)
    //query(req: Request, res: Response, next: NextFunction) {
    //    return res.status(200).json(req.mongoQuery);
    //}

    @Route('patch', '/:id')
    @Authenticated()
    @Validate(UserSchema.Id, true)
    @Validate(UserSchema.Update)
    @MongoUpdate(User)
    @ValidateOut(UserSchema.Read, false)
    update(req: Request, res: Response, next: NextFunction) {
        if (req.auth?._id != req.params.id) return res.status(401);
        return res.status(201).json(res.locals.data);
    }

    @Route('delete', '/:id')
    @Validate(UserSchema.Id, true)
    @Authenticated()
    @MongoDelete(User)
    remove(req: Request, res: Response, next: NextFunction) {
        if (req.auth?._id != req.params.id) return res.status(401);
        return res.status(204).json({});
    }

    @Route('put', '/follow/:id')
    @Authenticated()
    @Validate(UserSchema.Id, true)
    @MongoFollow(User, 'follow')
    follow(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json();
    }

    @Route('delete', '/follow/:id')
    @Authenticated()
    @Validate(UserSchema.Id, true)
    @MongoFollow(User, 'unfollow')
    unfollow(req: Request, res: Response, next: NextFunction) {
        return res.status(204).json();
    }

    @Route('delete', '/follower/:id')
    @Authenticated()
    @Validate(UserSchema.Id, true)
    @MongoFollow(User, 'remove')
    removeFollow(req: Request, res: Response, next: NextFunction) {
        return res.status(204).json();
    }

    @Route('get', '/followers/:id')
    @Validate(UserSchema.Id, true)
    @MongoFollowCount(User)
    followCount(req: Request, res: Response, next: NextFunction) {
        return res.json(res.locals.data);
    }

    @Route('get', '/fullactivity/:id')
    @Validate(UserSchema.Id, true)
    @MongoFullActivity(User)
    fullActivity(req: Request, res: Response, next: NextFunction) {
        return res.json(res.locals.data);
    }
}

export default UserController;
