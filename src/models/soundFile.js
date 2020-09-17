import db from '../config/database';
import { DataTypes } from 'sequelize';

const SoundFile = db.define(
  'soundFiles',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: DataTypes.TEXT,
  },
  {
    timestamps: false,
  }
);

SoundFile.associate = (models) => {
  SoundFile.hasOne(models.UnopenedMessage, {
    foreignKey: 'voice_message',
  });
  SoundFile.hasOne(models.Message, {
    foreignKey: 'voice_message',
  });
};

export default SoundFile;
