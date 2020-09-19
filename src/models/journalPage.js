import db from '../config/database';
import { DataTypes } from 'sequelize';

const JournalPage = db.define(
  'journalPages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    weather: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
  },
  {
    timestamps: false,
    // timestamps: true,
    // createdAt: 'created_at',
    // updatedAt: 'modified_at',
  }
);

JournalPage.association = (models) => {
  JournalPage.belongsTo(models.Journal, {
    as: 'journal',
    foreignKey: 'journal_id',
  });
  JournalPage.hasMany(models.JournalBlock, { onDelete: 'CASCADE' });
};

export default JournalPage;
