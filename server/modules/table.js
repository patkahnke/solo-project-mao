function Table(tableID) {
  this.cardsOnTable = [];
  this.players = [];
  this.playerLimit = 3;
  this.id = '';
  this.full = false;
}

Table.prototype.setupTable = function (deck, players, prototypeVariables) {
    var gameplay = prototypeVariables.gameplay;
    var io = prototypeVariables.io;
    var targetCard = gameplay.setUpTargetCard(deck, prototypeVariables);
    var stringArray = [];
    for (var i = 0; i < players.length; i++) {
      players[i].hand = gameplay.dealCards(deck, players[i].maxCards, players[i].hand);
      io.to(players[i].id).emit('get player index', { playerIndex: i });
    };

    io.emit('play', { targetCard: targetCard, players: players, stringArray: stringArray });
  };

Table.prototype.seatNewPlayers = function (socket, players, data, deck, player, prototypeVariables) {
    table = prototypeVariables.table;
    player.logNewPlayer(socket, player, data);
    table.tableAvailable(socket, players, player, deck, prototypeVariables);
  };

Table.prototype.tableAvailable = function (socket, players, player, deck, prototypeVariables) {
        var io = prototypeVariables.io;
        var table = prototypeVariables.table;
        if (players.length < table.playerLimit - 1) {
          players.push(player);
          io.to(player.id).emit('mao good message', 'Mao: Welcome ' + player.nickname +
        '! Waiting for more players.');
        } else if (players.length < table.playerLimit) {
          player.turn = true;
          players.push(player);
          io.to(table.id)emit('mao good message', 'Mao: Your table is ready: ' + player.nickname + ' goes first!');
          table.setupTable(deck, players, prototypeVariables);
        } else {
          io.to(player.id).emit('mao bad message', 'Mao: Sorry, ' + player.nickname + ' - the table is full');
          return;
        };
      };

module.exports = Table;
