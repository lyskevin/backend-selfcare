const message = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'messages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      is_open: {
        type: DataTypes.BOOLEAN,
      },
      url: {
        type: DataTypes.TEXT,
      }
    },
    {
      timestamps: true,
      updatedAt: false,
      // For the deletedAt timestamp
      paranoid: true,
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversation_id',
    });
  }

  return Message;
};

export default message;
