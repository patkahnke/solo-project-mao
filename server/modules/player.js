function Player(playerID) {
  this.id = playerID;
  this.nickname = '';
  this.hand = [];
  this.turn = false;
  this.maxCards = 5;
}

Player.prototype.logNewPlayer = function (socket, player, data) {
    player.nickname = data.nickname;
    return player;
  };

module.exports = Player;
