import { Router } from 'express';
import { Op } from 'sequelize';
import Conversation from '../models/conversation';

const router = Router();

router.get('/', async (req, res) => {
  const allConversations = await Conversation.findAll();
  res.send(allConversations);
});

router.get('/:conversationId', async (req, res) => {
  const conversation = await Conversation.findByPk(req.params.conversationId);
  res.send(conversation);
});

router.get('/withUser/:userId', async (req, res) => {
  const allUserConversations = await Conversation.findAll({
    where: {
      [Op.or]: [
        {
          first_user_id: {
            [Op.eq]: req.params.userId
          }
        },
        {
          second_user_id: {
            [Op.eq]: req.params.userId
          }
        }
      ]
    }
  });
  return res.send(allUserConversations);
})

router.post('/', async (req, res) => {
  const conversation = await Conversation.create({
    open: req.query.open,
    first_user_id: req.query.firstUserId,
    second_user_id: req.query.secondUserId,
  });
  res.send(conversation);
});

router.delete('/:conversationId', async (req, res) => {
  await Conversation.destroy({
    where: {
      id: req.params.conversationId,
    }
  });
  res.sendStatus(200);
});

export default router;
