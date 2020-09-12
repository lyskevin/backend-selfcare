const unopenedMessage = (sequelize, DataTypes) => {
  const UnopenedMessage = sequelize.define(
    'unopenedMessages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
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
  };

  return UnopenedMessage;
};

export default unopenedMessage;
