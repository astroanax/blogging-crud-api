import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { Validate, ValidateOut } from '../decorators/validate';
import UserSchema from '../schemas/user';
import { User } from '../models/user';
import { MongoGet } from '../decorators/mongoose/get';
import { MongoGetAll } from '../decorators/mongoose/getAll';
import { MongoDelete } from '../decorators/mongoose/delete';
import { MongoQuery } from '../decorators/mongoose/query';
import { MongoUpdate } from '../decorators/mongoose/update';
import { MongoCreate } from '../decorators/mongoose/create';

@Controller('/users')
class UserController {
    @Route('get', '/get/all')
    @MongoGetAll(User)
    getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGetAll);
    }

    @Route('get', '/get/:id')
    @MongoGet(User)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoGet);
    }

    @Route('post', '/create')
    @Validate(UserSchema.UserCreate)
    @MongoCreate(User)
    @ValidateOut(UserSchema.UserCreateRead)
    create(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.mongoCreate);
    }

    @Route('post', '/query')
    @MongoQuery(User)
    query(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(req.mongoQuery);
    }

    @Route('patch', '/update/:id')
    @MongoUpdate(User)
    update(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(req.mongoUpdate);
    }

    @Route('delete', '/delete/:id')
    @MongoDelete(User)
    remove(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json({ message: 'Deleted' });
    }
}

export default UserController;
