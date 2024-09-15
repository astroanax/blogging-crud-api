import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

export function MongoCommentGet(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findById(req.params.id);

                if (document) {
                    res.locals.data = document;
                } else {
                    return res.status(400).json({ error: 'Not found' });
                }
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
