import { v4 as uuid } from 'uuid';
import { JwtPayload, sign } from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRecord } from '../records/user.record';

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
  let userWithThisToken: boolean | null = null;

  do {
    token = uuid();
    userWithThisToken = await UserRecord.findOneByToken(token);
  } while (userWithThisToken);

  user.userCurrentTokenId = token;

  await user.updateUserTokenId();

  return token;
};
