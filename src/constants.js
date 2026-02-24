// Declare some constants
export const DECK = (() => {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const suits = ['c', 'd', 'h', 's'];
    const deck = [];

    ranks.forEach((rank, rankIndex) => {
        suits.forEach((suit, suitIndex) => {
            deck[rankIndex * 4 + suitIndex] = rank + suit;
        });
    });

    return deck;
})();

// Color options
export const SUIT_COLORS = {
    clubs: '#1dd1a1',
    diamonds: '#54a0ff',
    hearts: '#ee5253',
    spades: '#8395a7',
};

export const SELECTED_COMMUNITY_CARD = '#A9A9A9';
