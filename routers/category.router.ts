import { Router } from 'express';
import { auth, restrictTo } from '../auth/auth';
import { UserRole } from '../types';
import { methodNotAllowed } from '../utils/error';
import {
  addCategory,
  getAllCategories,
  getCategory,
  deleteCategory,
  updateCategory,
} from '../controllers/categoryController';

export const categoryRouter = Router();

categoryRouter
  .route('/')
  .get(auth, restrictTo(UserRole.Editor, UserRole.Admin), getAllCategories)
  .post(auth, restrictTo(UserRole.Admin), addCategory)
  .all(methodNotAllowed);

categoryRouter
  .route('/:id')
  .get(auth, getCategory)
  .delete(auth, restrictTo(UserRole.Admin), deleteCategory)
  .patch(auth, restrictTo(UserRole.Admin), updateCategory)
  .all(methodNotAllowed);
