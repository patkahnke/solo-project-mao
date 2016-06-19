function Player(playerID) {
  this.id = playerID;
  this.nickname = '';
  this.hand = [];
  this.turn = false;
  this.maxCards = 5;
  this.stringScore = 0;
  this.cardScore = 0;
  this.cardPenalty = 0;
  this.bonusMultiplier = 0;
  this.placeMultiplier = 0;
}

Player.prototype.logNewPlayer = function (socket, player, data) {
    player.nickname = data.nickname;
    return player;
  };

module.exports = Player;
