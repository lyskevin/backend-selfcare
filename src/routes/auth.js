import { Router } from 'express';
import bcrypt from 'bcrypt';
import { issueJwt, hashPassword } from '../lib/utils';
import passport from 'passport';

const router = Router();

/**
 * Normal login
 */

router.post('/login', async (req, res) => {
  const { User } = req.context.models;
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(401).send('User not found');
    }

    const isValid = await bcrypt.compare(password, User.password);

    if (isValid) {
      const { token, expiresIn } = issueJwt(user);
      res.status(200).json({ user, token, expiresIn });
    } else {
      res.status(401).send('Wrong password');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  const { User } = req.context.models;

  const { username, password } = req.body;

  try {
    const hash = await hashPassword(password);

    const user = await User.create({ username, password: hash });
    const { token, expires } = issueJwt(user);
    res.status(200).json({ user, token, expires });
  } catch (e) {
    console.log(e);
  }
});

/**
 * Social login
 */

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/fail',
    session: false,
  }),
  (req, res) => {
    const { user } = req;

    console.log(user);
    console.log(user.id);
    console.log(user.fbId);
    const { token, expires } = issueJwt(user);
    res.status(200).json({ user, token, expires });
  }
);

router.get('/fail', (req, res) =>
  res.status(401).send('Failed to login to Facebook')
);

export default router;
