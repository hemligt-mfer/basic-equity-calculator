import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DECK, SUIT_COLORS, SELECTED_COMMUNITY_CARD } from './constants.js';
import { CardGroup, OddsCalculator } from 'poker-odds-calculator';
import './index.css';

let playerCount = 2;
let activeFieldForPlayerHand = null;
let activeCommunityCard = null;
let cardsInUse = [];

document.addEventListener('click', checkClick);

// If a community card is marked and the user clicks somewhere else, reset the background color
// for that card, so it is unmarked.
function checkClick(e) {
    const card_classes = ['c', 'd', 'h', 's'];
    if (
        activeCommunityCard &&
        e.target.className != 'community_card' &&
        !card_classes.includes(e.target.className)
    ) {
        document.getElementById(activeCommunityCard).style.backgroundColor = '';
        activeCommunityCard = null;
    }
}

// Make a table of all cards. Give the <td> element class names "s", "h", "d" and "c"
// representing spades, hearts, diamonds, clubs.
function AllCards() {
    const cards = DECK;
    let card_lists = [];
    for (let i = 0; i < cards.length; i += 4) {
        card_lists.push(cards.slice(i, i + 4));
    }
    return (
        <>
            <table id='all_cards'>
                {/*<thead>Cards</thead>*/}
                <tbody>
                    {card_lists.map((row) => {
                        return (
                            <tr>
                                {row.map((hand) => {
                                    {
                                        return (
                                            <td
                                                key={hand[1]}
                                                className={hand[1]}
                                                onClick={clickCard}
                                            >
                                                {hand}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

// Function for when the user clicks on a card from the table to the left
function clickCard(e) {
    // If a input field is active and if the card is not already in use and if the player doesn't
    // already have two cards, add that card to the input field.
    if (activeFieldForPlayerHand) {
        const hand = e.target.innerHTML;
        let text_field = document.getElementById(activeFieldForPlayerHand);
        if (text_field.value.length < 4 && !isInUse(hand)) {
            text_field.value += hand;
            cardsInUse.push(hand);
        }
    }

    // If a community card is active, add the card to the selected community card.
    if (activeCommunityCard) {
        const hand = e.target.innerHTML;
        const communityCardSelected = document.getElementById(activeCommunityCard);
        if (!isInUse(hand)) {
            communityCardSelected.innerHTML = hand;
            cardsInUse.push(hand);

            // Add color to the community card for the different suits
            if (hand[1] == 'c') {
                communityCardSelected.style.color = SUIT_COLORS.clubs;
            } else if (hand[1] == 'd') {
                communityCardSelected.style.color = SUIT_COLORS.diamonds;
            } else if (hand[1] == 'h') {
                communityCardSelected.style.color = SUIT_COLORS.hearts;
            } else if (hand[1] == 's') {
                communityCardSelected.style.color = SUIT_COLORS.spades;
            }

            // Move focus to the next community card
            let id = Number(communityCardSelected.id[2]);
            if (id < 5) {
                id++;
                document.getElementById(activeCommunityCard).style.backgroundColor = '';
                activeCommunityCard = document.getElementById('cc' + id).id;
                document.getElementById(activeCommunityCard).style.backgroundColor =
                    SELECTED_COMMUNITY_CARD;
            }
        }
    }
}

function isInUse(card) {
    for (let i = 0; i < cardsInUse.length; i++) {
        if (card == cardsInUse[i]) {
            return true;
        }
    }
    return false;
}

// Generates the community cards
function CommunityCards() {
    function clickCommunityCard(e) {
        if (activeCommunityCard) {
            document.getElementById(activeCommunityCard).style.backgroundColor = '';
        }
        activeCommunityCard = e.target.id;
        document.getElementById(activeCommunityCard).style.backgroundColor =
            SELECTED_COMMUNITY_CARD;
        activeFieldForPlayerHand = null;
    }

    return (
        <>
            <h2>Community cards</h2>
            <table id='board'>
                <tbody>
                    <tr>
                        <td id='cc1' className='community_card' onClick={clickCommunityCard}>
                            ?
                        </td>
                        <td id='cc2' className='community_card' onClick={clickCommunityCard}>
                            ?
                        </td>
                        <td id='cc3' className='community_card' onClick={clickCommunityCard}>
                            ?
                        </td>
                        <td id='cc4' className='community_card' onClick={clickCommunityCard}>
                            ?
                        </td>
                        <td id='cc5' className='community_card' onClick={clickCommunityCard}>
                            ?
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

function textFieldOnFocus(e) {
    activeFieldForPlayerHand = e.target.id;
    activeCommunityCard = null;
}

// Generate the players' text fields: which hand they have and how much equity that hand has
function Players() {
    return (
        <>
            <table id='players' width='100%'>
                <thead>
                    <tr>
                        <th id='player_column'></th>
                        <th id='hand_column'>Hand</th>
                        <th id='equity_columnn'>Equity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id='player1' className='player'>
                        <td>
                            <label for='player1'>Player 1:</label>
                        </td>
                        <td>
                            <input
                                type='text'
                                name='hand1'
                                id='hand1'
                                onFocus={textFieldOnFocus}
                                className='player_hand'
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                type='text'
                                name='equity1'
                                id='equity1'
                                className='equity'
                                readOnly
                            ></input>
                        </td>
                    </tr>
                    <tr id='player2' className='player'>
                        <td>
                            <label for='player2'>Player 2:</label>
                        </td>
                        <td>
                            <input
                                type='text'
                                name='hand2'
                                id='hand2'
                                onFocus={textFieldOnFocus}
                                className='player_hand'
                                readOnly
                            />
                        </td>
                        <td>
                            <input
                                type='text'
                                name='equity2'
                                id='equity2'
                                className='equity'
                                readOnly
                            ></input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

// TODO: Break upp all the buttons to single components, so we can use <Suspense> for Calculate

function AddPlayerButton() {
    function add_player() {
        if (playerCount <= 9) {
            playerCount++;
            const tableOfPlayers = document.getElementById('players');
            let row = tableOfPlayers.insertRow(playerCount);
            row.className = 'player';
            row.id = 'player' + playerCount;
            row.insertCell(0).innerHTML =
                `<label for="player${playerCount}">Player ${playerCount}:</label>`;
            row.insertCell(1).innerHTML =
                `<input type="text" name="hand${playerCount}" id="hand${playerCount}" className="player_hand" readonly />`;
            row.insertCell(2).innerHTML =
                `<input type="text" name="equity${playerCount}" id="equity${playerCount}" className="equity" readonly />`;
            document
                .getElementById('hand' + playerCount)
                .addEventListener('focus', textFieldOnFocus);
        }
    }

    return (
        <button type='button' onClick={add_player}>
            Add player
        </button>
    );
}

function CalculateButton() {
    function showErrMessage(text) {
        const messageBox = document.getElementById('message');
        messageBox.style.visibility = 'visible';
        messageBox.style.color = 'red';
        messageBox.style.border = '1px red solid';
        messageBox.innerHTML = text;
    }

    function calculate() {
        if (document.getElementById('message').style.visibility == 'visible') {
            document.getElementById('message').style.visibility = 'hidden';
        }

        // First make sure that all input is correct
        const handInputs = document.getElementsByClassName('player_hand');
        const handsInStr = [];
        for (let i = 0; i < handInputs.length; i++) {
            if (handInputs[i].value.length < 4) {
                //handInputs[i].style.backgroundColor = "red";
                showErrMessage('You must specify two cards for every player!');
                return;
            }
            handsInStr.push(handInputs[i].value);
        }

        // Convert the hands into object CardGroup from poker-odds-calculartor
        const hands = [];
        for (let i = 0; i < handsInStr.length; i++) {
            hands.push(CardGroup.fromString(handsInStr[i]));
        }

        let board_str = '';
        let community_cards = document.getElementsByClassName('community_card');
        for (let i = 0; i < community_cards.length; i++) {
            if (community_cards[i].innerText != '?') {
                board_str += community_cards[i].innerText;
            }
        }
        if (board_str.length != 0 && board_str.length < 6) {
            showErrMessage('Must specify at least three community cards or zero.');
            return;
        }

        if (board_str.length >= 6) {
            // Make sure the community cards are specified in the correct order
            if (
                community_cards[0].innerText == '?' ||
                community_cards[1].innerText == '?' ||
                community_cards[2].innerText == '?'
            ) {
                showErrMessage(`The community cards aren't in the correct order.`);
                return;
            }
            const board = CardGroup.fromString(board_str);
            const result = OddsCalculator.calculate(hands, board);
            for (let i = 0; i < result.equities.length; i++) {
                document.getElementById('equity' + (i + 1)).value =
                    result.equities[i].toString() + '%';
            }

            // TODO: Give the input field with the highest equity a green color?
        } else if (board_str == '') {
            const result = OddsCalculator.calculate(hands);
            for (let i = 0; i < result.equities.length; i++) {
                document.getElementById('equity' + (i + 1)).value =
                    result.equities[i].toString() + '%';
            }
        }
    }

    return (
        <button type='submit' onClick={calculate}>
            Calculate
        </button>
    );
}

function ClearButton() {
    function clear() {
        // Remove all players except for two
        if (playerCount > 2) {
            let inputs = document.getElementsByClassName('player');
            //log(inputs.length);
            for (let i = inputs.length - 1; i >= 2; i--) {
                inputs[i].remove();
            }
            playerCount = 2;
        }
        document.getElementById('hand1').value = '';
        document.getElementById('hand1').style.backgroundColor = '';
        document.getElementById('hand2').value = '';
        document.getElementById('hand2').style.backgroundColor = '';
        document.getElementById('equity1').value = '';
        document.getElementById('equity2').value = '';

        // Reset community cards
        const cc = document.getElementsByClassName('community_card');
        for (let i = 0; i < cc.length; i++) {
            cc[i].innerHTML = '?';
            cc[i].style.color = '#000000';
            cc[i].style.backgroundColor = '';
        }
        cardsInUse = [];

        activeCommunityCard = null;
        activeFieldForPlayerHand = null;
    }

    return (
        <button type='reset' onClick={clear}>
            Clear
        </button>
    );
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <div id='left_column'>
            <AllCards />
        </div>
        <div id='right_column'>
            <CommunityCards />
            <Players />
            <div id='buttons'>
                <AddPlayerButton />
                <CalculateButton />
                <ClearButton />
            </div>
            <div id='message'></div>
        </div>
    </StrictMode>,
);
