import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the user ID
 */
function issueJwt(user) {
  const { id } = user;
  const expiresIn = '1d';

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: expiresIn });

  return {
    token: 'Bearer ' + token,
    expires: expiresIn,
  };
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export { issueJwt, hashPassword };
