// IGNORE

const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
let message;

// hardcoded json for testing
// zogezegd payload van message uit backend (opties: KLEEDKAMER + ONDERWEG, SPORTSCUBE + ONDERWEG, alle andere gevallen => default welkom message)
let json = {
    "locatie" : "sportscube"
}

const listenToSocket = function () {
    socket.on("connect", function(){
        console.log("Verbonden met de socket webserver");
    })

    socket.on("B2F_locatie_changed", function(jsonObject){
        // jsonObject is dan de payload van de message
        console.log(jsonObject);

        const locatie = jsonObject["locatie"];
        let htmlString = '';

        if (locatie == "kleedkamer"){
            htmlString = `
            <p class="c-instruction">Wij zijn aangekomen aan de kleedkamers. Volg verder instructies op jouw gsm.</p>
            `;
        }
        else if (locatie == "onderweg naar kleedkamer"){
            htmlString = `
            <p class="c-message-welkom">Volg mij</p>
            <p class="c-instruction">Wij gaan naar de kleedkamers</p>
            `;
        }
        else if (locatie == "sportscube"){
            htmlString = `
            <p class="c-instruction">Wij zijn aangekomen aan de Sportscube.</p>
            <p class="c-message-welkom">Veel plezier!</p>
            `;
        }
        else if (locatie == "onderweg naar sportscube"){
            htmlString = `
            <p class="c-message-welkom">Volg mij</p>
            <p class="c-instruction">Wij gaan naar de Sportscube</p>
            `;
        }

        // voorkomt dat welkom message zomaar wordt overgeschreven
        if (htmlString != ''){
            message.innerHTML = htmlString;
        }
    })
}

document.addEventListener("DOMContentLoaded", function(){
    console.log("DOMContent loaded");

    message = document.querySelector(".js-message");

    // event triggered functie (socket.io?) => moet nog geadd worden
    // volgende functie komt dan in de event listener
    listenToSocket();
})