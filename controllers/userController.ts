import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import { AppError } from '../utils/error';
import { createToken, generateToken, getTokenFromCookie, removeToken } from '../auth/token';
import { NewUserEntity } from '../types';

export const register = async (req: Request, res: Response) => {
  const user = new UserRecord(req.body as NewUserEntity);
  await user.insert();
  res.status(201).json(user);
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
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .json({ ok: true });
};

export const logout = async (req: Request, res: Response) => {
  const currentTokenId = getTokenFromCookie(req);

  const user = await UserRecord.findOneByToken(currentTokenId);

  await removeToken(user, res);
};

export const changeEmail = async (req: Request, res: Response) => {
  const email: string = req.body.email;

  const currentTokenId = getTokenFromCookie(req);

  const user = await UserRecord.findOneByToken(currentTokenId);

  user.userEmail = email;

  if (!await user.updateUserEmail()) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  await removeToken(user, res);
};

export const changePassword = async (req: Request, res: Response) => {
  const password: string = req.body.password;

  const currentTokenId = getTokenFromCookie(req);

  const user = await UserRecord.findOneByToken(currentTokenId);

  user.userPassword = password;

  if (!await user.updateUserPassword()) {
    throw new AppError('Sorry update operation failed.', 500);
  }

  await removeToken(user, res);
};