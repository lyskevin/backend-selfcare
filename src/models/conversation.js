import db from '../config/database';
import { DataTypes } from 'sequelize';

const Conversation = db.define(
  'conversations',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

Conversation.associate = (models) => {
  Conversation.belongsTo(models.User, {
    as: 'firstUser',
    foreignKey: {
      name: 'first_user_id',
    },
  });
  Conversation.belongsTo(models.User, {
    as: 'secondUser',
    foreignKey: {
      name: 'second_user_id',
    },
  });
  Conversation.hasOne(models.Message, {
    foreignKey: 'conversation_id',
  });
};

export default Conversation;
