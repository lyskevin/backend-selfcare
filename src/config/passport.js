import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import models from '../models';

const { User } = models;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.sub);
    return done(null, user || false);
  } catch (e) {
    console.log(e);
    done(e, null);
  }
});

export default (passport) => {
  passport.use(jwtStrategy);
};
