import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allJournalPages = await req.context.models.JournalPage.findAll();
  res.send(allJournalPages);
});

router.get('/:journalPageId', async (req, res) => {
  const journalPage = await req.context.models.JournalPage.findAll({
    where: {
      id: req.params.userId,
    },
  });
  res.send(journalPage);
});

export default router;
