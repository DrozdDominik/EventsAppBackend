import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import {
  changeEmail,
  changeName,
  changePassword,
  changeRole,
  getAllUsers,
  login,
  logout,
  register,
} from '../controllers/userController';
import { auth, restrictTo } from '../auth/auth';
import { UserRole } from '../types';

export const userRouter = Router();

userRouter.route('/').get(auth, restrictTo(UserRole.Admin), getAllUsers).post(register).all(methodNotAllowed);

userRouter.route('/login').post(login).all(methodNotAllowed);

userRouter.route('/logout').get(auth, logout).all(methodNotAllowed);

userRouter.route('/email').post(auth, changeEmail).all(methodNotAllowed);

userRouter.route('/pass').post(auth, changePassword).all(methodNotAllowed);

userRouter.route('/name').post(auth, changeName).all(methodNotAllowed);

userRouter.route('/role').post(auth, restrictTo(UserRole.Admin), changeRole).all(methodNotAllowed);