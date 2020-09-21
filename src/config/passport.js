import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FbStrategy } from 'passport-facebook';
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

const fbStrategy = new FbStrategy(
  {
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: '/auth/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const [user, created] = await User.findOrCreate({
      where: {
        fb_id: profile.id,
        name: profile.displayName,
      },
    });
    return done(null, user);
  }
);

export default (passport) => {
  passport.use(jwtStrategy);
  passport.use(fbStrategy);
};
