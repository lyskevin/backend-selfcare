import db from '../config/database';
import { DataTypes } from 'sequelize';

const Message = db.define(
  'messages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    is_open: {
      type: DataTypes.BOOLEAN,
    },
    url: {
      type: DataTypes.TEXT,
    }
  },
  {
    timestamps: true,
    updatedAt: false,
    // For the deletedAt timestamp
    paranoid: true,
  }
);

Message.associate = (models) => {
  Message.belongsTo(models.SoundFile, {
    foreignKey: 'voice_message',
  });
  Message.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
  Message.belongsTo(Message, {
    foreignKey: 'previous_message',
  });
  Message.hasOne(Message, {
    foreignKey: 'previous_message',
  });
  Message.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
  });
};

export default Message;
