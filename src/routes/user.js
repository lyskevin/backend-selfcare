import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allUsers = await req.context.models.User.findAll();
  res.send(allUsers);
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
