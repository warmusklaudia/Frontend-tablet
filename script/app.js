// const lanIP = `${window.location.hostname}:5000`;
// const socket = io(`https://${lanIP}`);

// SWITCHED FROM SOCKET TO MQTT 

const HOST = "TemiBroker"

const options = {
    keepalive: 60,
    clean: true,
    port: 443,
    protocol: "wss",
    rejectUnauthorized: false,
    ca: '/Cert/ca.crt'
}

const client = mqtt.connect('mqtts://' + HOST ,options);

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
  } else if (locatie == 'onderweg naar sportscube') {
    htmlString = `
        <p class="c-message-welkom">Volg mij</p>
        <p class="c-instruction">Wij gaan naar de Sportscube</p>
        `;
    }
    else if (locatie == "onthaal"){
        htmlString = `
        <p class="c-instruction">Wij zijn aangekomen aan het onthaal.</p>
        <p class="c-message-welkom">Tot ziens!</p>
        `;
    }
    else if (locatie == "onderweg naar onthaal"){
        htmlString = `
        <p class="c-message-welkom">Volg mij</p>
        <p class="c-instruction">Wij gaan naar het onthaal</p>
        `;
    }
    else {
        naamBezoeker.innerHTML = `${bezoekersData.voornaam}`;
    }

  // voorkomt dat welkom message wordt overgeschreven

    if (locatie != null){
        message.innerHTML = htmlString;
        changeLocation(afspraakId, jsonObject);
    }
}

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

// const listenToSocket = function () {
//     socket.on("connect", function(){
//         console.log("Verbonden met de socket webserver");
//     })
//     socket.on("connection_error", (err) => {
//         console.log(err);
//     })

//     socket.on("B2F_locatie_changed", function(jsonObject){
//         // jsonObject is dan de payload van de message
//         console.log("Message toegekomen: %O", jsonObject);
//         changeMessage(jsonObject);
//     })
// }

client.on("connect", function(){
    client.subscribe("B2F/locatie", function(err){
        if (!err){
            client.publish("F2B/connection", JSON.stringify({ "connectionStatus": "connected" }));
        }
    })
})

client.on("message", function (topic, message){
    const msg = JSON.parse(message.toString());

    console.log(`Message: ${message.toString()} on Topic: ${topic}`);

    if (topic == "B2F/locatie"){
        changeMessage(msg);
    }
})


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

  const urlParams = new URLSearchParams(window.location.search);
  afspraakId = urlParams.get('afspraakId');

    // event triggered functie (socket.io?) => moet nog geadd worden
    // volgende functie komt dan in de event listener
    // listenToSocket();
    // changeMessage(json);
});
