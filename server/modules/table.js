var Game = require('./game');

function Table(tableID) {
  this.cardsOnTable = [];
  this.players = [];
  this.playerLimit = 3;
}

module.exports = Table;
