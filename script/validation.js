let afspraakJson = [],
  email = {},
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
    console.log(`Code: ${code}`);
    console.log('Code geldig');

    if ((await checkDate(code)) == true) {
      window.location.href = `mainpage.html?afspraakId=${code}`;
    } else {
      window.location.href = `error.html?afspraakId=${code}`;
    }
  } else {
    console.log('Code niet geldig');
  }
};

const isValidEmailAddress = function (emailAddress) {
  // Basis manier om e-mailadres te checken.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const doubleCheckEmailAddress = function () {
  if (isValidEmailAddress(email.input.value)) {
    // Stop met dit veld in de gaten te houden; het is in orde.
    email.input.removeEventListener('input', doubleCheckEmailAddress);
    removeErrors(email);
  } else {
    // Stuk herhalende code.
    if (isEmpty(email.input.value)) {
      email.errorMessage.innerText = 'This field is required';
    } else {
      email.errorMessage.innerText = 'Invalid emailaddress';
    }
  }
};

const isEmpty = function (fieldValue) {
  return !fieldValue || fieldValue.length < 1;
};

const addErrors = function (formField) {
  formField.field.classList.add('has-error');
  formField.errorMessage.classList.add('is-visible');
};

const removeErrors = function (formField) {
  formField.field.classList.remove('has-error');
  formField.errorMessage.classList.remove('is-visible');
};

const checkValidityEmail = async (email) => {
  const endPoint = `https://bezoekersapi.azurewebsites.net/api/afsprakenvoormail/${email}`;
  const response = await get(endPoint);
  let code;
  let now = new Date();

  for (let i = 0; i < response.length; i++) {
    console.log(response);
    if (response.length != 0) {
      code = response[i].afspraakId;
      datumRegistratie = response[i].datum;
      let dateString = moment(now).format('DD-MM-YY');
      if (datumRegistratie == dateString) {
        console.log(`${datumRegistratie} == ${dateString}`);
        if ((await checkDate(code)) == true) {
          window.location.href = `mainpage.html?afspraakId=${code}`;
        }
      }
    }
  }

  if (code != null) {
    if ((await checkDate(code)) == false) {
      window.location.href = `error.html?afspraakId=${code}`;
    }
  } else {
    console.log('Code niet geldig');
    window.location.href = `error.html`;
  }
};

const enableListeners = function () {
  email.input.addEventListener('blur', function () {
    if (!isValidEmailAddress(email.input.value)) {
      if (isEmpty(email.input.value)) {
        email.errorMessage.innerText = 'This field is required';
      } else {
        email.errorMessage.innerText = 'Invalid emailaddress';
      }

      addErrors(email);
      email.input.addEventListener('input', doubleCheckEmailAddress);
    }
  });

  inlogBtn.addEventListener('click', function (e) {
    // We gaan de form zelf versturen wanneer nodig.
    e.preventDefault();
    checkValidityEmail(email.input.value);

    if (isValidEmailAddress(email.input.value)) {
      removeErrors(email);
    } else {
      if (!isValidEmailAddress(email.input.value)) {
        addErrors(email);
        email.input.addEventListener('input', doubleCheckEmailAddress);
      }
    }
  });
};

const checkDate = async (afspraakId) => {
  const endPoint = `https://bezoekersapi.azurewebsites.net/api/afspraken/${afspraakId}`;
  const response = await get(endPoint);

  let datumRegistratie = response.datum;
  let now = new Date();
  let dateString = moment(now).format('DD-MM-YY');
  console.log(`${datumRegistratie} == ${dateString}`);

  if (datumRegistratie == dateString) {
    return true;
  } else {
    return false;
  }
};

const init = () => {
  // htmlCamera = document.getElementById('qr-reader__dashboard');
  // htmlCamera.style.display = 'none';
  inlogBtn = document.querySelector('.js-button');
  email.label = document.querySelector('.js-email-label');
  email.errorMessage = email.label.querySelector('.js-email-error-message');
  email.input = document.querySelector('.js-email-input');
  email.field = document.querySelector('.js-email-field');
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM geladen');
  getOnlineAPI();
  init();
  enableListeners();
});
