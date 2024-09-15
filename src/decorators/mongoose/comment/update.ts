import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

export function MongoCommentUpdate(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findOne({ _id: req.params.comment_id, author: req.auth?._id, blog: req.params.id });

                if (!document) {
                    return res.status(404).json({ message: 'not found' });
                }

                document.set({ ...req.body });

                await document.save();

                res.locals.data = document;
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
