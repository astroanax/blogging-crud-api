import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export function Validate<T = any>(schema: any) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                await schema.parseAsync(req.body);
                return originalMethod.call(this, req, res, next);
            } catch (error: any) {
                logging.error('validation error');
                logging.error(error);
                return res.status(422).json({ errors: error });
            }
        };

        return descriptor;
    };
}
