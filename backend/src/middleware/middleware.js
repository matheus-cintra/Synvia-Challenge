import jwt from 'jsonwebtoken';
import 'dotenv/config';
import helper from '../helpers/helpers';

const allowedUris = [
  '/api/v1/register',
  '/api/v1/confirmation',
  '/api/v1/login',
  '/api/v1/passwordRecovery',
  '/api/v1/oauth',
];

let confRoute;

const data = {
  success: false,
  code: 401,
  message: 'Not Authorized',
  description: undefined,
};

module.exports = app => {
  app.use(async (req, res, next) => {
    const _includeParam = req.url.split('/');

    if (_includeParam.includes('confirmation')) {
      _includeParam.pop();
      confRoute = _includeParam.join('/');
    }

    if (!allowedUris.includes(req.url) && !allowedUris.includes(confRoute)) {
      try {
        const authToken = req.headers['auth-token'];
        const accountId = req.headers['account-id'];

        if (!authToken)
          return res.status(401).json({ error: 'Token não informado' });

        try {
          const isAuth = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

          if (isAuth.id !== accountId) {
            return res.status(401).json({ error: 'Token inválido' });
          }
        } catch (err) {
          return res.status(401).json({ error: 'Token inválido' });
        }
      } catch (err) {
        data.description = `Account-id invalid`;
        return helper.returnDataServer(res, data, 500);
      }
    }
    next();
  });
};
