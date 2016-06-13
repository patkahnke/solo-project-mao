var Game = require('./game');

function Table(tableID) {
  this.cardsOnTable = [];
  this.players = [];
  this.playerLimit = 3;
}

Table.prototype.tableAvailable = function (socket, table, players, player) {
  if (players.length < table.playerLimit) {
    players.push(player);
    console.log('player added to table: number of players:', players.length);
  } else {
    io.to(player).emit('chat message', 'Sorry - the table is full');
    console.log('player could not be added - table full');
    return;
  };

  if (players.length == table.playerLimit) {
    var tableReady = true;
    console.log('table ready: number of players:', players.length);
    game.setupTable(deck, table, game, io, players);
  };
}
module.exports = Table;
