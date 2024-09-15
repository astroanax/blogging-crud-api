import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';

export function MongoFullActivity(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const userData = await model.aggregate([
                    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },

                    {
                        $lookup: {
                            from: 'blogs',
                            localField: '_id',
                            foreignField: 'author',
                            as: 'blogs'
                        }
                    },

                    {
                        $unwind: '$blogs'
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: 'blogs._id',
                            foreignField: 'blog',
                            as: 'blogs.comments'
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            username: { $first: '$username' },
                            email: { $first: '$email' },
                            posts: { $push: '$blogs' }
                        }
                    }
                ]);
                res.locals.data = userData;
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

export function MongoGetTopUsers(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                // sorted by followers
                let limit: number;
                if (!req.query?.limit) limit = 5;
                else limit = +req.query?.limit;
                const topUsers = await model.aggregate([
                    {
                        $addFields: {
                            followerCount: { $size: '$followers' }
                        }
                    },
                    {
                        $sort: { followerCount: -1 }
                    },
                    {
                        $limit: limit
                    },
                    {
                        $project: {
                            username: 1,
                            followerCount: 1
                        }
                    }
                ]);
                res.locals.data = topUsers;
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
