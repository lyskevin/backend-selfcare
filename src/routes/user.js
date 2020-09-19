import { Router } from 'express';
import { sequelize } from '../models';
import bcrypt from 'bcrypt';
import issueJwt from '../lib/utils';
import passport from 'passport';

const router = Router();

router.get('/', async (req, res) => {
  const { User } = req.context.models;
  const allUsers = await User.findAll();
  res.send(allUsers);
});

router.get('/random', async (req, res) => {
  const randomUser = await req.context.models.User.findOne({
    order: sequelize.random(),
  });
  res.send(randomUser);
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

router.post('/register', async (req, res) => {
  const { User } = req.context.models;

  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hash });
    const { token, expires } = issueJwt(user);
    res.json({ success: true, user, token, expires });
  } catch (e) {
    console.log(e);
  }
});

router.get('/:userId', async (req, res) => {
  const user = await req.context.models.User.findAll({
    where: {
      id: req.params.userId,
    },
  });
  res.send(user);
});

export default router;
