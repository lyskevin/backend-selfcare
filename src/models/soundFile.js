const soundFile = (sequelize, DataTypes) => {
  const SoundFile = sequelize.define(
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
  }

  return SoundFile;
};

export default soundFile;
