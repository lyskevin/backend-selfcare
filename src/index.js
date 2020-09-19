import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { sequelize, seedData } from './models';
import { context } from './middleware';
import routes from './routes';
import fileUpload from 'express-fileupload';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(context);
app.use(fileUpload());

const eraseDatabaseOnSync = true;

sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(() => {
    seedData();

    app.listen(process.env.PORT || 3000, () =>
      console.log(`listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

app.use('/users', routes.user);
app.use('/messages', routes.message);
app.use('/conversations', routes.conversation);
