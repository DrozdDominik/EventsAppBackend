import { CategoryEntity } from '../types/category/category.entity';
import { v4 as uuid } from 'uuid';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';
import { FieldPacket, ResultSetHeader } from 'mysql2/promise';

type CategoryRecordResults = [CategoryEntity[], FieldPacket[]];

export class CategoryRecord {
  private readonly id: string;
  private name: string;

  constructor(obj: CategoryEntity) {
    this.id = obj.id ?? uuid();

    if (!obj.name || obj.name.length < 3 || obj.name.length > 30) {
      throw new AppError(
        `Category name length must be between 3 and 30 characters - now is ${obj.name.length}.`,
        422,
      );
    }

    this.name = obj.name;
  }

  get categoryId() {
    return this.id;
  }

  get categoryName() {
    return this.name;
  }

  set categoryName(name: string) {
    if (!name || name.length < 3 || name.length > 30) {
      throw new AppError(
        `Category name length must be between 3 and 30 characters - now is ${name.length}.`,
        422,
      );
    } else {
      this.name = name;
    }
  }

  public async insert(): Promise<string> {
    await pool.execute('INSERT INTO `categories` VALUES (:id, :name);', {
      id: this.id,
      name: this.name,
    });

    return this.id;
  }

  public static async getOne(id: string): Promise<CategoryRecord> | null {
    const [results] = (await pool.execute(
      'SELECT * FROM `categories` WHERE `id` = :id;',
      {
        id,
      },
    )) as CategoryRecordResults;

    if (results.length === 0) {
      return null;
    }

    return new CategoryRecord(results[0]);
  }

  public static async findOne(name: string): Promise<CategoryRecord> | null {
    const [results] = (await pool.execute(
      'SELECT * FROM `categories` WHERE `name` = :name;',
      {
        name,
      },
    )) as CategoryRecordResults;

    if (results.length === 0) {
      return null;
    }

    return new CategoryRecord(results[0]);
  }

  public static async getAll(): Promise<CategoryRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `categories`;',
    )) as CategoryRecordResults;

    return results.map(obj => new CategoryRecord(obj));
  }

  public async delete(): Promise<boolean> {
    const [results] = (await pool.execute(
      'DELETE FROM `categories` WHERE `id` = :id;',
      {
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public async update(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `categories` SET `name` = :name WHERE `id` = :id;',
      {
        id: this.id,
        name: this.name,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }
}
