const journal = (sequelize, DataTypes) => {
  const Journal = sequelize.define(
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
    Journal.hasMany(models.JournalPage, { onDelete: 'CASCADE' });
  };

  return Journal;
};

export default journal;
