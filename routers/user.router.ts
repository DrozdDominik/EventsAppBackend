import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { login, logout, register } from '../controllers/userController';
import { auth } from '../auth/auth';

export const userRouter = Router();

userRouter.route('/').post(register).all(methodNotAllowed);

userRouter.route('/login').post(login).all(methodNotAllowed);

userRouter.route('/logout').get(auth, logout).all(methodNotAllowed);