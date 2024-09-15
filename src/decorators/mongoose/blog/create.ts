import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';

export function MongoCreate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: any, res: Response, next: NextFunction) {
            try {
                const document = new model({
                    _id: new mongoose.Types.ObjectId(),
                    author: req.auth._id,
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
