import db from '../config/database';
import { DataTypes } from 'sequelize';

const Journal = db.define(
  'journals',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  { timestamps: false }
);

Journal.associate = (models) => {
  Journal.hasMany(models.JournalPage, {
    foreignKey: 'journal_id',
    onDelete: 'CASCADE',
  });
};

export default Journal;
