import { Router } from 'express';
import passport from 'passport';
import JournalPage from '../models/journalPage';
import JournalBlock from '../models/journalBlock';

const router = Router();

router.get(
  '/page',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { date } = req.query;
    const page = await JournalPage.findOne({ where: { date } });
    res.send(page);
  }
);

router.post(
  '/block',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { prompt, content, mood } = req.body;
    const date = new Date();

    const [page, created] = await JournalPage.findOrCreate({ where: { date } });

    const { id: pageId } = page;

    await JournalBlock.upsert({
      page_id: pageId,
      prompt,
      content,
      mood,
    });

    res.status(200).send();
  }
);

export default router;
