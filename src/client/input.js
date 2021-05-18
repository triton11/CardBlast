// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, deleteCard } from './networking';

function onMouseInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

var tappedTwice = false;
function onTouchStartInput(e) {
  if(!tappedTwice) {
    const touch = e.touches[0];
    handleInput(touch.clientX, touch.clientY);
    tappedTwice = true;
    setTimeout( function() { tappedTwice = false; }, 500 );
    return false;
  }
  event.preventDefault();
  deleteCard(0);
}

function onKeyDown(e) {
  const key = e.code;
  if (key == "KeyX") {
    deleteCard(0);
  }
}


function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('touchstart', onTouchStartInput, { passive: false });
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('touchstart', onTouchStartInput);
  window.removeEventListener('touchmove', onTouchInput);
}
