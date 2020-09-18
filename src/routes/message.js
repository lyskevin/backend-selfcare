import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allMessages = await req.context.models.Message.findAll();
  res.send(allMessages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Message.findByPk(req.params.messageId);
  res.send(message);
});

router.get('/conversationId/:conversationId', async (req, res) => {
  const message = await req.context.models.Message.findAll({
    where: {
      conversation_id: req.params.conversationId,
    },
    order: [
      ['createdAt', 'ASC'],
    ]
  });
  res.send(message);
});

router.post('/', async (req, res) => {
  const message = await req.context.models.Message.create({
    conversation_id: req.query.conversationId,
    user_id: req.query.userId,
    voice_message: req.query.voiceMessage,
    previous_message: req.query.previousMessage,
  });
  res.send(message);
});

router.delete('/:messageId', async (req, res) => {
  await req.context.models.Message.destroy({
    where: {
      id: req.params.messageId,
    }
  });
  res.sendStatus(200);
});

export default router;
