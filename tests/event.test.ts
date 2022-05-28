import {it, expect, afterAll} from 'vitest';
import {NewEventEntity} from "../types";
import {pool} from "../utils/db";
import {EventRecord} from "../records/event.record";


const defaultObj: NewEventEntity = {
    name: "Test event name",
    description: "Dummy description",
    is_chosen: true,
    estimated_time: 150,
    lat: 21.23,
    lon: 50.03,
}

afterAll(async () => {
    await pool.end();
});

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