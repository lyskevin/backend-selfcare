import { Router } from 'express';
import bcrypt from 'bcrypt';
import { issueJwt, hashPassword } from '../lib/utils';
import passport from 'passport';

const router = Router();

router.get('/', async (req, res) => {
  const { User } = req.context.models;
  const allUsers = await User.findAll();
  res.send(allUsers);
});

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({ success: true, msg: 'Authorized!' });
  }
);

router.post('/login', async (req, res) => {
  const { User } = req.context.models;
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(401).json({ success: false });
    }

    const isValid = await bcrypt.compare(password, User.password);

    if (isValid) {
      const { token, expiresIn } = issueJwt(user);
      res.status(200).json({ success: true, user, token, expiresIn });
    } else {
      res.status(401).json({ success: false, msg: 'wrong password' });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/fail',
    session: false,
  }),
  (req, res) => {
    const { user } = req;
    const { token, expires } = issueJwt(user);
    res.status(200).send({ user, token, expires });
  }
);

router.get('/fail', (req, res) =>
  res.status(401).send('Failed to login to Facebook')
);

router.post('/register', async (req, res) => {
  const { User } = req.context.models;

  const { username, password } = req.body;

  try {
    const hash = await hashPassword(password);

    const user = await User.create({ username, password: hash });
    const { token, expires } = issueJwt(user);
    res.json({ success: true, user, token, expires });
  } catch (e) {
    console.log(e);
  }
});

export default router;
