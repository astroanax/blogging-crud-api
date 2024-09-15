import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/config';
import { expressjwt } from 'express-jwt';
import express from 'express';

const jwtMiddleware = expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256']
});

export function Authenticated<T = any>() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            jwtMiddleware(req, res, (err: any) => {
                if (err)
                    return res.sendStatus(401); // Unauthorized
                else return originalMethod.call(this, req, res, next);
            });
        };

        return descriptor;
    };
}
