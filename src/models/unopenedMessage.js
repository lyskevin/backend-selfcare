import db from '../config/database';
import { DataTypes } from 'sequelize';

const UnopenedMessage = db.define(
  'unopenedMessages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

UnopenedMessage.associate = (models) => {
  UnopenedMessage.belongsTo(models.SoundFile, {
    foreignKey: 'voice_message',
  });
  UnopenedMessage.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
};

export default UnopenedMessage;
