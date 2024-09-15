import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

export function MongoCommentDelete(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findOneAndDelete({ _id: req.params.comment_id, author: req.auth?._id, blog: req.params.id });

                if (!document) return res.sendStatus(404);
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
