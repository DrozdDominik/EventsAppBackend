import { FieldPacket, ResultSetHeader } from 'mysql2/promise';
import { v4 as uuid, validate } from 'uuid';
import {
  MainEventData,
  MainEventEntityResult,
  NewEventEntity,
  NewEventEntityProperties,
  SimpleEventEntity,
} from '../types';
import { pool } from '../utils/db';
import { AppError } from '../utils/error';
import { UpdateProperty } from '../types/event/event-update';
import { convertCamelCaseToSnakeCase, convertSnakeCaseToCamelCase } from '../utils/auxiliaryMethods';

type EventRecordResults = [NewEventEntity[], FieldPacket[]];
type MainEventRecordResults = [MainEventEntityResult[], FieldPacket[]];
type SimpleEventRecordResults = [SimpleEventEntity[], FieldPacket[]];

export class EventRecord {
  private readonly id: string;
  private name: string;
  private description: string;
  private isChosen: boolean;
  private estimatedTime: number;
  private link: string | null;
  private lat: number;
  private lon: number;
  private userId: string;
  public validationErrors: string[] = [];

  constructor(obj: NewEventEntity) {
    this.id = obj.id ?? uuid();
    this.isChosen = obj.isChosen ?? false;
    this.link = obj.link ?? null;

    if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
      this.validationErrors.push(
        `Event name length must be between 3 and 50 characters - now is ${obj.name.length}.`,
      );
    }

    if (
      !obj.description ||
      obj.description.length < 10 ||
      obj.description.length > 500
    ) {
      this.validationErrors.push(
        `Event description length must be between 10 and 500 characters - now is ${obj.description.length}.`,
      );
    }

    if (obj.estimatedTime <= 0) {
      this.validationErrors.push(
        'Event estimated time must be greater then zero.',
      );
    }

    if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
      this.validationErrors.push(
        'Coordinates must be numbers.',
      );
    }

    if (!obj.userId || !validate(obj.userId)) {
      this.validationErrors.push(
        'Invalid userId.',
      );
    }

    if (this.validationErrors.length > 0) {
      throw new AppError(this.validationErrors.join('|'), 422);
    }

    this.name = obj.name;
    this.description = obj.description;
    this.estimatedTime = obj.estimatedTime;
    this.lat = obj.lat;
    this.lon = obj.lon;
    this.userId = obj.userId;
  }

  get eventId() {
    return this.id;
  }

  get eventName() {
    return this.name;
  }

  set eventName(name: string) {
    if (!name || name.length < 3 || name.length > 50) {
      this.validationErrors.push(
        `Event name length must be between 3 and 50 characters - now is ${name.length}.`,
      );
    } else {
      this.name = name;
    }
  }

  get eventDescription() {
    return this.description;
  }

  set eventDescription(description: string) {
    if (!description || description.length < 10 || description.length > 500) {
      this.validationErrors.push(
        `Event description length must be between 10 and 500 characters - now is ${description.length}.`,
      );
    } else {
      this.description = description;
    }
  }

  get isEventChosen() {
    return this.isChosen;
  }

  set isEventChosen(isChosen: boolean) {
    this.isChosen = isChosen;
  }

  get eventEstimatedTime() {
    return this.estimatedTime;
  }

  set eventEstimatedTime(estimatedTime: number) {
    if (estimatedTime <= 0) {
      this.validationErrors.push(
        'Event estimated time must be greater then zero.',
      );
    } else {
      this.estimatedTime = estimatedTime;
    }
  }

  get eventLink() {
    return this.link;
  }

  set eventLink(link: string) {
    if (link === '') {
      this.link = null;
    } else {
      this.link = link;
    }
  }

  get eventLat() {
    return this.lat;
  }

  set eventLat(lat: number) {
    if (typeof lat !== 'number') {
      this.validationErrors.push(
        'Coordinates must be numbers.',
      );
    }
    this.lat = lat;
  }

  get eventLon() {
    return this.lon;
  }

  set eventLon(lon: number) {
    if (typeof lon !== 'number') {
      this.validationErrors.push(
        'Coordinates must be numbers.',
      );
    }
    this.lon = lon;
  }

  get eventUserId() {
    return this.userId;
  }

  set eventUserId(userId: string) {
    if (!validate(userId)) {
      throw new AppError('Invalid userId', 400);
    }
    this.userId = userId;
  }

  public async insert(): Promise<string> {
    await pool.execute(
      'INSERT INTO `events` VALUES (:id, :name, :description, :is_chosen, :estimated_time, :link, :lat, :lon, :user_id);',
      {
        id: this.id,
        name: this.name,
        description: this.description,
        is_chosen: this.isChosen,
        estimated_time: this.estimatedTime,
        link: this.link,
        lat: this.lat,
        lon: this.lon,
        user_id: this.userId,
      },
    );

    return this.id;
  }

  public static async getOne(id: string): Promise<EventRecord> | null {
    const [results] = (await pool.execute(
      'SELECT * FROM `events` WHERE `id` = :id;',
      {
        id,
      },
    )) as EventRecordResults;

    if (results.length === 0) {
      return null;
    } else {
      const correctObj = Object.keys(results[0]).reduce(
        (obj, key: NewEventEntityProperties) => ({
          ...obj,
          [convertSnakeCaseToCamelCase(key)]: results[0][key],
        }),
        {},
      );

      return new EventRecord(correctObj as NewEventEntity);
    }
  }

  public static async getAll(): Promise<MainEventData[]> {
    const [results] = (await pool.execute(
      'SELECT `id`, `name`, `description`, `is_chosen`, `estimated_time`, `user_id` FROM `events`;',
    )) as MainEventRecordResults;

    return results.map((result) => {
      const { id, name, description, is_chosen, estimated_time, user_id } = result;

      return {
        id,
        name,
        description,
        isChosen: is_chosen,
        estimatedTime: estimated_time,
        userId: user_id,
      };
    });
  }

  public static async findAll(name: string): Promise<SimpleEventEntity[]> {
    const [results] = (await pool.execute(
      'SELECT `id`, `name`, `lat`, `lon` FROM `events` WHERE `name` LIKE :search;', {
        search: `%${name}%`,
      },
    )) as SimpleEventRecordResults;

    return results.map((result) => {
      const { id, name, lat, lon } = result;

      return {
        id, name, lat, lon,
      };
    });
  }

  public async delete(): Promise<boolean> {
    const [results] = (await pool.execute(
      'DELETE FROM `events` WHERE `id` = :id;',
      {
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public async update(columnsToUpdate: string[]): Promise<boolean> {
    if (this.validationErrors.length > 0) {
      throw new AppError(this.validationErrors.join('|'), 422);
    }

    let sql = 'UPDATE `events` SET';

    columnsToUpdate.forEach(column => sql += ` ${convertCamelCaseToSnakeCase(column)} = :${column},`);

    sql = sql.substring(0, sql.length - 1);

    sql += ' WHERE id = :id;';

    const data = columnsToUpdate.reduce(
      (obj, key: UpdateProperty) => ({
        ...obj,
        [key]: this[key],
      }),
      {},
    );

    const [results] = (await pool.execute(sql, {
      id: this.id,
      ...data,
    })) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }
}