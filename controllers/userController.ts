import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { UserRecord } from '../records/user.record';
import { AppError } from '../utils/error';
import { createToken, generateToken } from '../auth/token';
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
  const accessToken = req.cookies.jwt;

  const decodedJwt = decode(accessToken, { json: true });

  const currentTokenId: string = decodedJwt.id;

  try {
    const user = await UserRecord.getOneByToken(currentTokenId);

    user.userCurrentTokenId = null;

    await user.updateUserTokenId();

    return res
      .clearCookie('jwt', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      })
      .json({ ok: true });

  } catch (e) {
    return res.json({ error: e.message });
  }
};