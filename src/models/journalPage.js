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
      foreignKey: 'journal_id',
    });
  };

  return JournalPage;
};

export default journalPage;
