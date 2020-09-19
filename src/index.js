import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import db from './config/database';
import { seedData } from './models';
import { context } from './middleware';
import routes from './routes';
import passportConfig from './config/passport';
import passport from 'passport';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(context);
app.use(fileUpload());

// Passport authorization
app.use(passport.initialize());
passportConfig(passport);

const eraseDatabaseOnSync = true;

db.sync({ force: eraseDatabaseOnSync })
  .then(() => {
    seedData();

    app.listen(process.env.PORT || 3000, () =>
      console.log(`listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

app.use('/users', routes.user);
app.use('/journalPages', routes.journalPage);
app.use('/journalBlocks', routes.journalBlock);
app.use('/messages', routes.message);
app.use('/conversations', routes.conversation);
