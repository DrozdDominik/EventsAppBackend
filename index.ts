import express from 'express';
import 'express-async-errors';
import './utils/db';
import {config} from './config/config';
import {handleError, handleNotFound } from './utils/error';

const app = express();

app.use(express.json());

app.use(handleNotFound);

app.use(handleError);

app.listen(config.port, '127.0.0.1', () => {
    console.log(`Server is running on port ${config.port}`);
});