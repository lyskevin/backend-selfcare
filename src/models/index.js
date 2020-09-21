import RefreshToken from './refreshToken';
import User from './user';
import Journal from './journal';
import JournalBlock from './journalBlock';
import JournalPage from './journalPage';
import Message from './message';
import Conversation from './conversation';

const { prompts } = require('./prompts/prompts.json');

const models = {
  RefreshToken,
  User,
  Journal,
  JournalBlock,
  JournalPage,
  Message,
  Conversation,
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const seedData = async () => {
  // Users
  const alice = await User.create({
    name: 'ally',
    alias: 'alice',
  });

  const bob = await User.create({
    name: 'robert',
    alias: 'bob',
  });

  const conversation = await Conversation.create();
  await conversation.setFirstUser(alice);
  await conversation.setSecondUser(bob);

  await Message.create({
    url: 'test.com',
  }).then((result) => {
    result.setUser(alice);
  });

  // JournalPage
  const journalPage1 = await JournalPage.create({
    weather: 'sunny',
    location: 'SG',
  });
  journalPage1.setUser(alice);

  const journalPage2 = await JournalPage.create({
    weather: 'cloudy',
    location: 'SG',
    date: '2020-09-19',
  });
  journalPage2.setUser(bob);

  const journalBlock1 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Mi familia',
    mood: 'HAPPY',
  });
  journalBlock1.setJournalPage(journalPage1);

  const journalBlock2 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Nothing',
    mood: 'SAD',
  });
  journalBlock2.setJournalPage(journalPage2);
};

export { seedData };

export default models;
