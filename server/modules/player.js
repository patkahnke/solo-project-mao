function Player(playerID) {
  this.id = playerID;
  this.nickname = '';
  this.hand = [];
  this.turn = false;
  this.maxCards = 5;
}

module.exports = Player;
