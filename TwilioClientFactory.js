const TwilioClientFactory = {
  create: client => {
    return {
      call: (cb) => {
        client.calls.create({
          url: 'http://handler.twilio.com/twiml/EH0a93ed4df693560800050b6dc4920cff',
          to: '+19174851586',
          from: '+13478942207',
          ifMachine: 'Hangup',
        }, cb);
      },
      text: (cb) => {
        client.messages.create({
          to: "+19174851586",
          from: "+13478942207",
          body: "CHECK THE FEAR OF GOD SITE BRUH!!!111",
        }, cb);
      },
    };
  },
};

module.exports = TwilioClientFactory;
