let message;

const errorMessage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('afspraakId')){
        afspraakId = urlParams.get('afspraakId');
        message.innerHTML = `<p> U hebt geen afspraak vandaag, gelieve het onthaal te verwittigen.</p>`
    }
}


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM geladen');
    message = document.querySelector('.js-message');

    errorMessage();
  });