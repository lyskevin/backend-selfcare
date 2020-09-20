import { Router } from 'express';
import { sequelize } from '../models';
import bcrypt from 'bcrypt';
import { issueJwt } from '../lib/utils';
import passport from 'passport';
import User from '../models/user';

const router = Router();

router.get('/', async (req, res) => {
  const allUsers = await User.findAll();
  res.send(allUsers);
});

router.get('/random', async (req, res) => {
  const randomUser = await User.findOne({
    order: sequelize.random(),
  });
  res.send(randomUser);
});

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    res.status(200).send(req.user);
  }
);

router.get('/:userId', async (req, res) => {
  const user = await User.findAll({
    where: {
      id: req.params.userId,
    },
  });
  res.send(user);
});

export default router;
