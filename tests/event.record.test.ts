import { it, expect } from 'vitest';
import { NewEventEntity } from '../types';
import { EventRecord } from '../records/event.record';
import { faker } from '@faker-js/faker';

const defaultObj: NewEventEntity = {
  name: 'Test event',
  description: 'Test event description',
  estimatedTime: 180,
  lat: 20,
  lon: 50,
  userId: faker.datatype.uuid(),
  categoryId: faker.datatype.uuid(),
};

it('should build EventRecord', () => {
  const event = new EventRecord(defaultObj);

  expect(typeof event.eventId).toBe('string');
  expect(event.isEventChosen).toBe(false);
  expect(event.eventLink).toBeNull();
  expect(event.eventName).toBe(defaultObj.name);
  expect(event.eventDescription).toBe(defaultObj.description);
  expect(event.eventEstimatedTime).toBe(defaultObj.estimatedTime);
  expect(event.eventLat).toBe(defaultObj.lat);
  expect(event.eventLon).toBe(defaultObj.lon);
  expect(event.eventUserId).toBe(defaultObj.userId);
  expect(event.eventCategoryId).toBe(defaultObj.categoryId);
});
