import Sequelize from 'sequelize';
const { prompts } = require('./prompts/prompts.json');

const sequelize = new Sequelize(process.env.DATABASE_URL);

// reverse-polyfill function since sequelize removed .import function in v6
const importModel = (relativePath) => {
  return require(relativePath).default(sequelize, Sequelize);
};

const models = {
  User: importModel('./user'),
  Journal: importModel('./journal'),
  JournalPage: importModel('./journalPage'),
  JournalBlock: importModel('./journalBlock'),
  UnopenedMessage: importModel('./unopenedMessage'),
  SoundFile: importModel('./soundFile'),
  Message: importModel('./message'),
  Conversation: importModel('./conversation'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const seedData = async () => {
  // Users
  const alice = await models.User.create({
    name: 'ally',
    alias: 'alice',
  });

  const bob = await models.User.create({
    name: 'robert',
    alias: 'bob',
  });

  // Journal
  const journal1 = await models.Journal.create({ id: alice.id });
  const journal2 = await models.Journal.create({ id: bob.id });

  // JournalPage
  const journalPage1 = await models.JournalPage.create({
    weather: 'sunny',
    location: 'SG',
    journal_id: journal1.id,
  });
  // journalPage1.setJournal(journal1);

  const journalPage2 = await models.JournalPage.create({
    weather: 'cloudy',
    location: 'SG',
    journal_id: journal2.id,
  });

  const journalBlock1 = await models.JournalBlock.create({
    prompt: prompts[0],
    content: 'Mi familia',
    mood: 'HAPPY',
    page_id: journalPage1.id,
  });

  const journalBlock2 = await models.JournalBlock.create({
    prompt: prompts[0],
    content: 'Nothing',
    mood: 'SAD',
    page_id: journalPage2.id,
  });

  // Sound files
  const soundFile = await models.SoundFile.create({
    url: 'test.com',
  });

  // Unopened messages
  await models.UnopenedMessage.create({}).then((result) => {
    result.setSoundFile(soundFile);
    result.setUser(alice);
  });

  // Conversations
  const conversation = await models.Conversation.create({
    open: true,
  });
  await conversation.setFirstUser(alice);
  await conversation.setSecondUser(bob);

  await models.Message.create({}).then((result) => {
    result.setSoundFile(soundFile);
    result.setUser(alice);
    result.setConversation(conversation);
  });
};

export { sequelize, seedData };

export default models;
