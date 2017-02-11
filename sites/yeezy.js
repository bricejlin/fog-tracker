const setToEST = require('../utils').setToEST;

const yeezy = {
  name: 'yeezy',
  url: 'https://www.adidas.com/yeezy',
  onResponse,
};

let holdingVar;

function onResponse(onSuccess, logs, err, res, body) {
  if (!holdingVar) {
    const txt = `First run!`;
    console.log(txt);
    logs.unshift(txt);
    holdingVar = body;
  }

  const siteChanged = holdingVar !== body;

  if (siteChanged) {
    const changed = `site changed!, ${setToEST(Date.now())}`;
    console.log(changed);
    logs.unshift(changed);
    onSuccess();
  } else {
    const update = `pinged adidas.com. no changes. ${setToEST(Date.now())}`;
    console.log(update);
    logs.unshift(update);
    holdingVar = body;
  }
}

module.exports = yeezy;
