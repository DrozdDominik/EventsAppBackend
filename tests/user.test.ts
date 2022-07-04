import { it, expect, afterAll, describe } from 'vitest';
import { NewUserEntity } from '../types';
import { pool } from '../utils/db';
import { UserRecord } from '../records/user.record';

const defaultObj: NewUserEntity = {
  name: 'Tester',
  email: 'test@test.pl',
  password: 'qwerty1234*',
};

afterAll(async () => {
  await pool.execute('DELETE FROM `users` WHERE `email` LIKE \'test%\'');
  await pool.end();
});

describe('UserRecord.insert()', () => {
  it('should returns new UUID.', async () => {
    const user = new UserRecord(defaultObj);
    const id = await user.insert();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });
});

describe('UserRecord.findOneByCredentials', () => {

  const invalidEmail = 'xxx@test.pl';
  const invalidPassword = 'xxxx12xxxxx*';

  it('should returns null when given invalid email', async () => {
    const user = await UserRecord.findOneByCredentials(invalidEmail, defaultObj.password);

    expect(user).toBeNull();
  });

  it('should returns null when given invalid password', async () => {
    const user = await UserRecord.findOneByCredentials(defaultObj.email, invalidPassword);

    expect(user).toBeNull();
  });

  it('should returns null when given invalid email and password', async () => {
    const user = await UserRecord.findOneByCredentials(invalidEmail, invalidPassword);

    expect(user).toBeNull();
  });

  it('should returns instance of UserRecord when given valid email and password', async () => {
    const user = await UserRecord.findOneByCredentials(defaultObj.email, defaultObj.password);

    expect(user instanceof UserRecord).toBe(true);
  });
});