const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let message, naamBezoeker;
let afspraakId;

// hardcoded json for testing
// zogezegd payload van message uit backend (opties: KLEEDKAMER + ONDERWEG, SPORTSCUBE + ONDERWEG, alle andere gevallen => default welkom message)
let json = {
  locatie: null,
};

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
  } else {
    naamBezoeker.innerHTML = `${bezoekersData.voornaam}`;
  }

  // voorkomt dat welkom message wordt overgeschreven

  if (locatie != null) {
    message.innerHTML = htmlString;
  }
};

const listenToSocket = function () {
    socket.on("connect", function(){
        console.log("Verbonden met de socket webserver");
    })

    socket.on("B2F_locatie_changed", function(jsonObject){
        // jsonObject is dan de payload van de message
        console.log("Message toegekomen: %O", jsonObject);
        changeMessage(jsonObject);
    })
}

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
    listenToSocket();
})
  // event triggered functie (socket.io?) => moet nog geadd worden
  // volgende functie komt dan in de event listener
  changeMessage(json);
});
