// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import { setCollectedcardsHidden } from './collectedcards';


// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const cardsInput = document.getElementById('cards-input');
const existingCardsInput = document.getElementById('card-lists');
const allCardLists = {
  "spanish": ["dog","perro","cat","gato","girl","chica","boy","chico","money","dinero","red","rojo","blue","azul","green","verde","yellow","amarillo","tree","arbol"],
  "spanish-nature": ["animal", "animal", "bird", "pájaro", "bush", "arbusto", "carbon dioxide", "dióxido de carbono", "climate change", "cambio climático", "tree", "árbol", "vegetables", "verduras", "water", "agua", "sun", "sol", "trash", "basura"],
  "marathi": ["dog","kutra","cat","manzar","girl","mulgi","boy","mulga","money","paise","red","lal","blue","nirla","green","hirva","yellow","pewrla","tree","zhaad"],
  "croatia1": ["I", "jaz", "you", "ti", "he", "on", "we", "mi", "you all", "vi", "they", "oni", "this", "ta/to", "that", "tisti/tista/tisto", "here", "tu/tukaj", "there", "tam"], 
  "croatia2": ["who?", "kdo", "what?", "kaj", "where?", "kje", "when?", "kdaj", "how?", "kako", "not", "ne", "all", "vse", "many", "veliko", "some", "nekoliko", "few", "malo"],
  "yoyo": ["yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo","yo"]
}

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    initState();
    startCapturingInput();
    const cardsOrExisting = (cardsInput.value.length === 0) ? allCardLists[existingCardsInput.value] : cardsInput.value.split(',')
    startRendering(cardsOrExisting);
    setLeaderboardHidden(false);
    setCollectedcardsHidden(false);
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
  setCollectedcardsHidden(true);
}
