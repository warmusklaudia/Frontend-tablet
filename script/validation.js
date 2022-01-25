let afspraakJson = [],
  htmlEmail = {},
  inlogBtn;

function onScanSuccess(decodedText, decodedResult) {
  console.log(`Code scanned = ${decodedText}`, decodedResult);
  checkValidity(decodedText);
}

var html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);

const get = (url) => fetch(url).then((r) => r.json());

const showResult = (queryResponse) => {
  for (let i = 0; i < queryResponse.length; i++) {
    afspraakJson += `\n ${queryResponse[i].afspraakId}`;
  }
  console.log(afspraakJson);
};

const getOnlineAPI = async () => {
  const endPoint = `https://bezoekersapi.azurewebsites.net/api/afspraken`;
  const response = await get(endPoint);
  console.log({ response });
  showResult(response);
};

const checkValidity = async (code) => {
  console.log(code);
  console.log(afspraakJson);
  if (afspraakJson.indexOf(code) >= 0) {
    console.log(`Code: ${code}`)
    console.log('Code geldig');
    
    if (await checkDate(code) == true){
      window.location.href = `mainpage.html?afspraakId=${code}`;
    }
    else {
      window.location.href = `error.html?afspraakId=${code}`;
    }
  } 
  else {
    console.log('Code niet geldig');

    window.location.href = `error.html`;
  }
}

const checkValidityEmail = async (email) => {
  const endPoint = `https://bezoekersapi.azurewebsites.net/api/afsprakenvoormail/${email}`;
  const response = await get(endPoint);

  console.log(response)
  if(response.length != 0){
    code = response[0].afspraakId;
    console.log(response);
  }
  else {
    code = null;
  }

  if (code != null){
    if (await checkDate(code) == true){
      window.location.href = `mainpage.html?afspraakId=${code}`;
    }
    else {
      window.location.href = `error.html?afspraakId=${code}`
    }
  } 
  else {
    window.location.href = `error.html`;
  }
};

const checkDate = async (afspraakId) => {
  const endPoint = `https://bezoekersapi.azurewebsites.net/api/afspraken/${afspraakId}`;
  const response = await get(endPoint);

  let datumRegistratie = response.datum;
  let now = new Date();
  let dateString = moment(now). format('DD-MM-YY');
  console.log(`${datumRegistratie} == ${dateString}`);

  if(datumRegistratie == dateString){
    return true;
  }
  else {
    return false;
  }
} 

const listenToButton = () => {
  inlogBtn.addEventListener('click', () => {
    checkValidityEmail(htmlEmail.input.value);
  });
};

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const init = () => {
  // htmlCamera = document.getElementById('qr-reader__dashboard');
  // htmlCamera.style.display = 'none';
  htmlEmail.input = document.querySelector('.js-email');
  inlogBtn = document.querySelector('.js-button');
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM geladen');
  getOnlineAPI();
  init();
  listenToButton();
});
