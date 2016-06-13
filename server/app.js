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
var player = {};
var directionLeft = true;
var directionChangeCount = game.randomNumber(5, 12);
var playCount = 0;

//socket.io functions
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('playerLoggedIn', function (data) {
    var player = new Player(socket.id);
    game.seatNewPlayers(socket, table, players, data, game, deck, io, player);
  });

  socket.on('playCard', function (data) {
    players = data.players;
    var playerIndex = data.playerIndex;
    var playerLeftIndex = data.playerLeftIndex;
    var playerRightIndex = data.playerRightIndex;
    targetCard = game.currentTargetCard(table)[0];
    card = data.playedCard;
    legal = game.isCardLegal(card, targetCard);
    playCount++;
    console.log('direction change count: ', directionChangeCount);
    console.log('playCount', playCount);
    console.log('directionLeft ', directionLeft);
    directionLeft = game.controlDirection(game, playCount, directionChangeCount, directionLeft);
    if (players[playerIndex].turn) {
      if (legal == true) {
        players[playerIndex].hand = game.playCard(data.index, players[playerIndex].hand, table);
        targetCard = game.currentTargetCard(table)[0];
        console.log('card is legal');
        players[playerIndex].turn = false;
        if (directionLeft) {
          players[playerLeftIndex].turn = true;
        } else {
          players[playerRightIndex].turn = true;
        }

        table.players = players;
        io.emit('play', { players: players, targetCard: targetCard });
      } else {
        players[playerIndex].hand = game.dealCards(deck, 1, players[playerIndex].hand);
        players[playerIndex].turn = false;
        players[data.playerLeftIndex].turn = true;
        table.players = players;
        console.log('card is not legal');
        io.emit('play', { players: players, targetCard: targetCard });
        console.log(players[playerIndex].nickname + ' played out of turn!');
      };
    } else {
      players[playerIndex].hand = game.dealCards(deck, 1, players[playerIndex].hand);
      table.players = players;
      console.log(players[playerIndex].nickname + ' played out of turn!');
      io.emit('play', { players: players, targetCard: targetCard });
    };
  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

});

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
