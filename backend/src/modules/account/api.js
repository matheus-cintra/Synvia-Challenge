import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import Account from './model';
import helper from '../../helpers/helpers';
import mailerApi from '../../tools/mailer/mailerApi';
import ipFinder from '../../tools/extreme-ip/api';
// import Company from '../company/model';
// import methods from './methods';

const router = express.Router();

router.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: { message: 'All fields are required to perform a login.' },
      });
    }

    const user = await Account.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Email or Password Invalid' });
    }

    const match = await bcryptjs.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        data: { message: 'User or password invalid.' },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '12h',
    });

    const ipInfo = await ipFinder();

    const userToFront = await Account.findOneAndUpdate(
      { _id: user._id },
      { $set: { '_metadata.ipInfo': ipInfo } },
      { new: true }
    );

    userToFront.password = undefined;
    let qrCodeOauth;

    if (!user.oAuthConfigured) {
      qrCodeOauth = await helper.generateOauthQrcode();
    }

    res.status(200).send({
      success: true,
      data: { auth: true, token, userToFront, qrCodeOauth },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = app => app.use(router);
