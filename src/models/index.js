import User from './user';
import Journal from './journal';
import JournalBlock from './journalBlock';
import JournalPage from './journalPage';
import Message from './message';
import UnopenedMessage from './unopenedMessage';
import Conversation from './conversation';
import SoundFile from './soundFile';

const { prompts } = require('./prompts/prompts.json');

const models = {
  User,
  Journal,
  JournalBlock,
  JournalPage,
  Message,
  UnopenedMessage,
  Conversation,
  SoundFile,
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

  // Journal
  const journal1 = await Journal.create({ id: alice.id });
  const journal2 = await Journal.create({ id: bob.id });

  // JournalPage
  const journalPage1 = await JournalPage.create({
    weather: 'sunny',
    location: 'SG',
    journal_id: journal1.id,
  });
  // journalPage1.setJournal(journal1);

  const journalPage2 = await JournalPage.create({
    weather: 'cloudy',
    location: 'SG',
    journal_id: journal2.id,
  });

  const journalBlock1 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Mi familia',
    mood: 'HAPPY',
    page_id: journalPage1.id,
  });

  const journalBlock2 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Nothing',
    mood: 'SAD',
    page_id: journalPage2.id,
  });

  // Sound files
  const soundFile = await SoundFile.create({
    url: 'test.com',
  });

  // Unopened messages
  await UnopenedMessage.create({}).then((result) => {
    result.setSoundFile(soundFile);
    result.setUser(alice);
  });

  // Conversations
  const conversation = await Conversation.create({
    open: true,
  });
  await conversation.setFirstUser(alice);
  await conversation.setSecondUser(bob);

  await Message.create({}).then((result) => {
    result.setSoundFile(soundFile);
    result.setUser(alice);
    result.setConversation(conversation);
  });
};

export { seedData };

export default models;
