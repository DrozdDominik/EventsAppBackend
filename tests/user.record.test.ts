import { it, expect } from 'vitest';
import { NewUserEntity } from '../types';
import { UserRecord } from '../records/user.record';

const defaultObj: NewUserEntity = {
  name: 'Tester',
  email: 'test@example.com',
  password: 'Test1234*',
};

it('should build UserRecord', () => {
  const user = new UserRecord(defaultObj);

  expect(typeof user.userId).toBe('string');
  expect(user.userCurrentTokenId).toBeNull();
  expect(user.userName).toBe(defaultObj.name);
});
