import { it, expect} from 'vitest';
import {EventEntity} from "../types";
import {EventRecord} from "../records/event.record";

const defaultObj:EventEntity = {
    name: "Test event",
    description: "Test event description",
    estimated_time: 180,
    lat: 20,
    lon: 50,
}

it('should build EventRecord', () => {
 const event = new EventRecord(defaultObj);

 expect(typeof event.id).toBe("string");
 expect(event.isChosen).toBe(false);
 expect(event.link).toBeNull();
 expect(event.name).toBe("Test event");
 expect(event.description).toBe("Test event description");
 expect(event.estimatedTime).toBe(180);
});

