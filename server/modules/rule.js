var Utility = require('./utility');
var utility = new Utility();

function Rule() {

  this.suitsSameColor = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (targetCardSuit === 'H' && cardSuit === 'D') {
      return true;
    } else if (targetCardSuit === 'D' && cardSuit === 'H') {
      return true;
    } else if (targetCardSuit === 'C' && cardSuit === 'S') {
      return true;
    } else if (targetCardSuit === 'S' && cardSuit === 'C') {
      return true;
    } else {
      return false;
    }
  };

  this.suitsMatch = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (cardSuit === targetCardSuit) {
      return true;
    } else {
      return false;
    }
  };

};

Rule.prototype.numbersMatch = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
  if (cardNumber === targetCardNumber) {
    return true;
  } else {
    return false;
  }
};

Rule.prototype.stringNumbers = function (playedCard, targetCard) {
  var cardNumber = parseInt(playedCard);
  var targetCardNumber = parseInt(targetCard);
  if (cardNumber == 13) {
    if (targetCardNumber == 1 || targetCardNumber == 12) {
      return true;
    } else {
      return false;
    }
  } else if (cardNumber == 1) {
    if (targetCardNumber == 2 || targetCardNumber == 13) {
      return true;
    } else {
      return false;
    }
  } else if ((cardNumber + 1) == targetCardNumber || (cardNumber - 1) == targetCardNumber) {
    return true;
  } else {
    return false;
  }
};

function selectRandomRules(array1, array2) {
  randomRule = array1[utility.randomNumber(0, array1.length - 1)];
  array2.push(randomRule);
  return array2;
}

module.exports = Rule;
