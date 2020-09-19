import { Router } from 'express';
import passport from 'passport';
import User from '../models/user';

const router = Router();

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    res.status(200).send(req.user);
  }
);

export default router;
