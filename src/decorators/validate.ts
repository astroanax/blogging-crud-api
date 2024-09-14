import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import * as _ from 'lodash';

export function Validate<T = any>(schema: any) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                await schema.parseAsync(req.body);
            } catch (error: any) {
                logging.error('validation error');
                logging.error(error);
                return res.status(422).json({ errors: error });
            }
            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

export function ValidateOut<T = any>(schema: any) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const parsed = await schema.parseAsync(res.locals.mongoCreate);
                const filteredData = _.pick(parsed, Object.keys(schema.shape));
                res.locals.mongoCreate = filteredData;
            } catch (error: any) {
                logging.error('response validation error :( !!');
                logging.error(error);
                return res.status(422);
            }
            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
