const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

function applyCardCollisions(players, cards) {
  const destroyedCards = [];
  for (let i = 0; i < cards.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const card = cards[i];
      const player = players[j];
      if (
        player.distanceTo(card) <= Constants.PLAYER_RADIUS + Constants.CARD_WIDTH &&
        player.cards().length === 0
      ) {
        destroyedCards.push(card);
        player.addCard(card.id);
        break;
      } else if (
        player.distanceTo(card) <= Constants.PLAYER_RADIUS + Constants.CARD_WIDTH &&
        (card.id % 2 === 0 && player.cards().includes(card.id + 1))
      ) {
        destroyedCards.push(card);
        player.removeCard(card.id + 1);
        player.onDealtDamage();
        break
      } else if (
        player.distanceTo(card) <= Constants.PLAYER_RADIUS + Constants.CARD_WIDTH &&
        (card.id % 2 === 1 && player.cards().includes(card.id - 1))
      ) {
        destroyedCards.push(card);
        player.removeCard(card.id - 1);
        player.onDealtDamage();
        break
      }
    }
  }
  return destroyedCards;
}

module.exports = { applyCollisions, applyCardCollisions };
