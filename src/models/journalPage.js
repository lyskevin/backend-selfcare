const journalPage = (sequelize, DataTypes) => {
  const JournalPage = sequelize.define(
    'journalPages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mood: {
        type: DataTypes.ENUM({
          values: ['HAPPY', 'SAD', 'ANGRY', 'CONFUSED', 'OK'],
        }),
      },
      weather: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'modified_at',
    }
  );

  JournalPage.association = (models) => {
    JournalPage.belongsTo(models.Journal, {
      as: 'journal',
      foreignKey: 'journal_id',
    });
    JournalPage.hasMany(models.JournalBlock, { onDelete: 'CASCADE' });
  };

  return JournalPage;
};

export default journalPage;
