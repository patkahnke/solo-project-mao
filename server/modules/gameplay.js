//modules
var Utility = require('./utility');

//game play variables
var utility = new Utility();
var tableReady = false;
var targetCard = [];
var directionLeft = true;
var directionChangeCount = utility.randomNumber(5, 12);
var playCount = 1;
var stringRule = undefined;
var numberRule = undefined;
var stringRule = undefined;

function Gameplay() {};

//deal a specified number of cards from the pack of cards,
Gameplay.prototype.dealCards = function (deck, numberOfCards, hand) {
  for (var i = 0; i < numberOfCards; i++) {
    hand.push(deck.shift());
  }

  return hand;
};

//play a specific card, chosen from the hand, onto the table
Gameplay.prototype.playCard = function (index, hand, table) {
  var playedCard = hand.splice(index, 1);
  table.cardsOnTable.push(playedCard);
  return hand;
};

//player who gets rid of all cards first wins
Gameplay.prototype.lastCard = function (hand) {
  if (hand.length == 0) {
    return true;
  } else {
    return false;
  }
};

Gameplay.prototype.endGame = function (players, io) {
  io.emit('game over', players);
};

//select the first card from the deck as the beginning "play" card
Gameplay.prototype.setUpStartTargetCard = function (deck, table) {
  var startTargetCard = deck.splice(0, 1);
  table.cardsOnTable.push(startTargetCard);
  return startTargetCard[0];
};

//find the current "play" card in the center of the table
Gameplay.prototype.currentTargetCard = function (table) {
  var targetCard = table.cardsOnTable[table.cardsOnTable.length - 1];
  return targetCard;
};

// Game.prototype.getRules = function (rule1, rule2) {
//   rules = { rule1: rule1, rule2: rule2 };
//   return rules;
// };

//check to see if a selected card in the hand is legal to play
Gameplay.prototype.isCardLegal = function (card, targetCard, rule) {
    var targetCard = targetCard;
    var cardNumber = parseInt(card);
    var cardSuit = card.charAt(card.length - 1);
    var targetCardNumber = parseInt(targetCard);
    var targetCardSuit = targetCard.charAt(targetCard.length - 1);
    var isLegal = false;
    suitRule = rule.suitsMatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit);
    numberRule = rule.numbersMatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit);
    if (suitRule || numberRule) {
      isLegal = true;
    };

    return isLegal;
  };

Gameplay.prototype.controlDirection = function (game, playCount, directionChangeCount, directionLeft) {
    if (playCount % directionChangeCount == 0) {
      directionLeft = !directionLeft;
    }

    return directionLeft;
  };

Gameplay.prototype.stageCard = function (data, gameplay, table, rule, game, deck, io) {
  players = data.players;
  targetCard = gameplay.currentTargetCard(table)[0];
  stringRule = rule.stringNumbers(cardNumber, cardSuit, targetCardNumber, targetCardSuit);
  legal = gameplay.isCardLegal(data.playedCard, targetCard, rule);
  if (players[data.playerIndex].turn) {
    if (stringRule) {
      io.emit('stage string card', { players: players, targetCard: targetCard });
    } else if (legal) {
      io.emit
    }

    if (legal) {
      players[data.playerIndex].hand = gameplay.playCard(data.index, players[data.playerIndex].hand, table);
      targetCard = gameplay.currentTargetCard(table)[0];
      console.log('card is legal');
      players[data.playerIndex].turn = false;
      var lastCard = gameplay.lastCard(players[data.playerIndex].hand);
      playCount++;
      directionLeft = gameplay.controlDirection(game, playCount, directionChangeCount, directionLeft);
      assignTurn(directionLeft, players, data);
      if (lastCard) {
        gameplay.endGame(players, io);
        return;
      }

      //table.players = players;
      io.emit('play', { players: players, targetCard: targetCard });
    } else {
      players[data.playerIndex].hand = gameplay.dealCards(deck, 1, players[data.playerIndex].hand);
      players[data.playerIndex].turn = false;
      playCount++;
      directionLeft = gameplay.controlDirection(game, playCount, directionChangeCount, directionLeft);
      assignTurn(directionLeft, players, data);
      console.log('playcount:', playCount, 'direction change count:', directionChangeCount, 'direction left:', directionLeft);
      //table.players = players;
      console.log('card is not legal');
      io.emit('mao bad card message', 'Mao: ' + players[data.playerIndex].nickname +
    ' played an illegal card!');
      io.emit('play', { players: players, targetCard: targetCard });
    };
  } else {
    players[data.playerIndex].hand = gameplay.dealCards(deck, 1, players[data.playerIndex].hand);
    //table.players = players;
    console.log(players[data.playerIndex].nickname + ' played out of turn!');
    io.emit('mao bad turn message', 'Mao: ' + players[data.playerIndex].nickname +
  ' played out of turn!');
    io.emit('play', { players: players, targetCard: targetCard });
  };
};

function assignTurn(directionLeft, players, data) {
  if (directionLeft) {
    players[data.playerLeftIndex].turn = true;
    console.log('turn: ', players[data.playerLeftIndex]);
  } else {
    players[data.playerRightIndex].turn = true;
    console.log('turn: ', players[data.playerRightIndex]);
  }
}

module.exports = Gameplay;
