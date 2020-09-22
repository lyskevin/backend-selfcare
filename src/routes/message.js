import { Router } from 'express';
import Message from '../models/message';
import passport, { use } from 'passport';
import Sequelize, { Op } from 'sequelize';
import User from '../models/user';
import BlockedUser from '../models/blockedUser';

const router = Router();
const sequelize = new Sequelize(process.env.DATABASE_URL);

router.get(
  '/randomUnopened',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const users = await User.findAll({
      where: {
        id: user.id,
      },
      include: {
        model: User,
        as: 'user',
        through: {
          attributes: []
        }
      }
    });

    const blockedUserIds = users[0].user.map(user => user.dataValues.id);

    const randomUnopenedMessage = await Message.findOne({
      where: {
        is_open: false,
        [Op.and]: [{
          user_id: {
            [Op.notIn]: blockedUserIds
          }
        }, {
          user_id: {
            [Op.ne]: user.id
          }
        }]
      },
      order: sequelize.random(),
    })

    res.send(randomUnopenedMessage);
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
    const { user } = req;
    const { url } = req.body;
    const message = await Message.create({
      user_id: user.id,
      url: url,
    });
    res.send(message);
  }
);

router.post('/withConversation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { url, conversationId } = req.body;
    const message = await Message.create({
      user_id: user.id,
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
