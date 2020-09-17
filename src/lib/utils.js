import jwt from 'jsonwebtoken';
/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the user ID
 */
function issueJWT(user) {
  const id = user.id;
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

// export { issueJWT };
export default issueJWT;
