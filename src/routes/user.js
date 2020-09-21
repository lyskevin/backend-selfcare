import { Router } from 'express';
import passport from 'passport';
import BlockedUser from '../models/blockedUser';

const router = Router();

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

router.get(
  '/block',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const blockedUsers = await BlockedUser.findAll({
      where: {
        user_id: user.id,
      }
    });
    res.send(blockedUsers);
  }
);

router.post(
  '/block',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { id } = req.body;
    await BlockedUser.create({
      user_id: user.id,
      blocked_user_id: id,
    });
    await BlockedUser.create({
      user_id: id,
      blocked_user_id: user.id,
    });
    res.status(200).send("User blocked");
  }
);

export default router;
