import { Request, Response } from 'express';
import { EventRecord } from '../records/event.record';
import { NewEventData, NewEventEntity } from '../types';
import { AppError } from '../utils/error';
import { EventUpdate } from '../types/event/event-update';
import { validate } from 'uuid';
import { UserRecord } from '../records/user.record';

export const getAllEvents = async (req: Request, res: Response) => {
  const events = await EventRecord.getAll();
  res.json({ events });
};

export const addEvent = async (req: Request, res: Response) => {
  const userId = (req.user as UserRecord).userId;
  const requestData = req.body as NewEventData;

  const obj: NewEventEntity = {
    ...requestData,
    userId,
  };

  const event = new EventRecord(obj);

  const eventId = await event.insert();

  res.status(201).json(eventId);
};

export const getEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id', 400);
  }

  const event = await EventRecord.getOne(id);

  if (!event) {
    throw new AppError('There is no event with the given id', 404);
  }

  delete event.validationErrors

  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id', 400);
  }

  const event = await EventRecord.getOne(id);

  if (!event) {
    throw new AppError('There is no event with the given id', 404);
  }

  if (!(await event.delete())) {
    throw new AppError('Sorry delete operation failed.', 500);
  }

  res.status(204).json(null);
};

export const updateEvent = async (req: Request, res: Response) => {
  const id = req.params.id;
  const obj: EventUpdate = req.body;

  if (!validate(id)) {
    throw new AppError('Provided invalid event id.', 400);
  }

  const event = await EventRecord.getOne(id);

  if (!event) {
    throw new AppError('There is no event with the given id', 404);
  }

  const keys = Object.keys(obj);

  if (obj.name) {
    event.eventName = obj.name;
  }

  if (obj.description) {
    event.eventDescription = obj.description;
  }

  if (obj.isChosen) {
    event.isEventChosen = obj.isChosen;
  }

  if (obj.estimatedTime) {
    event.eventEstimatedTime = obj.estimatedTime;
  }

  if (obj.link || obj.link === '') {
    event.eventLink = obj.link;
  }

  if (!(await event.update(keys))) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  res.json({ event });
};