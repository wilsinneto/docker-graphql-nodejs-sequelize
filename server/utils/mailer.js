const path = require('path')
const nodemailer = require('nodemailer')
const { pugEngine } = require('nodemailer-pug-engine');

const { host, port, user, pass } = require('../config/mail.json')

var transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

transport.use('compile', pugEngine({
  templateDir: path.resolve('./views/'),
  pretty: true
}))


module.exports = transport