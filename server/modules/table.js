var Game = require('./game');
var tableCount = 1;
var tables = [];
var tableHolder = new Table(1);
var playersHolder = [];

function Table(tableCount) {
  this.cardsOnTable = [];
  this.players = [];
  this.playerLimit = 3;
  this.tableID = 'table' + tableCount;
  this.full = false;

  this.newPlayer = function (tableData, socket, playersData, data, deck,
      player, sessionVariables) {
    tableData = tableHolder;
    var table = tableData;
    playersData = playersHolder;
    var players = playersData;
    if (table.full) {
      tableCount++;
      table = new Table(tableCount);
      game = new Game();
      players = table.players;
      tables.push(tableCount);
      tableData = table;
      sessionVariables.game = game;
      tableHolder = tableData;
      playersHolder = players;
    };

    seatNewPlayers(table, socket, players, data, deck, player, sessionVariables);
  };
};

Table.prototype.setupTable = function (tableData, socket, deck, players, sessionVariables) {
    var table = tableData;
    var gameplay = sessionVariables.gameplay;
    var io = sessionVariables.io;
    var targetCard = gameplay.setUpTargetCard(table, deck, sessionVariables);
    var stringArray = [];
    for (var i = 0; i < players.length; i++) {
      players[i].hand = gameplay.dealCards(deck, players[i].startHand, players[i].hand, 10);
      io.to(players[i].id).emit('get player index', { playerIndex: i, tableID: table.tableID });
    };

    console.log('tableID inside setUpTable', table.tableID);
    io.in(table.tableID).emit('play', { targetCard: targetCard, players: players, stringArray: stringArray, table: table });
  };

Table.prototype.tableAvailable = function (tableData, socket, players, player, deck, sessionVariables) {
        var io = sessionVariables.io;
        var table = tableData;
        socket.join(table.tableID);
        if (players.length < table.playerLimit - 1) {
          players.push(player);
          io.to(player.id).emit('mao good message', 'Mao: Welcome ' + player.nickname +
        '! Waiting for more players.');
        } else if (players.length < table.playerLimit) {
          player.turn = true;
          players.push(player);
          io.in(table.tableID).emit('mao good message', 'Mao: Your table is ready: '
          + player.nickname + ' goes first!');
          table.setupTable(table, socket, deck, players, sessionVariables);
          table.full = true;
        } else {
          console.log('something did not work creating new table');
        };
      };

function seatNewPlayers(tableData, socket, players, data, deck, player, sessionVariables) {
  var table = tableData;
  player.logNewPlayer(socket, player, data);
  table.tableAvailable(table, socket, players, player, deck, sessionVariables);
}

module.exports = Table;
