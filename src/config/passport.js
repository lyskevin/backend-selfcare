import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FbStrategy } from 'passport-facebook';
import models from '../models';

const { User } = models;

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((user, cb) => {
//   cb(null, user);
// });

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

const jwtStrategy = new JwtStrategy(options, (payload, done) => {
  User.findByPk(payload.sub)
    .then((user) => done(null, user || false))
    .catch((err) => done(err, null));
});

const fbStrategy = new FbStrategy(
  {
    clientID: process.env['FB_ID'],
    clientSecret: process.env['FB_SECRET'],
    callbackURL: '/users/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('hello');
    User.findOrCreate({ where: { fbId: profile.id } })
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  }
);

export default (passport) => {
  passport.use(jwtStrategy);
  passport.use(fbStrategy);
};
