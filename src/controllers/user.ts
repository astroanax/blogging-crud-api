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
    @ValidateOut(UserSchema.Read, true)
    getAll(req: Request, res: Response, next: NextFunction) {
        logging.error('1111111111111111111111111111111111');
        logging.error(res.locals.data);
        return res.status(200).json(res.locals.data);
    }

    @Route('get', '/get/:id')
    @MongoGet(User)
    @ValidateOut(UserSchema.Read, false)
    get(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json(res.locals.data);
    }

    @Route('post', '/create')
    @Validate(UserSchema.Create)
    @MongoCreate(User)
    @ValidateOut(UserSchema.Read, false)
    create(req: Request, res: Response, next: NextFunction) {
        return res.status(201).json(res.locals.data);
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
