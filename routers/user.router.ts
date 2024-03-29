import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import {
  changeEmail,
  changeName,
  changePassword,
  changeRole,
  getAllUsers,
  getPermissionsRequestStatus,
  getRole,
  login,
  logout,
  permissionsRequest,
  register,
  selfUserAccountDelete,
  userAccountDeleteByAdmin,
  userName,
} from '../controllers/userController';
import { auth, restrictTo } from '../auth/auth';
import { UserRole } from '../types';

export const userRouter = Router();

userRouter
  .route('/')
  .get(auth, restrictTo(UserRole.Admin), getAllUsers)
  .post(register)
  .all(methodNotAllowed);

userRouter.route('/login').post(login).all(methodNotAllowed);

userRouter.route('/logout').get(auth, logout).all(methodNotAllowed);

userRouter.route('/email').patch(auth, changeEmail).all(methodNotAllowed);

userRouter.route('/pass').patch(auth, changePassword).all(methodNotAllowed);

userRouter
  .route('/name')
  .get(auth, userName)
  .patch(auth, changeName)
  .all(methodNotAllowed);

userRouter
  .route('/role')
  .get(auth, getRole)
  .patch(auth, restrictTo(UserRole.Admin), changeRole)
  .all(methodNotAllowed);

userRouter
  .route('/permissions')
  .get(auth, getPermissionsRequestStatus)
  .patch(auth, permissionsRequest)
  .all(methodNotAllowed);

userRouter
  .route('/delete')
  .delete(auth, selfUserAccountDelete)
  .all(methodNotAllowed);

userRouter
  .route('/admin/user')
  .delete(auth, restrictTo(UserRole.Admin), userAccountDeleteByAdmin)
  .all(methodNotAllowed);
