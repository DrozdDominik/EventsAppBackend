import { v4 as uuid } from 'uuid';
import { NewUserEntity, SimplyUserEntity, UserId, UserRole } from '../types';
import {
  hashPassword,
  isEmailValid,
  isPasswordValid,
} from '../utils/auxiliaryMethods';
import { AppError } from '../utils/error';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';

type UserRecordResults = [NewUserEntity[], FieldPacket[]];
type SimplyUserRecordResult = [SimplyUserEntity[], FieldPacket[]];
type UserIdRecordResults = [UserId[], FieldPacket[]];
type UserRequestRecordResults = [{ request: boolean }[], FieldPacket[]];

export class UserRecord {
  private readonly id: string;
  private name: string;
  private email: string;
  private passwordHash?: string;
  private currentTokenId: string | null;
  private readonly role: UserRole;
  public validationErrors: string[] = [];

  constructor(obj: NewUserEntity) {
    this.id = obj.id ?? uuid();
    this.currentTokenId = obj.currentTokenId ?? null;
    this.role = obj.role ?? UserRole.User;

    if (!obj.name || obj.name.length < 2 || obj.name.length > 30) {
      this.validationErrors.push(
        `User name must be between 2 and 30 characters - now is ${obj.name.length}.`,
      );
    }

    if (!isEmailValid(obj.email)) {
      this.validationErrors.push('Provided email is not valid.');
    }

    if (obj.password && !isPasswordValid(obj.password)) {
      this.validationErrors.push(
        `Provided password is not valid. Password should be between 7 to 15 characters which contain at least one numeric digit and a special character.`,
      );
    }

    if (this.validationErrors.length > 0) {
      throw new AppError(this.validationErrors.join('|'), 422);
    }

    this.name = obj.name;
    this.email = obj.email;
    if (obj.password) {
      this.passwordHash = hashPassword(obj.password);
    }
  }

  get userId() {
    return this.id;
  }

  get userName() {
    return this.name;
  }

  set userName(name: string) {
    if (!name || name.length < 2 || name.length > 30) {
      this.validationErrors.push(
        `User name must be between 2 and 30 characters - now is ${name.length}.`,
      );
    } else {
      this.name = name;
    }
  }

  get userCurrentTokenId() {
    return this.currentTokenId;
  }

  set userCurrentTokenId(tokenId: string | null) {
    this.currentTokenId = tokenId;
  }

  set userEmail(email: string) {
    if (!isEmailValid(email)) {
      throw new AppError('Provided email is not valid.', 400);
    }
    this.email = email;
  }

  set userPassword(password: string) {
    if (!isPasswordValid(password)) {
      throw new AppError('Provided password is not valid.', 400);
    }
    this.passwordHash = hashPassword(password);
  }

  get userRole() {
    return this.role;
  }

  public async insert(): Promise<string> {
    await pool.execute(
      'INSERT INTO `users` VALUES (:id, :name, :email, :password_hash, :current_token_id, :role);',
      {
        id: this.id,
        name: this.name,
        email: this.email,
        password_hash: this.passwordHash,
        current_token_id: this.userCurrentTokenId,
        role: this.role,
      },
    );

    return this.id;
  }

  public static async findOneByCredentials(
    email: string,
    password: string,
  ): Promise<UserRecord> | null {
    const [results] = (await pool.execute(
      'SELECT `id`, `name`, `email`, `current_token_id`, `role` FROM `users` WHERE `email` = :email AND `password_hash` = :passwordHash;',
      {
        email,
        passwordHash: hashPassword(password),
      },
    )) as UserRecordResults;

    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  public static async findOneByToken(
    token: string,
  ): Promise<UserRecord> | null {
    const [results] = (await pool.execute(
      'SELECT * FROM `users` WHERE `current_token_id` = :token;',
      {
        token,
      },
    )) as UserRecordResults;

    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  public async updateUserTokenId(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `current_token_id` = :token WHERE `id` = :id;',
      {
        token: this.userCurrentTokenId,
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public async updateUserEmail(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `email` = :email WHERE `id` = :id;',
      {
        email: this.email,
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public async updateUserPassword(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `password_hash` = :passwordHash WHERE `id` = :id;',
      {
        passwordHash: this.passwordHash,
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public async updateUserName(): Promise<string | null> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `name` = :name WHERE `id` = :id;',
      {
        name: this.name,
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1 ? this.name : null;
  }

  public static async updateUserRole(
    id: string,
    role: UserRole,
  ): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `role` = :role WHERE `id` = :id;',
      {
        role,
        id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public static async getAll(): Promise<SimplyUserEntity[]> {
    const [results] = (await pool.execute(
      'SELECT `id`, `name`, `email`, `role` FROM `users`;',
    )) as SimplyUserRecordResult;

    return results.map(result => {
      const { id, name, email, role } = result;

      return {
        id,
        name,
        email,
        role,
      };
    });
  }

  public static async isEmailAvailable(email: string): Promise<boolean> {
    const [result] = (await pool.execute(
      'SELECT `id` FROM `users` WHERE `email` = :email;',
      {
        email,
      },
    )) as UserIdRecordResults;

    return result.length === 0;
  }

  public async requestRoleUpgrade(): Promise<boolean> {
    const [results] = (await pool.execute(
      'UPDATE `users` SET `request` = TRUE WHERE `id` = :id;',
      {
        id: this.id,
      },
    )) as [ResultSetHeader, FieldPacket[]];

    return results.affectedRows === 1;
  }

  public static async getRequestStatus(id: string): Promise<boolean> {
    const [results] = (await pool.execute(
      'SELECT `request` FROM `users` WHERE `id` = :id;',
      {
        id,
      },
    )) as UserRequestRecordResults;

    return results[0].request;
  }
}
