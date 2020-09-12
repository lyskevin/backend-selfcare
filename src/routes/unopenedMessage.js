import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allUnopenedMessages = await req.context.models.UnopenedMessage.findAll();
  res.send(allUnopenedMessages);
});

router.get('/:unopenedMessageId', async (req, res) => {
  const unopenedMessage = await req.context.models.UnopenedMessage.findByPk(req.params.unopenedMessageId);
  res.send(unopenedMessage);
});

router.post('/', async (req, res) => {
  const unopenedMessage = await req.context.models.UnopenedMessage.create({
    user_id: req.query.userId,
    voice_message: req.query.voiceMessage,
  });
  res.send(unopenedMessage);
});

router.put('/:unopenedMessageId', async (req, res) => {
  var unopenedMessage = await req.context.models.UnopenedMessage.findByPk(req.params.unopenedMessageId);
  if (unopenedMessage) {
    unopenedMessage = await req.context.models.UnopenedMessage.upsert({
      id: req.params.UnopenedMessageId,
      url: req.query.url,
    }, {
      returning: true
    });
  }
  res.send(unopenedMessage[0]);
});

router.delete('/:unopenedMessageId', async (req, res) => {
  await req.context.models.UnopenedMessage.destroy({
    where: {
      id: req.params.unopenedMessageId,
    }
  });
  res.sendStatus(200);
});

export default router;
