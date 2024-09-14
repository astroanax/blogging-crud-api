import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import './config/logging';
import 'reflect-metadata';

import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/loggingHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { declareHandler } from './middleware/declareHandler';
import { mongo, server } from './config/config';

import { defineRoutes } from './modules/routes';

import UserController from './controllers/user';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
    logging.log('initializing api');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.log('connecting to mongodb...');
    try {
        const connection = await mongoose.connect(mongo.MONGO_CONNECTION, mongo.MONGO_OPTIONS);
        logging.log('connected to mongodb: ', connection.version);
    } catch (error) {
        logging.error(error);
        logging.error('connection failed :( !!');
    }

    application.use(declareHandler);
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.log('defining user controller routing...');
    defineRoutes([UserController], application);

    logging.log('define routing errors...');
    application.use(routeNotFound);

    logging.log('starting server...');
    httpServer = http.createServer(application);
    httpServer.listen(server.SERVER_PORT, () => {
        logging.log(`server listening at ${server.SERVER_HOSTNAME}:${server.SERVER_PORT}`);
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
