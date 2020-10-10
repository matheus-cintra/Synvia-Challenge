/* eslint-disable func-names */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-shadow */
/* eslint-disable no-eval */
// const sgMail = require('@sendgrid/mail');
import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';

const config = require('./config/config.json');

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const nodeMailerOptions = {
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password,
  },
  host: config.smtp.server,
  port: config.smtp.port && Number(config.smtp.port),
  secure: config.smtp.secure,
};

const transporter = nodemailer.createTransport(nodeMailerOptions);

async function emailToRegister(doc) {
  console.warn('DOC > ', doc);
  const registerTemplate = `${__dirname}/templates/register.html`;

  const htmlRegister = require(registerTemplate);
  doc.uriToConfirm = process.env.URI_CONFIRMATION_ACCOUNT;
  const registerBody = {
    to: doc.email,
    from: `${config.name} ${config.email}`,
    fromName: config.name,
    subject: config.subject,
    html: eval(`\`${htmlRegister}\``),
  };
  transporter.sendMail(registerBody);
}

export default {
  emailToRegister,
};
