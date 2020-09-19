import User from './user';
import Journal from './journal';
import JournalBlock from './journalBlock';
import JournalPage from './journalPage';
import Message from './message';
import Conversation from './conversation';

const { prompts } = require('./prompts/prompts.json');

const models = {
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
    is_open: false,
    url: 'test.com',
  }).then((result) => {
    result.setUser(alice);
  });

  // Journal
  const journal1 = await Journal.create({ id: alice.id });
  const journal2 = await Journal.create({ id: bob.id });

  // JournalPage
  const journalPage1 = await JournalPage.create({
    weather: 'sunny',
    location: 'SG',
  });
  journalPage1.setJournal(journal1);

  const journalPage2 = await JournalPage.create({
    weather: 'cloudy',
    location: 'SG',
  });
  journalPage1.setJournal(journal2);

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
