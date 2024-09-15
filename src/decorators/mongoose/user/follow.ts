import { Request, Response, NextFunction } from 'express';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../../../models/user';

export function MongoFollow(model: Model<any>, action: string = 'follow') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                let targetUser: IUser | null = null;
                let User: IUser | null = null;
                if (action == 'unfollow') {
                    targetUser = await model.findByIdAndUpdate(req.params.id, { $pull: { followers: req.auth?._id } });
                    User = await model.findByIdAndUpdate(req.auth?._id, { $pull: { following: req.params.id } });
                } else if (action == 'remove') {
                    targetUser = await model.findByIdAndUpdate(req.params.id, { $pull: { following: req.auth?._id } });
                    User = await model.findByIdAndUpdate(req.auth?._id, { $pull: { followers: req.params.id } });
                } else {
                    // default follow
                    targetUser = await model.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.auth?._id } });
                    User = await model.findByIdAndUpdate(req.auth?._id, { $addToSet: { following: req.params.id } });
                }
                if (!targetUser) {
                    return res.status(404).json({ message: 'user not found :( !!' });
                }

                await targetUser?.save();
                await User?.save();

                res.locals.data = '';
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}

export function MongoFollowCount(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const userFollowCount = await model.aggregate([
                    {
                        $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
                    },
                    {
                        $addFields: {
                            followers: { $size: '$followers' },
                            following: { $size: '$following' }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            followers: 1,
                            following: 1
                        }
                    }
                ]);
                res.locals.data = userFollowCount;
            } catch (error) {
                logging.error(error);

                return res.status(400).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
