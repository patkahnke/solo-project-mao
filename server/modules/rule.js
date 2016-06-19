var Utility = require('./utility');
var utility = new Utility();

function Rule() {
};

Rule.prototype.getRules = function (rule) {
  var numberRules = [rule.numbersmatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit)];
  var suitRules = [rule.suitsMatch(cardNumber, cardSuit, targetCardNumber, targetCardSuit)];
  var stringRules = [];
  var interactRules = [];
  var turnRules = [];
  var activeRules = [];
  var allRules = [numberRules, suitRules, stringRules, interactRules, turnRules];
  for (var i = 0; i < allRules.length; i++) {
    activeRules = selectRandomRules(allRules[i], activeRules);
  }

  return activeRules;
};

Rule.prototype.suitsMatch = function (cardNumber, cardSuit, targetCardNumber, targetCardSuit) {
  if (cardSuit === targetCardSuit) {
    return true;
  } else {
    return false;
  }
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
