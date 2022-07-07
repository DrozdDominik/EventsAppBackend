import { v4 as uuid } from 'uuid';
import { decode, JwtPayload, sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRecord } from '../records/user.record';
import { Request, Response } from 'express';

export const createToken = (currentTokenId: string): { accessToken: string, expiresIn: number } => {
  const payload: JwtPayload = { id: currentTokenId };
  const expiresIn = 60 * 60 * 24;
  const accessToken = sign(payload, config.JWT_SECRET, { expiresIn });

  return {
    accessToken,
    expiresIn,
  };
};

export const generateToken = async (user: UserRecord): Promise<string> => {
  let token: string;
  let userWithThisToken: UserRecord | null = null;

  do {
    token = uuid();
    userWithThisToken = await UserRecord.findOneByToken(token);
  } while (userWithThisToken);

  user.userCurrentTokenId = token;

  await user.updateUserTokenId();

  return token;
};

export const getTokenFromCookie = (req: Request): string => {
  const accessToken = req.cookies.jwt;

  const decodedJwt = decode(accessToken, { json: true });

  return decodedJwt.id;
}

export const removeToken = async(user: UserRecord, res: Response): Promise<Response> => {
  user.userCurrentTokenId = null;

  await user.updateUserTokenId();

  return res
    .clearCookie('jwt', {
      secure: false,
      domain: 'localhost',
      httpOnly: true,
    })
    .json({ ok: true });
}