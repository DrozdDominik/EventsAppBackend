import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import './utils/db';
import './auth/jwt.stategy';
import { config } from './config/config';
import { handleError, handleNotFound } from './utils/error';
import { eventRouter } from './routers/event.router';
import { userRouter } from './routers/user.router';
import { apiLimiter, userLimiter } from './utils/limiter';

const app = express();

app.use(cors({ credentials: true, origin: config.corsOrigin }));
app.use(helmet());
app.use('/api', apiLimiter);
app.use('/user', userLimiter);
app.use(express.json());
app.use(cookieParser());


app.use('/api/event', eventRouter);
app.use('/user', userRouter);

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