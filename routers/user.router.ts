import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { changeEmail, changeName, changePassword, login, logout, register } from '../controllers/userController';
import { auth } from '../auth/auth';

export const userRouter = Router();

userRouter.route('/').post(register).all(methodNotAllowed);

userRouter.route('/login').post(login).all(methodNotAllowed);

userRouter.route('/logout').get(auth, logout).all(methodNotAllowed);

userRouter.route('/email').post(auth, changeEmail).all(methodNotAllowed);

userRouter.route('/pass').post(auth, changePassword).all(methodNotAllowed);

userRouter.route('/name').post(auth, changeName).all(methodNotAllowed);