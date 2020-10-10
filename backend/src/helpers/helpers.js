/* eslint-disable no-unused-vars */
/* eslint no-useless-escape: "error" */

import axios from 'axios';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

/**
 * @name returnOnlyNumbers
 * @description Return any string received removing special chars
 * @param  {String} str String to replace
 */
function returnOnlyNumbers(str) {
  if (!str) return;
  return str.replace(/[^0-9]/g, '');
}

function validateEmail(email) {
  const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (!reg.test(email)) {
    return false;
  }

  return true;
}

function generateJwtToken(userId, timeToExpire) {
  console.warn('userId > ', userId);
  console.warn('timeToExpire > ', timeToExpire);
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: timeToExpire,
  });
}

function normalize(str, strCase) {
  if (!str) return;

  const result = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (strCase === 'lower') {
    return result.toLowerCase();
  }
  if (strCase === 'upper') {
    return result.toUpperCase();
  }
  return result;
}

function generateOauthQrcode() {
  return new Promise(resolve => {
    const secret = speakeasy.generateSecret({
      name: process.env.OAUTH_SECRET,
    });

    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      resolve(data);
    });
  });
}

export default {
  returnOnlyNumbers,
  generateJwtToken,
  validateEmail,
  normalize,
  generateOauthQrcode,
};
