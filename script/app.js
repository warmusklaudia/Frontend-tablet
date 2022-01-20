// const lanIP = `${window.location.hostname}:5000`;
// const socket = io(`https://${lanIP}`);

// SWITCHED FROM SOCKET TO MQTT 

const HOST = "TemiBroker"
const CA_FILE = `-----BEGIN CERTIFICATE-----
MIIEQTCCAymgAwIBAgIUJSnAG1X02P+EFWE5v3oFj9yt1/0wDQYJKoZIhvcNAQEL
BQAwga8xCzAJBgNVBAYTAkJFMRgwFgYDVQQIDA9XZXN0LVZsYWFuZGVyZW4xETAP
BgNVBAcMCEtvcnRyaWprMRMwEQYDVQQKDApIb3dlc3QgTUNUMRQwEgYDVQQLDAtN
Q1QgVGVtaSBHMjETMBEGA1UEAwwKVGVtaUJyb2tlcjEzMDEGCSqGSIb3DQEJARYk
aWFuLnZhbi5jYXV3ZW5iZXJnQHN0dWRlbnQuaG93ZXN0LmJlMB4XDTIyMDExOTE3
Mjk0N1oXDTI3MDExOTE3Mjk0N1owga8xCzAJBgNVBAYTAkJFMRgwFgYDVQQIDA9X
ZXN0LVZsYWFuZGVyZW4xETAPBgNVBAcMCEtvcnRyaWprMRMwEQYDVQQKDApIb3dl
c3QgTUNUMRQwEgYDVQQLDAtNQ1QgVGVtaSBHMjETMBEGA1UEAwwKVGVtaUJyb2tl
cjEzMDEGCSqGSIb3DQEJARYkaWFuLnZhbi5jYXV3ZW5iZXJnQHN0dWRlbnQuaG93
ZXN0LmJlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzbHZUwx1U3k3
j4TofQ59Db/IBYgzc3s2bAiVyI8G2n/cCf2LqOYFUpzo2l0VyxUOS4g9CQidkf3D
1kgr60HyNbzWql/YlRzkH0sI4JNtHKLfmTBBTXKOvGfDq4J20o0QMXMhh3gagTIF
arEJdNXxgSNESHnvsOHWO7+uLVCEAQ1k8Qxf/boS9h/9KD3QxznXQU3bYkZWicGb
0We1ZyMAlEmiYnRaKRlG/gIRGP4ErDHiuNzwPF2Nsmh4oWQS71ncmkUwv+oEIDn3
XBEhFotcnNT8E3BVqxj/TnMfoN1NbqNx6YHd6iM2CHqokKkVQsboIyD07J3vFGph
gPf/KB68+wIDAQABo1MwUTAdBgNVHQ4EFgQU1iNBkE5fcGyX5W8vJs2YvT2f9RYw
HwYDVR0jBBgwFoAU1iNBkE5fcGyX5W8vJs2YvT2f9RYwDwYDVR0TAQH/BAUwAwEB
/zANBgkqhkiG9w0BAQsFAAOCAQEAlNWUQ081zY5iFA642/AD6Puf0G6lnm6KGXeU
LjiVpL/gpdMp1YzslnnZ/oha0pA8jB/cR69J461ai879DID3QSs5TTfGDzsYHaVU
QKeDTnTYEYeAHo8XHCBhUVl3T1ajf5BjuFdtD/1LNduqH0fy12Yb8QUiCJES2oCa
b7y0jR8SGQiZuettg68oYHOPZMw11qsztFHCUedPjekR5gDj70F9iB8YKm/MOV+L
BMg800j2MhGYFVslzZ5SZEHDvPh6tSh1wDxF21A0PUFZ6gdgoXHc6ubSg5x80dNN
Ugoox7bgbX0lwxmQ9sqg1NmmVrJ8P/V/rc92pw13s6xtrvdmGw==
-----END CERTIFICATE-----`

const options = {
    keepalive: 60,
    clean: true,
    rejectUnauthorized: false,
    ca: CA_FILE
}

const client = mqtt.connect('wss://' + HOST + ':443',options);

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
