import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
};

const strategy = new JwtStrategy(options, (payload, done) => {
  User.findByPk(payload.sub)
    .then((user) => done(null, user || false))
    .catch((err) => done(err, null));
});

export default (passport) => passport.use(strategy);
