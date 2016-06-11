//dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// modules
var playersDB = require('./routes/players');
var index = require('./routes/index');
var Game = require('./modules/game');
var Table = require('./modules/table');
var Player = require('./modules/player');
var Messaging = require('./modules/messaging');

//global game setup variables
var messaging = new Messaging();
var table = new Table();
var game = new Game();
var deck = game.deck;
var playerLimit = table.playerLimit;
var tableReady = false;
var cardsOnTable = table.cardsOnTable;
var players = table.players;
var targetCard = [];

//socket.io functions
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('playerLoggedIn', function (data) {
    var player = new Player(socket.id);
    player.nickname = data.nickname;
    console.log(player.nickname);

    //turn this into a Table prototype(tableAvailable) function later
    //refactor this so it instantiates a new Table once the table is full
    if (players.length < playerLimit) {
      players.push(player);
      console.log('player added to table: number of players:', players.length);
    } else {
      //io.to(player).emit('chat message', 'Sorry - the table is full');
      console.log('player could not be added - table full');
      return;
    };

    if (players.length == playerLimit) {
      tableReady = true;
      console.log('table ready: number of players:', players.length);
      game.setupTable(deck, table, game, io, players);
    };
  });

  socket.on('playCard', function (data) {
    targetCard = game.currentTargetCard(table)[0];
    console.log('target card', game.currentTargetCard(table)[0]);
    card = data.playedCard;
    legal = game.isCardLegal(card, targetCard);
    if (legal == true) {
      console.log('card is legal');
    } else {
      console.log('card is not legal');
    };
  });

});

// function setupTable() {
//   if (tableReady == true) {
//     var startCard = game.setUpStartTargetCard(deck, table);
//     messaging.sendEventToAllPlayers('setUp', startCard, io, players);
//     for (var i = 0; i < players.length; i++) {
//       players[i].hand = game.dealCards(deck, 5, players[i].hand);
//       io.to(players[i].id).emit('play', { playerIndex: i, players: players });
//     };
//   };
// }

// middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express routes
app.use('/players', playersDB);
app.use('/', index);

// mongoose connection
var databaseURI = 'mongodb://localhost:27017/mao';

mongoose.connect(databaseURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open ', databaseURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose error connecting ', err);
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
