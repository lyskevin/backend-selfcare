import { Router } from 'express';
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
    res.status(200).send('ok');
  }
);

export default router;
