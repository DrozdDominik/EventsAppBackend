import {it, expect, afterAll, describe} from 'vitest';
import {NewEventEntity} from "../types";
import {pool} from "../utils/db";
import {EventRecord} from "../records/event.record";
import {FieldPacket} from "mysql2/promise";

const defaultObj: NewEventEntity = {
    name: "Test event name",
    description: "Dummy description",
    is_chosen: true,
    estimated_time: 150,
    lat: 21.23,
    lon: 50.03,
}

const objToTests: NewEventEntity = {
    name: "Delete me",
    description: "Testing delete functionality.",
    estimated_time: 45,
    lat: 20.44,
    lon: 34.87,
}

afterAll(async () => {
    await pool.execute("DELETE FROM `events` WHERE `name` LIKE 'Test%'");
    await pool.execute("DELETE FROM `events` WHERE `name` = 'Updated event';");
    await pool.end();
});

describe('EventRecord.insert()', () => {
    it('should returns new UUID.', async () => {
        const event = new EventRecord(defaultObj);
        const id = await event.insert();

        expect(id).toBeDefined();
        expect(typeof id).toBe('string');
    });

    it('should inserts data to database.', async () => {
        const event = new EventRecord(defaultObj);
        const id = await event.insert();

        const foundEvent = await EventRecord.getOne(id);

        expect(foundEvent).toBeDefined();
        expect(foundEvent).not.toBeNull();
        expect(foundEvent.id).toBe(event.id);
    });
});


describe('EventRecord.getAll()', () => {
    it('should returns array of all entries.',async () => {
        const events = await EventRecord.getAll();

        const [results] = (await pool.execute('SELECT COUNT(`id`) AS `count` FROM `events`;')) as [[{'count': number}], FieldPacket[]] ;

        const numberOfEvents = results[0].count;

        expect(events).not.toEqual([]);
        expect(events[0].id).toBeDefined();
        expect(events.length).toBe(numberOfEvents);
    });

    it('should returns data without "link", "lat" and "lon".', async () => {
        const events = await EventRecord.getAll();

        expect(events[0]).not.property('link');
        expect(events[0]).not.property('lat');
        expect(events[0]).not.property('lon');
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

    it('should returns data without "description", "isChosen", "estimatedTime" and "link".', async () => {
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

        event.name = "Updated event";
        event.description = "New content.";
        event.isChosen = true;
        event.estimatedTime = 88;
        event.link = "https://example.link";

        const updatedColumns = ['name', 'description', 'isChosen', 'estimatedTime', 'link'];

        const result = await event.update(updatedColumns);

        expect(result).toBe(true);
    });
});

