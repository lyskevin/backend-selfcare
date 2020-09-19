import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allJournalBlocks = await req.context.models.JournalBlock.findAll();
  res.send(allJournalBlocks);
});

router.get('/:journalBlockId', async (req, res) => {
  const journalBlock = await req.context.models.JournalBlock.findAll({
    where: {
      id: req.params.userId,
    },
  });
  res.send(journalBlock);
});

export default router;
