import express from 'express';
import jwt from 'jsonwebtoken';

import Registration from './model';
import Account from '../account/model';
import mailerApi from '../../tools/mailer/mailerApi';
import ipFinder from '../../tools/extreme-ip/api';
import helper from '../../helpers/helpers';

const router = express.Router();

// POST - Create a pre register for the user. (Needs to activate)
router.post('/api/v1/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing field to register' });
    }

    if (password.lenth < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password too short' });
    }

    const validEmail = helper.validateEmail(email);

    if (!validEmail) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email provided' });
    }

    const existRegister = await Registration.findOne({ email });

    if (existRegister) {
      return res.status(409).json({
        success: false,
        message: 'User already registered but no activated yet',
      });
    }

    const existAccount = await Account.findOne({ email });

    if (existAccount) {
      return res.status(409).json({
        success: false,
        message: 'User already registered AND activated',
      });
    }

    const userRegister = await Registration.create({ ...req.body });
    userRegister.password = undefined;
    userRegister.token = helper.generateJwtToken(userRegister._id, '10m');
    mailerApi.emailToRegister(userRegister);

    res.status(200).json({ success: true, userRegister });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// GET - Make the confirmation by email from user
router.get('/api/v1/confirmation/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        success: false,
        data: { message: 'Confirmation Token Not Provided' },
      });
    }

    const _tokenIsValid = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!_tokenIsValid || !_tokenIsValid.id) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token provided' });
    }

    const existRegister = await Registration.findOne({
      _id: _tokenIsValid.id,
    });

    if (!existRegister) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already activated' });
    }

    const ipInfo = await ipFinder();

    const user = {
      name: existRegister.name,
      email: existRegister.email,
      password: existRegister.password,
      createdOn: existRegister.createdOn,
      activatedOn: Date.now(),
      _metadata: {
        registerLocation: ipInfo,
      },
    };

    const accountResult = await Account.create({ ...user });

    await Registration.deleteOne({ _id: existRegister._id });
    accountResult.password = undefined;
    res.status(200).json({ success: true, accountResult });
    // return res.redirect(`${process.env.URI_FRONTEND}`);
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = app => app.use(router);
