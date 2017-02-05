require('dotenv').config();

const fs = require('fs');

const request = require('request');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const dialog = require('dialog');

const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let currentETag;
let logs = [];

const express = require('express');
const app = express();
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.status(200).render('index', { logs });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('starting scheduler...', setToEST(Date.now()));
  const job = schedule.scheduleJob('* * * * * *', () => {
    makeRequest(job);
  });
});

function makeRequest(scheduledJob) {
  request
    .get('https://fearofgod.com')
    .on('response', (res) => {
      const etagNew = res.headers.etag;

      if (!currentETag) {
        const txt = `First run! Updating currentETag to ${etagNew}`;
        console.log(txt);
        logs.unshift(txt);
        currentETag = etagNew;
      }

      const siteChanged = currentETag !== etagNew;

      if (siteChanged) {
        /*twilioClient.messages.create({ 
          to: "+19174851586", 
          from: "+13478942207", 
          body: "CHECK THE FEAR OF GOD SITE BRUH!!!111", 
        }, function(err, message) { 
          if (err) {
            console.log(err);
          }
          console.log(message.sid); 
        });*/

        const changed = `site changed!, ${setToEST(Date.now())}`;
        console.log(changed);
        logs.unshift(changed);
        dialog.info('STOP EVERYTHING YOU ARE DOING AND VISIT FEAROFGOD.COM');

        twilioClient.calls.create({
          url: 'http://handler.twilio.com/twiml/EH0a93ed4df693560800050b6dc4920cff',
          to: "+19174851586",
          //to: '+16466966124', // kauf
          //to: '+13472491888', // raf
          from: "+13478942207",
          ifMachine: 'Hangup'
        }, function(err, call) {
          if (err) {
            console.log(err);
            scheduledJob.cancel();
          } else {
            console.log(call.sid);
            scheduledJob.cancel();
          }
        });
      } else {
        const update = `pinged fearofgod.com. no changes. ${setToEST(Date.now())}`;
        console.log(update);
        logs.unshift(update);
        currentETag = etagNew;
      }
    });
}

function setToEST(dateTime) {
  return moment(dateTime).tz('America/New_York').format('dddd, MMMM Do YYYY, h:mm:ss a');
}
