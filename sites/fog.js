const setToEST = require('../utils').setToEST;

const fog = {
  name: 'fog',
  url: 'https://fearofgod.com',
  onResponse,
};

let holdingVar;

function onResponse(onSuccess, logs, err, res) {
  const etagNew = res.headers.etag;

  if (!holdingVar) {
    const txt = `First run! Updating currentETag to ${etagNew}`;
    console.log(txt);
    logs.unshift(txt);
    holdingVar = etagNew;
  }

  const siteChanged = holdingVar !== etagNew;

  if (siteChanged) {
    const changed = `site changed!, ${setToEST(Date.now())}`;
    console.log(changed);
    logs.unshift(changed);
    onSuccess();
  } else {
    const update = `pinged fearofgod.com. no changes. ${setToEST(Date.now())}`;
    console.log(update);
    logs.unshift(update);
    holdingVar = etagNew;
  }
}

module.exports = fog;
