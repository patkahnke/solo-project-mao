function Table(tableID) {
  this.cardsOnTable = [];
  this.players = [];
  this.playerLimit = 3;
}

// Table.prototype.tableAvailable = function (socket, table, gameplay, players, player) {
//   if (players.length < table.playerLimit) {
//     players.push(player);
//     console.log('player added to table: number of players:', players.length);
//   } else {
//     io.to(player).emit('chat message', 'Sorry - the table is full');
//     console.log('player could not be added - table full');
//     return;
//   };
// 
//   if (players.length == table.playerLimit) {
//     var tableReady = true;
//     console.log('table ready: number of players:', players.length);
//     gameplay.setupTable(deck, table, gameplay, io, players);
//   };
// };

Table.prototype.setupTable = function (deck, table, gameplay, io, players) {
    var startCard = gameplay.setUpStartTargetCard(deck, table, gameplay);
    for (var i = 0; i < players.length; i++) {
      players[i].hand = gameplay.dealCards(deck, players[i].maxCards, players[i].hand);
      io.to(players[i].id).emit('getPlayerIndex', { playerIndex: i });
    };

    io.emit('play', { players: players, targetCard: startCard });
  };

Table.prototype.seatNewPlayers = function (socket, table, players, data, gameplay, deck, io, player) {
    console.log('player', player);
    player.logNewPlayer(socket, player, data);
    table.tableAvailable(socket, table, players, player, gameplay, deck, io);
  };

Table.prototype.tableAvailable = function (socket, table, players, player, game, deck, io) {
        if (players.length < table.playerLimit - 1) {
          players.push(player);
          io.to(player.id).emit('mao good message', 'Mao: Welcome ' + player.nickname +
        '! Waiting for more players.');
        } else if (players.length < table.playerLimit) {
          player.turn = true;
          players.push(player);
          io.emit('mao good message', 'Mao: Your table is ready: ' + player.nickname + ' goes first!');
          table.setupTable(deck, table, game, io, players);
        } else {
          io.to(player.id).emit('mao bad message', 'Mao: Sorry, ' + player.nickname + ' - the table is full');
          return;
        };
      };

module.exports = Table;
