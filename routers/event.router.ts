import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { addEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../controllers/eventController';
import { auth, restrictTo } from '../auth/auth';
import { UserRole } from '../types';

export const eventRouter = Router();

eventRouter.route('/').get(auth, getAllEvents).post(auth, restrictTo(UserRole.Editor), addEvent).all(methodNotAllowed);

eventRouter
  .route('/:id')
  .get(auth, getEvent)
  .delete(auth, deleteEvent)
  .patch(auth, updateEvent)
  .all(methodNotAllowed);