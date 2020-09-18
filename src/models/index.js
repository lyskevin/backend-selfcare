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
  SoundFile: importModel('./soundFile'),
  Message: importModel('./message'),
  Conversation: importModel('./conversation')
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const seedData = async () => {
  const alice = await models.User.create({
    name: 'ally',
    alias: 'alice',
  });

  const bob = await models.User.create({
    name: 'robert',
    alias: 'bob',
  });

  const soundFile = await models.SoundFile.create({
    url: 'test.com',
  });

  const conversation = await models.Conversation.create();
  await conversation.setFirstUser(alice);
  await conversation.setSecondUser(bob);
  
  await models.Message.create({
    is_open: false,
  }).then((result) => {
    result.setSoundFile(soundFile);
    result.setUser(alice);
    result.setConversation(conversation);
  });
};

export { sequelize, seedData };

export default models;
