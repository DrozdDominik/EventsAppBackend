import express from 'express';
import 'express-async-errors';
import {handleError, handleNotFound } from './utils/error';

const app = express();

app.use(express.json());

app.use(handleNotFound);

app.use(handleError);

app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running on port 3000');
});