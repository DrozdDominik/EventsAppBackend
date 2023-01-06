import passport from 'passport';
import { Strategy } from 'passport-jwt';
import { config } from '../config/config';
import { UserRecord } from '../records/user.record';
import { AppError } from '../utils/error';

const secret = config.JWT_SECRET;

const cookieExtractor = (req: any): null | string =>
  req && req.cookies ? req.cookies?.jwt ?? null : null;

const jwtOpts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
};

passport.use(
  new Strategy(jwtOpts, async (payload, done) => {
    if (!payload || !payload.id) {
      return done(new AppError('Unauthorized', 401), false);
    }

    const user = await UserRecord.findOneByToken(payload.id);

    if (!user) {
      return done(new AppError('Unauthorized', 401), false);
    }
    done(null, user);
  }),
);
