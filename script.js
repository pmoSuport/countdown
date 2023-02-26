const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dataEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountDown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with Today's Date
const today = new Date().toISOString().split('T')[0];
dataEl.setAttribute('min', today);

//populate countdown / complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // hide input
    inputContainer.hidden = true;

    // if the countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
      countdownTitle.value = '';
      countdownDate.value = '';
    } else {
      // else, show the countdown in progress   //populate countdown
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountDown = {
    title: countdownTitle,
    date: countdownDate,
  };
  console.log(savedCountDown);
  localStorage.setItem('countdown', JSON.stringify(savedCountDown));
  // check for valid date
  if (countdownDate === '') {
    alert('Please select the date for the countdown');
  } else {
    // get number version of current Date, updateDOM
    countdownValue = new Date(countdownDate).getTime();
    // console.log(countdownValue);
    updateDOM();
  }
}

// reset all values
function reset() {
  // hide countdows, show Input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  // stop countdown
  clearInterval(countdownActive);
  // reset localstorage value
  localStorage.removeItem('countdown');
  clearFields();
}

function restorePrevCountdown() {
  // get countdown from localstorage if available
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountDown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountDown.title;
    countdownDate = savedCountDown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// clear the inputs
function clearFields() {
  document.getElementById('date-picker').value = '';
  document.getElementById('title').value = '';
}
// event listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

restorePrevCountdown();
