import { Router } from 'express';
import Message from '../models/message';
import passport from 'passport';
import Sequelize from 'sequelize';

const router = Router();
const sequelize = new Sequelize(process.env.DATABASE_URL);

router.get(
  '/randomUnopened',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const randomMessage = await Message.findOne({
      where: {
        is_open: false,
      },
      order: sequelize.random()
    });
    res.send(randomMessage);
  }
);

router.get(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const message = await Message.findByPk(req.params.messageId);
    res.send(message);
  }
);

router.get(
  '/withConversation/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const message = await Message.findAll({
      where: {
        conversation_id: req.params.conversationId,
      },
      order: [
        ['createdAt', 'ASC'],
      ]
    });
    res.send(message);
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { userId, url } = req.body;
    const message = await Message.create({
      user_id: userId,
      url: url,
    });
    res.send(message);
  }
);

router.post('/withConversation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { userId, url, conversationId } = req.body;
    const message = await Message.create({
      user_id: userId,
      url: url,
      conversation_id: conversationId,
    });
    res.send(message);
  }
);

router.put('/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    var message = await Message.findByPk(req.params.messageId);
    if (message) {
      const { conversationId } = req.body;
      message = await Message.upsert({
        id: req.params.messageId,
        is_open: true,
        conversation_id: conversationId,
      }, {
        returning: true,
      });
    }
    res.send(message[0]);
  }
);

router.delete('/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Message.destroy({
        where: {
          id: req.params.messageId,
        }
      });
      res.status(200).send("Message deleted");
    } catch (e) {
      console.log(e);
      res.status(500).send("The specified message does not exist");
    }
  }
);

export default router;
