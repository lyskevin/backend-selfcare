import { Router } from 'express';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateAccessAndRefreshTokens,
  hashPassword,
} from '../lib/utils';
import passport from 'passport';
import User from '../models/user';
import RefreshToken from '../models/refreshToken';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';

const router = Router();

/**
 * Normal login
 */

router.post('/guest', async (req, res) => {
  try {
    const user = await User.create();
    const { id, fbId, name, alias } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, fbId, name, alias, username, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send();

  try {
    const hash = await hashPassword(password);

    const user = await User.create({ username, password: hash });
    const { id, fbId, name, alias } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, fbId, name, alias, username, ...tokens });
  } catch (e) {
    if (e instanceof Sequelize.UniqueConstraintError)
      return res.status(409).send('Username already taken');
    res.status(500).send();
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send();

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).send('User not found');
    const { id, fbId, name, alias } = user;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Wrong password');

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, fbId, name, alias, username, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.delete('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).send();

    await RefreshToken.destroy({ where: { token: refreshToken } });
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post('/token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).send();

    const tokenObj = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!tokenObj) return res.status(403).send('Invalid token');

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return res.status(403).send('Invalid token');
        const user = await User.findByPk(payload.sub);
        const accessToken = generateAccessToken(user);
        res.send({ accessToken });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

/*
 * Social login
 */

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/fail',
    session: false,
  }),
  (req, res) => {
    const { user } = req;
    const { token, expires } = generateAccessToken(user);
    res.status(200).json({ user, token, expires });
  }
);

router.get('/fail', (req, res) =>
  res.status(401).send('Failed to login to Facebook')
);

export default router;
