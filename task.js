const request = require('request');
const dialog = require('dialog');

const tClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TwilioClientFactory = require('./TwilioClientFactory');
const twilioClient = TwilioClientFactory.create(tClient);

const SITES = require('./sites');

function task(activeSite, logs, stopJob) {
  const url = SITES[activeSite].url;
  const onResponse = SITES[activeSite].onResponse;

  request(url, onResponse.bind(null, onSuccess.bind(null, stopJob, url), logs));
}

function onSuccess(stopJob, url) {
  dialog.info(`STOP EVERYTHING YOU ARE DOING AND VISIT ${url}!`);
  twilioClient.call((err, res) => {
    if (err) {
      console.log(err);
      stopJob();
    } else {
      console.log(res.sid);
      stopJob();
    }
  });
}

module.exports = task;
