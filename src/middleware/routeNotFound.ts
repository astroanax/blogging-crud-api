import { Request, Response, NextFunction } from 'express';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error('route not found');
    logging.warning(error.message + ' for request ' + req.method + ' ' + req.url);

    res.status(404).json({
        error: {
            message: error.message
        }
    });
}
