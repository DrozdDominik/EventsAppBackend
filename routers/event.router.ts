import { Router } from 'express';
import { methodNotAllowed } from '../utils/error';
import { addEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../controllers/eventController';

export const eventRouter = Router();

eventRouter.route('/').get(getAllEvents).post(addEvent).all(methodNotAllowed);

eventRouter
  .route('/:id')
  .get(getEvent)
  .delete(deleteEvent)
  .patch(updateEvent)
  .all(methodNotAllowed);