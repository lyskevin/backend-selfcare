import { Router } from 'express';
// import bcrypt from 'bcrypt';
// import { issueJwt } from '../lib/utils';
import issueJwt from '../lib/utils';
import passport from 'passport';

const router = Router();

router.get('/', async (req, res) => {
  const { User } = req.context.models;
  const allUsers = await User.findAll();
  res.send(allUsers);
});

router.get('/:userId', async (req, res) => {
  const { User } = req.context.models;

  const user = await User.findAll({
    where: {
      id: req.params.userId,
    },
  });
  res.send(user);
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

  const user = await User.findOne({ where: { username } });

  if (!user) {
    res.status(401).json({ success: false });
  }

  // TODO: replace this with Bcrypt salt hash
  const isValid = password == user.password;

  if (isValid) {
    const { token, expiresIn } = issueJwt(user);
    res.status(200).json({ success: true, user, token, expiresIn });
  } else {
    res.status(401).json({ success: false, msg: 'wrong password' });
  }
});

router.post('/register', async (req, res) => {
  const { User } = req.context.models;

  const { username, password } = req.body;

  // TODO: Replace this block when bcrypt is usable
  const user = await User.create({ username, password });
  const { token, expiresIn } = issueJwt(user);
  res.json({ success: true, user, token, expiresIn });

  // docker-compose somehow not installing bcrypt in container
  // bcrypt.hash(password, process.env.SALT, async (hashedPassword) => {
  //   const user = await User.create({ username, password: hashedPassword });
  //   const { token, expiresIn } = issueJwt(user);
  //   res.json({ success: true, user, token, expiresIn });
  // });
});

export default router;
