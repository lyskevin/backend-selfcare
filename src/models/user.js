const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      alias: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    }
  );

  return User;
};

export default user;
