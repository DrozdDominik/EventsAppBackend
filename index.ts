import express from 'express';
import 'express-async-errors';
import './utils/db';
import {config} from './config/config';
import {handleError, handleNotFound } from './utils/error';

const app = express();

app.use(express.json());

app.use(handleNotFound);

app.use(handleError);

process.on('uncaughtException', (err: Error) => {
    console.log('Unhandled exception! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const server = app.listen(config.port, '127.0.0.1', () => {
    console.log(`Server is running on port ${config.port}`);
});

process.on('unhandledRejection', (err: Error) => {
    console.log('Unhandled rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});