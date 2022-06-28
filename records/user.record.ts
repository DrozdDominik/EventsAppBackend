import { v4 as uuid } from 'uuid';
import { NewUserEntity, UserRole } from '../types';
import { hashPassword, isEmailValid, isPasswordValid } from '../utils/auxiliaryMethods';
import { AppError } from '../utils/error';

export class UserRecord {

  private readonly id?: string;
  private name: string;
  private email: string;
  private passwordHash: string;
  private currentTokenId: string | null;
  private role: UserRole;
  public validationErrors: string[] = [];

  constructor(obj: NewUserEntity) {
    this.id = obj.id ?? uuid();
    this.currentTokenId = null;
    this.role = UserRole.User;

    if (!obj.name || obj.name.length < 2 || obj.name.length > 30) {
      this.validationErrors.push(
        `User name must be between 2 and 30 characters - now is ${obj.name.length}.`,
      );
    }

    if (!isEmailValid(obj.email)) {
      this.validationErrors.push(
        'Provided email is not valid.',
      );
    }

    if (!isPasswordValid(obj.password)) {
      this.validationErrors.push(
        `Provided password is not valid. Password should be between 7 to 15 characters which contain at least one numeric digit and a special character.`,
      );
    }

    if (this.validationErrors.length > 0) {
      throw new AppError(this.validationErrors.join('|'), 422);
    }

    this.name = obj.name;
    this.email = obj.email;
    this.passwordHash = hashPassword(obj.password);
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

  set userCurrentTokenId(tokenId: string) {
    this.currentTokenId = tokenId;
  }
}