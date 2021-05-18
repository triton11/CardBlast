const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.eats = 0;
    this.myCards = [];
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    // this.fireCooldown -= dt;
    // if (this.fireCooldown <= 0) {
    //   this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    //   return new Bullet(this.id, this.x, this.y, this.direction);
    // }

    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  getEaten() {
    this.hp = 0;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_CARD_BLAST;
  }

  onEatPlayer() {
    this.eats += 1;
    this.score -= Math.ceil(this.score / 2);
  }

  serializeForUpdate() {
    const cardString = this.myCards.length ? this.myCards.join() : '-1';
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      // hp: this.hp,
      score: this.score,
      collectedcards: cardString
    };
  }

  cards() {
    return this.myCards;
  }

  removeCard(cardId) {
    this.myCards = this.myCards.filter(c => c != cardId)
  }

  removeAllCards() {
    this.myCards = []
  }

  addCard(cardId) {
    this.myCards.push(cardId)
  }
}

module.exports = Player;
