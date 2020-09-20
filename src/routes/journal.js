import { Router } from 'express';
import passport from 'passport';
import JournalPage from '../models/journalPage';
import JournalBlock from '../models/journalBlock';
import { Op } from 'sequelize';
import db from '../config/database';

const router = Router();

router.get(
  '/page/range',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).send();
    try {
      const pages = await JournalPage.findAll({
        where: {
          date: {
            [Op.gte]: new Date(start),
            [Op.lte]: new Date(end),
          },
        },
        include: JournalBlock, // JOIN
      });

      if (!pages.length)
        return res
          .status(404)
          .send(`No pages between ${start} and ${end} found`);

      const pagesFlat = pages.map((page) => {
        const { journalBlocks, weather, location, mood, date, id } = page;
        const { prompt, content } = journalBlocks[0];
        return { id, date, weather, location, mood, prompt, content };
      });
      res.status(200).send(pagesFlat);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.get(
  '/page',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) return res.status(400).send();

      const page = await JournalPage.findOne({
        where: { date },
        include: JournalBlock,
      });

      if (!page) return res.status(404).send(`No page on ${date} found`);

      const { journalBlocks, weather, location, mood, id } = page;
      const { prompt, content } = journalBlocks[0];
      res
        .status(200)
        .send({ id, date, weather, location, mood, prompt, content });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

router.post(
  '/page',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).send();

    const { weather, location, prompt, content, mood } = req.body;

    try {
      await db.transaction(async (t) => {
        const [page, created] = await JournalPage.upsert(
          {
            date,
            weather,
            location,
            mood,
          },
          { transaction: t }
        );
        const block = await JournalBlock.create(
          { prompt, content },
          { transaction: t }
        );
        await page.addJournalBlock(block, { transaction: t });
      });
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

export default router;
