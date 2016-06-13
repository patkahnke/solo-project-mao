// var Utilities = require('./utilities');
// var utilities = new Utilities();
//var Player = require('./player');

function Game() {
  this.deck = this.shuffle(this.createDeck());
}

//create a new deck of cards - totalDecks takes in a number of 52-card decks
Game.prototype.createDeck = function () {
  var suits = ['H', 'C', 'S', 'D'];
  var deck = [];
  var n = 52;
  var index = n / suits.length;
  var deckCount = 0;
  for (i = 0; i <= 3; i++) {
    for (j = 1; j <= index; j++) {
      deck[deckCount++] = j + suits[i];
    }
  }

  finalDeck = deck.concat(deck);
  return finalDeck;
};

//Fischer-Yates shuffle algorithm
Game.prototype.shuffle = function (deck) {
    var i = deck.length;
    var j = 0;
    var tempi = 0;
    var tempj = 0;
    if (i === 0) return false;
    while (--i) {
      j = Math.floor(Math.random() * (i + 1));
      tempi = deck[i]; tempj = deck[j]; deck[i] = tempj; deck[j] = tempi;
    }

    return deck;
  };

//deal a specified number of cards from the pack of cards,
Game.prototype.dealCards = function (deck, numberOfCards, hand) {
  for (var i = 0; i < numberOfCards; i++) {
    hand.push(deck.shift());
  }

  return hand;
};

//play a specific card, chosen from the hand, onto the table
Game.prototype.playCard = function (index, hand, table) {
  var playedCard = hand.splice(index, 1);
  table.cardsOnTable.push(playedCard);
  return hand;
};

//player who gets rid of all cards first wins
Game.prototype.winningHand = function (hand) {
  if (hand.length == 0) {
    return true;
  } else {
    return false;
  }
};

//select the first card from the deck as the beginning "play" card
Game.prototype.setUpStartTargetCard = function (deck, table) {
  var startTargetCard = deck.splice(0, 1);
  table.cardsOnTable.push(startTargetCard);
  return startTargetCard[0];
};

//find the current "play" card in the center of the table
Game.prototype.currentTargetCard = function (table) {
  var targetCard = table.cardsOnTable[table.cardsOnTable.length - 1];
  return targetCard;
};

//check to see if a selected card in the hand is legal to play
Game.prototype.isCardLegal = function (card, targetCard) {
    var targetCard = targetCard;
    var cardNumber = parseInt(card);
    var cardSuit = card.charAt(card.length - 1);
    var targetCardNumber = parseInt(targetCard);
    var targetCardSuit = targetCard.charAt(targetCard.length - 1);
    if (cardNumber === targetCardNumber || cardSuit === targetCardSuit) {
      return true;
    } else {
      return false;
    }
  };

Game.prototype.setupTable = function (deck, table, game, io, players) {
    var startCard = game.setUpStartTargetCard(deck, table, game);
    for (var i = 0; i < players.length; i++) {
      players[i].hand = game.dealCards(deck, 5, players[i].hand);
      io.to(players[i].id).emit('getPlayerIndex', { playerIndex: i });
    };

    io.emit('play', { players: players, targetCard: startCard });
  };

Game.prototype.seatNewPlayers = function (socket, table, players, data, game, deck, io, player) {
  console.log('player', player);
  game.logNewPlayer(socket, player, data);
  game.tableAvailable(socket, table, players, player, game, deck, io);
};

Game.prototype.tableAvailable = function (socket, table, players, player, game, deck, io) {
      if (players.length < table.playerLimit - 1) {
        players.push(player);
        io.to(player.id).emit('chat message', 'Mao: Welcome ' + player.nickname +
      '! Waiting for more players.');
      } else if (players.length < table.playerLimit) {
        player.turn = true;
        players.push(player);
        io.emit('chat message', 'Mao: Your table is ready: ' + player.nickname + ' goes first!');
        game.setupTable(deck, table, game, io, players);
      } else {
        io.to(player.id).emit('chat message', 'Mao: Sorry, ' + player.nickname + ' - the table is full');
        return;
      };
    };

Game.prototype.randomNumber = function (min, max) {
    return Math.floor(Math.random() * (1 + max - min) + min);
  };

Game.prototype.controlDirection = function (game, playCount, directionChangeCount, directionLeft) {
    if (playCount % directionChangeCount == 0) {
      directionLeft = !directionLeft;
    }

    return directionLeft;
  };

Game.prototype.logNewPlayer = function (socket, player, data) {
    player.nickname = data.nickname;
    return player;
  };

module.exports = Game;
