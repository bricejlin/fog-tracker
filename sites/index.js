const fog = require('./fog');
const yeezy = require('./yeezy');

const siteList = [fog, yeezy];

const sitesObj = siteList.reduce((acc, site) => {
  acc[site.name] = {
    name: site.name,
    url: site.url,
    onResponse: site.onResponse,
  };
  return acc;
}, {});

module.exports = sitesObj;
