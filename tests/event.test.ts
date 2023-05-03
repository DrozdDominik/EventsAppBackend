import { it, expect, afterAll, describe, beforeAll } from 'vitest';
import { faker } from '@faker-js/faker';
import { NewEventEntity } from '../types';
import { pool } from '../utils/db';
import { EventRecord } from '../records/event.record';
import { FieldPacket } from 'mysql2/promise';
import { CategoryRecord } from '../records/category.record';

let defaultObj: NewEventEntity;
let objToTests: NewEventEntity;
let categoriesIds: CategoryRecord[];

beforeAll(async () => {
  categoriesIds = await CategoryRecord.getAll();

  defaultObj = {
    name: 'Test event name',
    description: 'Dummy description',
    isChosen: true,
    duration: 150,
    date: '2023-05-28',
    lat: 21.23,
    lon: 50.03,
    userId: faker.datatype.uuid(),
    categoryId: categoriesIds[0].categoryId,
  };

  objToTests = {
    name: 'Delete me',
    description: 'Testing delete functionality.',
    duration: 45,
    date: '2023-06-02',
    lat: 20.44,
    lon: 34.87,
    userId: faker.datatype.uuid(),
    categoryId: categoriesIds[0].categoryId,
  };
}, 5000);

afterAll(async () => {
  await pool.execute("DELETE FROM `events` WHERE `name` LIKE 'Test%'");
  await pool.execute("DELETE FROM `events` WHERE `name` = 'Updated event';");
  await pool.end();
});

describe('EventRecord.getOne()', () => {
  it('should returns null when given invalid event id.', async () => {
    const invalidId = faker.datatype.uuid();
    const event = await EventRecord.getOne(invalidId);

    expect(event).toBeNull();
  });
});

describe('EventRecord.insert()', () => {
  it('should returns new UUID.', async () => {
    const event = new EventRecord(defaultObj);
    const id = await event.insert();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });
});

describe('EventRecord.getAll()', () => {
  it('should returns array of all entries.', async () => {
    const events = await EventRecord.getAll();

    const [results] = (await pool.execute(
      'SELECT COUNT(`id`) AS `count` FROM `events`;',
    )) as [[{ count: number }], FieldPacket[]];

    const numberOfEvents = results[0].count;

    expect(events).not.toEqual([]);
    expect(events[0].id).toBeDefined();
    expect(events.length).toBe(numberOfEvents);
  });

  it('should returns data without "link"', async () => {
    const events = await EventRecord.getAll();

    expect(events[0]).not.property('link');
  });
});

describe('EventRecord.findAll()', () => {
  it('should returns array of found entries.', async () => {
    const events = await EventRecord.findAll('');

    expect(events).not.toEqual([]);
    expect(events[0].id).toBeDefined();
  });

  it('should returns array of found entries when searching for "Test".', async () => {
    const events = await EventRecord.findAll('Test');

    expect(events).not.toEqual([]);
    expect(events[0].id).toBeDefined();
  });

  it('should returns empty array when searching for something that does not exists.', async () => {
    const events = await EventRecord.findAll('xxx');

    expect(events).toEqual([]);
  });

  it('should returns data without "description", "isChosen", "duration" and "link".', async () => {
    const events = await EventRecord.findAll('');

    expect(events[0]).not.property('description');
    expect(events[0]).not.property('isChosen');
    expect(events[0]).not.property('estimatedTime');
    expect(events[0]).not.property('link');
  });
});

describe('EventRecord.delete()', () => {
  it('should returns true when delete operation succeed', async () => {
    const event = new EventRecord(objToTests);
    await event.insert();

    const result = await event.delete();

    expect(result).toBe(true);
  });
});

describe('EventRecord.update()', () => {
  it('should returns true when update operation succeed', async () => {
    const event = new EventRecord(objToTests);
    await event.insert();

    event.eventName = 'Updated event';
    event.eventDescription = 'New content.';
    event.isEventChosen = true;
    event.eventDuration = 88;
    event.eventLink = 'https://example.link';
    event.eventCategoryId = categoriesIds[1].categoryId;

    const updatedColumns = [
      'name',
      'description',
      'isChosen',
      'duration',
      'link',
      'categoryId',
    ];

    const result = await event.update(updatedColumns);

    expect(result).toBe(true);
  });
});
