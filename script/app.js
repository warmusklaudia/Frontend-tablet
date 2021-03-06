today = new Date();
time = moment(today).format('HH:mm');
meeting = '10:20';
x = moment(meeting, 'HH:mm').add(0, 'seconds').add(15, 'minutes').format('HH:mm');

const options = {
  keepalive: 60,
  clean: true,
};

const client = mqtt.connect('ws://40.113.96.140:80', options);

client.on('connect', function () {
  client.subscribe('B2F/locatie', function (err) {
    if (!err) {
      console.log('Connected to Mqtt!');
    }
  });
});

client.on('message', function (topic, message) {
  const msg = JSON.parse(message.toString());

  console.log(`Message: ${message.toString()} on Topic: ${topic}`);

  if (topic == 'B2F/locatie' && JSON.parse(message).locatie != null) {
    changeMessage(msg);
  }
});

// EINDE MQTT CLIENT

let message, naamBezoeker;
let afspraakId;

const changeMessage = async (jsonObject) => {
  // jsonObject is dan de payload van de message
  console.log(jsonObject);

  let bezoekersData = await getVisitorData(afspraakId);
  console.log(bezoekersData);

  const locatie = jsonObject['locatie'];

  let htmlString = '';

  if (locatie == 'kleedkamer') {
    htmlString = `
        <p class="c-instruction">Wij zijn aangekomen aan de kleedkamers. Volg verder instructies op jouw gsm.</p>
        `;
    setTimeout(function () {
      window.location.href = `index.html`;
    }, 2000);
  } else if (locatie == 'onderweg naar kleedkamer') {
    htmlString = `
        <p class="c-message-welkom">Volg mij</p>
        <p class="c-instruction">Wij gaan naar de kleedkamers</p>
        `;
  } else if (locatie == 'sportscube') {
    htmlString = `
        <p class="c-instruction">Wij zijn aangekomen aan de Sportscube.</p>
        <p class="c-message-welkom">Veel plezier!</p>
        `;
    setTimeout(function () {
      window.location.href = `index.html`;
    }, 2000);
  } else if (locatie == 'onderweg naar sportscube') {
    htmlString = `
        <p class="c-message-welkom">Volg mij</p>
        <p class="c-instruction">Wij gaan naar de Sportscube</p>
        `;
  } else if (locatie == 'onthaal') {
    htmlString = `
        <p class="c-instruction">Wij zijn aangekomen aan het onthaal.</p>
        <p class="c-message-welkom">Tot ziens!</p>
        `;
    setTimeout(function () {
      window.location.href = `index.html`;
    }, 2000);
  } else if (locatie == 'onderweg naar onthaal') {
    htmlString = `
        <p class="c-message-welkom">Volg mij</p>
        <p class="c-instruction">Wij gaan naar het onthaal</p>
        `;
  } else {
    naamBezoeker.innerHTML = `${bezoekersData.voornaam}`;
    uurAfspraak.innerHTML = `${bezoekersData.tijdstip}`;
  }

  // voorkomt dat welkom message wordt overgeschreven

  if (locatie != null) {
    message.innerHTML = htmlString;
    changeLocation(afspraakId, jsonObject);
  } else {
    checkIfTooLate(bezoekersData.tijdstip);
  }
};

const changeLocation = (id, jsonObject) => {
  const putMethod = {
    method: 'PUT', // Method itself
    headers: {
      'Content-type': 'application/json; charset=UTF-8', // Indicates the content
    },
    body: JSON.stringify(jsonObject), // We send data in JSON format
  };

  // make the HTTP put request using fetch api
  fetch(`https://bezoekersapi.azurewebsites.net/api/afspraken/${id}/locatie`, putMethod)
    .then((response) => response.json())
    .then((data) => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
    .catch((err) => console.log(err)); // Do something with the error
};

const checkIfTooLate = (tijdstip) => {
  x = moment(tijdstip, 'HH:mm').add(0, 'seconds').add(30, 'minutes').format('HH:mm');
  y = moment(tijdstip, 'HH:mm').subtract(0, 'seconds').subtract(30, 'minutes').format('HH:mm');

  if (time <= x && time >= y) {
    gsmMess.innerHTML = 'Volg nu de instructies op jouw gsm om verder te gaan';
    client.publish('F2B/connection', JSON.stringify({ connectionStatus: 'connected', afspraakId: afspraakId }));
  } else if (time > x) {
    console.log(`${time} <= ${x} ${time <= x}`);
    teLaat.innerHTML = `Je bent te laat! Gelieve het onthaal te contacteren`;
    setTimeout(
      function() {
          window.location.href = `index.html`;
    }, 10000);
  } else if (time < y) {
    teLaat.innerHTML = `Je bent te vroeg! Gelieve even te wachten in de cafetaria`;
    setTimeout(
      function() {
          window.location.href = `index.html`;
    }, 10000);
  }
};

const get = (url) => fetch(url).then((r) => r.json());

const getVisitorData = async (id) => {
  const endpoint = `https://bezoekersapi.azurewebsites.net/api/afspraken/${id}`;
  const response = await get(endpoint);

  return response;
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContent loaded');

  message = document.querySelector('.js-message');
  naamBezoeker = document.querySelector('.js-naam');
  uurAfspraak = document.querySelector('.js-uur');
  teLaat = document.querySelector('.js-toolate');
  gsmMess = document.querySelector('.js-gsm-mess');

  const urlParams = new URLSearchParams(window.location.search);
  afspraakId = urlParams.get('afspraakId');
  let URLlocatie = urlParams.get('locatie');
  let json = JSON.stringify({ locatie: URLlocatie });
  json = JSON.parse(json);
  console.log(json);
  if (URLlocatie != '') {
    changeMessage(json);
  }
});
