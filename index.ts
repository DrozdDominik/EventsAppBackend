import express from 'express';
import 'express-async-errors';

const app = express();

app.use(express.json());

app.listen(3000, '127.0.0.1', () => {
    console.log('Server is running on port 3000');
});