import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import { AppError } from '../utils/error';
import { createToken, generateToken, removeToken } from '../auth/token';
import { NewUserEntity, UserRole } from '../types';

export const register = async (req: Request, res: Response) => {
  const providedData = req.body as NewUserEntity;
  if(!await UserRecord.isEmailAvailable(providedData.email)) {
    throw new AppError('Email unavailable', 400);
  }
  const user = new UserRecord(req.body as NewUserEntity);
  await user.insert();
  res.status(201).end();
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: UserRecord | null = await UserRecord.findOneByCredentials(email, password);

  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }
  const token = createToken(await generateToken(user));

  return res
    .cookie('jwt', token.accessToken, {
      secure: true,
      domain: 'localhost',
      httpOnly: true,
    })
    .json({ role: user.userRole });
};

export const logout = async (req: Request, res: Response) => {
  const user = req.user as UserRecord;

  await removeToken(user, res);
};

export const changeEmail = async (req: Request, res: Response) => {
  const email: string = req.body.email;

  if(!await UserRecord.isEmailAvailable(email)) {
    throw new AppError('Email unavailable', 400);
  }
  const user = req.user as UserRecord;

  user.userEmail = email;

  if (!await user.updateUserEmail()) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  await removeToken(user, res);
};

export const changePassword = async (req: Request, res: Response) => {
  const password: string = req.body.password;

  const user = req.user as UserRecord;

  user.userPassword = password;

  if (!await user.updateUserPassword()) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  await removeToken(user, res);
};

export const changeName = async (req: Request, res: Response) => {
  const name: string = req.body.name;

  const user = req.user as UserRecord;

  user.userName = name;

  const result: string | null = await user.updateUserName();

  if (result === null) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  res.json({ name: result });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserRecord.getAll();

  res.json({ users });
};

export const changeRole = async (req: Request, res: Response) => {
  const id: string = req.body.id;
  const role: UserRole = req.body.role;

  if (!await UserRecord.updateUserRole(id, role)) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  res.json({ ok: true });
};

export const getRole = (req: Request, res : Response) => {
  const user = req.user as UserRecord;

  res.json({role: user.userRole})
}
