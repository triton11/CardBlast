// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, CARD_WIDTH, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();


const cardFills = ['grey', 'red', 'blue', 'green', 'purple']

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, cards } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  // Draw all bullets
  // bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw cards
  cards.forEach(renderCard.bind(null, me));
}

function renderBackground(x, y) {
  context.fillStyle = "#EEEEEE";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  // context.fillStyle = 'white';
  // context.fillRect(
  //   canvasX - PLAYER_RADIUS,
  //   canvasY + PLAYER_RADIUS + 8,
  //   PLAYER_RADIUS * 2,
  //   2,
  // );
  // context.fillStyle = 'red';
  // context.fillRect(
  //   canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
  //   canvasY + PLAYER_RADIUS + 8,
  //   PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
  //   2,
  // );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

let cardList = [];

function renderCard(me, card) {
  const { x, y, id } = card;
  const fillIndex = Math.floor(id / cardList.length) % cardFills.length
  context.fillStyle = cardFills[fillIndex];
  context.fillRect(
    canvas.width / 2 + x - me.x - CARD_WIDTH,
    canvas.height / 2 + y - me.y - CARD_WIDTH / 2,
    CARD_WIDTH * 2,
    CARD_WIDTH,
  );
  context.fillStyle = 'white';
  context.font = "30px Arial";
  context.fillText(
    cardList[id % cardList.length], 
    canvas.width / 2 + x - me.x - CARD_WIDTH, 
    canvas.height / 2 + y - me.y - CARD_WIDTH / 2 + 30
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering(cards) {
  cardList = cards;
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
