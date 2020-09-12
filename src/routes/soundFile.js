import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const allSoundFiles = await req.context.models.SoundFile.findAll();
  res.send(allSoundFiles);
});

router.get('/:soundFileId', async (req, res) => {
  const soundFile = await req.context.models.SoundFile.findByPk(req.params.soundFileId);
  res.send(soundFile);
});

router.post('/', async (req, res) => {
  const soundFile = await req.context.models.SoundFile.create({
    url: req.query.url,
  });
  res.send(soundFile);
});

router.put('/:soundFileId', async (req, res) => {
  var soundFile = await req.context.models.SoundFile.findByPk(req.params.soundFileId);
  if (soundFile) {
    soundFile = await req.context.models.SoundFile.upsert({
      id: req.params.soundFileId,
      url: req.query.url,
    }, {
      returning: true
    });
  }
  res.send(soundFile[0]);
});

router.delete('/:soundFileId', async (req, res) => {
  await req.context.models.SoundFile.destroy({
    where: {
      id: req.params.soundFileId,
    }
  });
  res.sendStatus(200);
});

export default router;
