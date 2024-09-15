import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';
import { Blog } from '../../../models/blog';

export function MongoCommentCreate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const blog = Blog.findById(req.params.id);

                if (!blog) return res.status(400).json({ message: 'blog not found' });

                const document = new model({
                    _id: new mongoose.Types.ObjectId(),
                    author: req.auth?._id,
                    blog: req.params.id,
                    ...req.body
                });

                await document.save();

                res.locals.data = document;
            } catch (error: any) {
                if (error.name === 'MongoServerError' && error.code === 11000) {
                    logging.error('duplicate key error');
                    return res.status(422).json(error);
                } else {
                    logging.error('unknown error: ', error);
                    return res.status(500).json(error);
                }
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
