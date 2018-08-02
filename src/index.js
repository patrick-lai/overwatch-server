require('dotenv').config({ silent: true });

import { serveApp } from '@iag-packages/express-engine';
import express from 'express';
import { sendSms } from './sms';
import _get from 'lodash/get';
import _capitalize from 'lodash/capitalize';

const { PHONE_NUMBERS, BASE_URL } = process.env;

const origin = (_, cb) => cb(null, true);

const helpRouter = express.Router().post('/', (req, res, next) => {
  console.log('Request received', JSON.stringify(req.body, null, 2));
  const { username, location } = req.body;

  const long = _get(location, 'coords.longitude');
  const lat = _get(location, 'coords.latitude');

  // Send many....
  PHONE_NUMBERS.split(',').forEach(phoneNumber => {
    const _long = parseFloat(long).toFixed(2);
    const _lat = parseFloat(lat).toFixed(2);
    const _name = _capitalize(username);
    sendSms({
      PhoneNumber: phoneNumber,
      MessageStructure: 'text',
      Message: `${_name} needs help at ${_long}, ${_lat}. Track: ${BASE_URL}?lng=${long}&lat=${lat}&name=${_name}`
    });
  });
});

const config = {
  showError: true,
  logLevel: 'trace',
  cors: { origin },
  routes: {
    '/help': helpRouter
  }
};

serveApp(config);
