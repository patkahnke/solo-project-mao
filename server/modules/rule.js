var Utility = require('./utility');
var utility = new Utility();

function Rule() {

  this.suitsSameColorOtherSuit = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
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
    };
  };

  this.suitsOppositeColor = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (targetCardSuit === 'H' && (cardSuit === 'S' || cardSuit === 'C')) {
      return true;
    } else if (targetCardSuit === 'D' && (cardSuit === 'S' || cardSuit === 'C')) {
      return true;
    } else if (targetCardSuit === 'C' && (cardSuit === 'D' || cardSuit === 'H')) {
      return true;
    } else if (targetCardSuit === 'S' && (cardSuit === 'D' || cardSuit === 'H')) {
      return true;
    } else {
      return false;
    };
  };

  this.suitsSameColor = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (targetCardSuit === 'H' && (cardSuit === 'D' || cardSuit === 'H')) {
      return true;
    } else if (targetCardSuit === 'D' && (cardSuit === 'D' || cardSuit === 'H')) {
      return true;
    } else if (targetCardSuit === 'C' && (cardSuit === 'S' || cardSuit === 'C')) {
      return true;
    } else if (targetCardSuit === 'S' && (cardSuit === 'S' || cardSuit === 'C')) {
      return true;
    } else {
      return false;
    };
  };

  this.suitsMatch = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (cardSuit === targetCardSuit) {
      return true;
    } else {
      return false;
    };
  };

  this.numbersMatch = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (cardNumber === targetCardNumber) {
      return true;
    } else {
      return false;
    };
  };

  this.numbersOddEven = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (cardNumber % 2 == 0 && targetCardNumber % 2 == 0) {
      return true;
    } else if (cardNumber % 2 == 1 && targetCardNumber % 2 == 1) {
      return true;
    } else {
      return false;
    };
  };

  this.numbersPlusOrMinusTwo = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
    if (cardNumber == (targetCardNumber + 2) || cardNumber == (targetCardNumber - 2)) {
      return true;
    } else {
      return false;
    };
  };

  this.turnRandomNumber = function (directionChangeCount) {
    return directionChangeCount = utility.randomNumber(5, 12);
  };

  this.turnAscending = function (directionChangeCount) {
    return directionChangeCount++;
  };

  this.stringNumbers = function (playedCard, targetCard) {
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

};

module.exports = Rule;
