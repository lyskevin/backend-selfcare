import db from '../config/database';
import { DataTypes } from 'sequelize';

const JournalBlock = db.define(
  'journalBlocks',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    prompt: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    mood: {
      type: DataTypes.ENUM(['HAPPY', 'SAD', 'ANGRY', 'CONFUSED', 'OK']),
    },
  },
  { timestamps: false }
);

JournalBlock.association = (models) => {
  JournalBlock.belongsTo(models.JournalPage, {
    foreignKey: 'page_id',
  });
};

export default JournalBlock;
