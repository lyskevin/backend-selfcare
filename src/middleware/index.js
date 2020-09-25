import models from '../models';

const httpsRedirect = (req, res, next) => {
  if (!req.secure) return res.redirect(`https://${req.headers.host}${req.url}`);
  next();
};

export { httpsRedirect };
