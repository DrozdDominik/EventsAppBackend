import { v4 as uuid } from 'uuid';
import { EventEntity } from "../types";
import {AppError} from "../utils/error";

export class EventRecord {
    private readonly _id?: string;
    private _name: string;
    private _description: string;
    private _isChosen?: boolean;
    private _estimatedTime: number;
    private _link?: string | null;
    private _lat: number;
    private _lon: number;
    public validationErrors: string[] = [];

    constructor(obj: EventEntity) {
        this._id = obj.id ?? uuid();
        this._isChosen = obj.is_chosen ?? false;
        this._link = obj.link ?? null;

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

        if (obj.estimated_time <= 0) {
            this.validationErrors.push(
                'Event estimated time must be greater then zero.',
            );
        }

        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            this.validationErrors.push(
                'Coordinates must be numbers.',
            );
        }

        if (this.validationErrors.length > 0) {
            throw new AppError(this.validationErrors.join('|'), 422);
        }

        this._name = obj.name;
        this._description = obj.description;
        this._estimatedTime = obj.estimated_time;
        this._lat = obj.lat;
        this._lon = obj.lon;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(name: string) {
        if (!name || name.length < 3 || name.length > 50) {
            this.validationErrors.push(
              `Event name length must be between 3 and 50 characters - now is ${name.length}.`,
            );
        } else {
            this._name = name;
        }
    }

    get description() {
        return this._description;
    }

    set description(description: string) {
        if (!description || description.length < 10 || description.length > 500) {
            this.validationErrors.push(
              `Event description length must be between 10 and 500 characters - now is ${description.length}.`,
            );
        } else {
            this._description = description;
        }
    }

    get isChosen() {
        return this._isChosen;
    }

    set isChosen(isChosen: boolean) {
        this._isChosen = isChosen;
    }

    get estimatedTime() {
        return this._estimatedTime;
    }

    set estimatedTime(estimatedTime: number) {
        if (estimatedTime <= 0) {
            this.validationErrors.push(
              'Event estimated time must be greater then zero.',
            );
        } else {
            this._estimatedTime = estimatedTime;
        }
    }

    get link() {
        return this._link;
    }

    set link(link: string) {
        if (link === '') {
            this._link = null;
        } else {
            this._link = link;
        }
    }

    get lat() {
        return this._lat;
    }

    set lat(lat:number) {
        if(typeof lat !== 'number') {
            this.validationErrors.push(
                'Coordinates must be numbers.',
            );
        }
        this._lat = lat;
    }

    get lon() {
        return this._lon;
    }

    set lon(lon: number) {
        if(typeof lon !== 'number') {
            this.validationErrors.push(
                'Coordinates must be numbers.',
            );
        }
        this._lon = lon;
    }
}