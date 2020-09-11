import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { sequelize, seedData } from './models';
import { context } from './middleware';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(context);

const eraseDatabaseOnSync = true;

sequelize
  .sync({ force: eraseDatabaseOnSync })
  .then(() => {
    seedData();

    app.listen(process.env.PORT || 8080, () =>
      console.log(`listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

app.use('/users', routes.user);
