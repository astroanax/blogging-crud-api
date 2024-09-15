import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';

export function Validate<T = any>(schema: any, params: boolean = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                if (params) target = req.params;
                else target = req.body;
                await schema.parseAsync(target);
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

export function ValidateOut<T = any>(schema: any, array: boolean = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                if (!array) {
                    const parsed = await schema.parseAsync(res.locals.data);
                    const filteredData = _.pick(parsed, Object.keys(schema.shape));
                    res.locals.data = filteredData;
                } else {
                    const filteredData = await Promise.all(
                        res.locals.data.map(async (item: any) => {
                            const parsed = await schema.parseAsync(item);
                            _.pick(item, Object.keys(schema.shape));
                            const filtered = _.pick(item, Object.keys(schema.shape));
                            return filtered;
                        })
                    );
                    res.locals.data = filteredData;
                }
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
