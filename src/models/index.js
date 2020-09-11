import Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);

// reverse-polyfill function since sequelize removed .import function in v6
const importModel = (relativePath) => {
  return require(relativePath).default(sequelize, Sequelize);
};

const models = {
  User: importModel('./user'),
  Journal: importModel('./journal'),
  JournalPage: importModel('./journalPage'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const seedData = async () => {
  await models.User.create({
    name: 'robert',
    alias: 'bob',
  });
};

export { sequelize, seedData };

export default models;
