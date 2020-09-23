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
    const { id, name, username } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, name, username, ...tokens });
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
    const { id, name } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, name, username, ...tokens });
  } catch (e) {
    console.log(e);
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
    const { id, name } = user;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Wrong password');

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, name, username, ...tokens });
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

router.post(
  '/change',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { username, password } = req.body;
    const user = req.user;
    if (!user.username) {
      if ((username && !password) || (!username && password))
        return res.status(400).send();
    }
    user.username = username || user.username;
    user.password =
      (password && (await hashPassword(password))) || user.password;
    try {
      await user.save();
      res.status(200).send();
    } catch (e) {
      console.log(e);
      if (e instanceof Sequelize.UniqueConstraintError)
        return res.status(409).send('Username already taken');
      res.status(500).send();
    }
  }
);

/*
 * Social login
 */

router.post('/facebook', async (req, res) => {
  const { name, fbId } = req.body;
  if (!name || !fbId) return res.status(400).send('Missing name or fb id');

  try {
    const [user, created] = await User.findOrCreate({
      where: {
        fb_id: fbId,
        name,
      },
    });
    const { id, username } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, name, username, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get('/fail', (req, res) =>
  res.status(401).send('Failed to login to Facebook')
);

export default router;
