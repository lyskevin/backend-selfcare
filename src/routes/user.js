import { Router } from 'express';
import { sequelize } from '../models';
import { hashPassword } from '../lib/utils';
import passport from 'passport';
import User from '../models/user';
import Sequelize from 'sequelize';

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
  (req, res) => {
    const { id, fb_id, name, alias, username } = req.user;
    res.status(200).send({ id, fb_id, name, alias, username });
  }
);

router.post(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { name, alias } = req.query;
    const user = req.user;
    user.name = name || user.name;
    user.alias = alias || user.alias;
    try {
      await user.save();
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

export default router;
