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
      unique: true,
    },
    mood: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

JournalPage.associate = (models) => {
  JournalPage.belongsTo(models.Journal, {
    foreignKey: 'journal_id',
  });
  JournalPage.hasMany(models.JournalBlock, {
    foreignKey: 'page_id',
    onDelete: 'CASCADE',
  });
};

export default JournalPage;
