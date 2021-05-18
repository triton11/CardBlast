const Constants = require('../shared/constants');
const Player = require('./player');
const Card = require('./card')
const { applyCollisions, applyCardCollisions, applyPlayerCollisions } = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    // this.bullets = [];
    this.cards = [];
    this.cardCount = 0;
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.initializeCards();

    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  deleteCard(socket, cardNumber) {
    if (this.players[socket.id]) {
      // In the future, this will remove a specific card for a player
      // this.players[socket.id].removeCard(cardNumber);
      this.players[socket.id].removeAllCards();
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    // const bulletsToRemove = [];
    // this.bullets.forEach(bullet => {
    //   if (bullet.update(dt)) {
        // Destroy this bullet
    //     bulletsToRemove.push(bullet);
    //   }
    // });
    // this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      // if (newBullet) {
      //   this.bullets.push(newBullet);
      // }
    });

    // Apply collisions, give players score for hitting bullets
    // const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    // destroyedBullets.forEach(b => {
    //   if (this.players[b.parentID]) {
    //     this.players[b.parentID].onDealtDamage();
    //   }
    // });
    // this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    const destroyedCards = applyCardCollisions(Object.values(this.players), this.cards);
    const destroyedPlayers = applyPlayerCollisions(Object.values(this.players));
    this.cards = this.cards.filter(card => !destroyedCards.includes(card));
    destroyedCards.forEach(card => {
      this.createCard(this.cardCount)
      this.cardCount += 1;
    })


    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.eats - p1.eats)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score), eats: Math.round(p.eats) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    // const nearbyBullets = this.bullets.filter(
    //   b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    // );
    const nearbyCards = this.cards.filter(
      c => c.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      // bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      cards: nearbyCards.map(c => c.serializeForUpdate()),
      leaderboard,
    };
  }

  initializeCards() {
    for (let count = 0; count < Constants.DISPLAYED_CARDS; count++) {
      this.createCard(count);
    }
    this.cardCount = Constants.DISPLAYED_CARDS;
  }

  createCard(count) {
    this.cards.push(
      new Card(
        Math.floor(Math.random() * Constants.MAP_SIZE), 
        Math.floor(Math.random() * Constants.MAP_SIZE), 
        count
      )
    )
  }
}

module.exports = Game;
