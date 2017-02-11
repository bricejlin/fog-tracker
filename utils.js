const moment = require('moment-timezone');

module.exports = {
  setToEST: function setToEST(dateTime) {
    return moment(dateTime).tz('America/New_York').format('dddd, MMMM Do YYYY, h:mm:ss a');
  },
};
