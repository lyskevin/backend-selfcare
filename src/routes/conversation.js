import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allConversations = await req.context.models.Conversation.findAll();
  res.send(allConversations);
});

router.get('/:conversationId', async (req, res) => {
  const conversation = await req.context.models.Conversation.findByPk(req.params.conversationId);
  res.send(conversation);
});

router.post('/', async (req, res) => {
  const conversation = await req.context.models.Conversation.create({
    open: req.query.open,
    first_user_id: req.query.firstUserId,
    second_user_id: req.query.secondUserId,
  });
  res.send(conversation);
});

router.delete('/:conversationId', async (req, res) => {
  await req.context.models.Conversation.destroy({
    where: {
      id: req.params.conversationId,
    }
  });
  res.sendStatus(200);
});

export default router;
