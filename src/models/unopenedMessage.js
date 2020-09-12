const unopenedMessage = (sequelize, DataTypes) => {
  const UnopenedMessage = sequelize.define(
    'unopenedMessages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    UnopenedMessage.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };

  return UnopenedMessage;
};

export default unopenedMessage;
