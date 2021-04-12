const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Card extends ObjectClass {
  constructor(x, y, count) {
    super(count, x, y, 0, 0);
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    return false;
  }
}

module.exports = Card;
