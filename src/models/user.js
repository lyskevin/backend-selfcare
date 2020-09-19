import db from '../config/database';
import { DataTypes } from 'sequelize';

const User = db.define(
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
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

User.associate = (models) => {
  User.hasOne(models.Message, {
    foreignKey: 'user_id',
  });
  User.hasMany(models.Conversation, {
    as: 'firstUser',
    foreignKey: {
      name: 'first_user_id',
    },
  });
  User.hasMany(models.Conversation, {
    as: 'secondUser',
    foreignKey: {
      name: 'second_user_id',
    },
  });
};

export default User;
