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

  // Game.prototype.isCardLegal = function (card, targetCard) {
  //     var targetCard = targetCard;
  //     var cardNumber = parseInt(card);
  //     var cardSuit = card.charAt(card.length - 1);
  //     var targetCardNumber = parseInt(targetCard);
  //     var targetCardSuit = targetCard.charAt(targetCard.length - 1);
  //     if (cardNumber === targetCardNumber || cardSuit === targetCardSuit) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };

module.exports = Game;
