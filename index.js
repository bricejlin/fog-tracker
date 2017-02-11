require('dotenv').config();

const fs = require('fs');

const schedule = require('node-schedule');

const tClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TwilioClientFactory = require('./TwilioClientFactory');
const twilioClient = TwilioClientFactory.create(tClient);

const setToEST = require('./utils').setToEST;
const task = require('./task');

const express = require('express');
const app = express();
app.set('view engine', 'pug');

const logs = [];

app.get('/', (req, res) => {
  res.status(200).render('index', { logs });
});

app.get('/debug-call', (req, res) => {
  twilioClient.call((err, call) => {
    if (err) {
      console.log(err);
    } else {
      console.log(call.sid);
    }
  });
  res.status(200).send('triggered call');
});

const PORT = process.env.PORT || 8081;
const activeSite = require('./sites').yeezy.name;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('starting scheduler...', setToEST(Date.now()));

  const job = schedule.scheduleJob('* * * * * *', () => {
    task(activeSite, logs, job.cancel.bind(this));
  });
});
