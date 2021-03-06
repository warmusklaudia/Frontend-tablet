let afspraakId, locatie;

const options = {
  keepalive: 60,
  clean: true,
};

const client = mqtt.connect('ws://40.113.96.140:80', options);

client.on('connect', function () {
  client.subscribe('B2F/return', function (err) {});
});

client.on('message', function (topic, message) {
  const msg = JSON.parse(message.toString());

  console.log(`Message: ${message.toString()} on Topic: ${topic}`);

  if (topic == 'B2F/return') {
    JsonObject = msg;
    afspraakId = JsonObject['GUID'];
    locatie = JsonObject['locatie'];
    returnstate = JsonObject['return'];
    window.location.href = `mainpage.html?afspraakId=${afspraakId}`;
  }
});

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContent loaded');
});
