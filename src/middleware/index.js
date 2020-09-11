import models from '../models';

const context = (req, res, next) => {
  req.context = {
    models,
  };
  next();
};

export { context };
