import passport from 'passport';
import { UserRole } from '../types';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';
import { UserRecord } from '../records/user.record';

export const auth = passport.authenticate('jwt', { session: false });

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!roles.includes((req.user as UserRecord).userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};