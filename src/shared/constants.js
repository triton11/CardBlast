module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 300,
  PLAYER_FIRE_COOLDOWN: 0.50,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  SCORE_CARD_BLAST: 10,
  SCORE_PER_SECOND: 0,

  CARD_WIDTH: 100,
  DISPLAYED_CARDS: 10,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    DELETE_CARD: 'delete_card',
    GAME_OVER: 'dead',
  },
});
