import { Router } from 'express';
import { sequelize } from '../models';

const router = Router();

router.get('/', async (req, res) => {
  const allUsers = await req.context.models.User.findAll();
  res.send(allUsers);
});

router.get('/random', async (req, res) => {
  const randomUser = await req.context.models.User.findOne({
    order: sequelize.random(),
  });
  res.send(randomUser);
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
