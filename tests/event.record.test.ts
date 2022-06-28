import { it, expect } from 'vitest';
import { NewEventEntity } from '../types';
import { EventRecord } from '../records/event.record';

const defaultObj: NewEventEntity = {
  name: 'Test event',
  description: 'Test event description',
  estimated_time: 180,
  lat: 20,
  lon: 50,
};

it('should build EventRecord', () => {
  const event = new EventRecord(defaultObj);

  expect(typeof event.eventId).toBe('string');
  expect(event.isEventChosen).toBe(false);
  expect(event.eventLink).toBeNull();
  expect(event.eventName).toBe(defaultObj.name);
  expect(event.eventDescription).toBe(defaultObj.description);
  expect(event.eventEstimatedTime).toBe(defaultObj.estimated_time);
  expect(event.eventLat).toBe((defaultObj.lat));
  expect(event.eventLon).toBe((defaultObj.lon));
});

