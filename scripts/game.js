import {
  diceImages,
  numberSixOnTheDice,
  limitToRollTheDiceConsecutively,
  firstPlayerColor,
  secondPlayerColor,
} from "./constants.js";
import { updateHistory, updateLogMessage, history } from "./historyModule.js";
import {
  initializeBoard,
  setQuestionTraps,
  resetQuestionTraps,
  addTraps,
  objectTileElement,
} from "./gameBoard.js";
import Player from "./player.js";
import { fetchDiceNumber, generateDiceNumber } from "./api.js";
import {
  reloadPage,
  addExitGameListener,
  addIconListener,
  addSwitchButtonEventListener,
  addRollDiceButtonEventListener,
} from "./eventListeners.js";

initializeBoard();

/**
 * Represents the main game controller.
 * @class
 */
class Game {
  /**
   * Creates a new Game.
   * @constructor
   * @param {Player} player1 - The first player in the game.
   * @param {Player} player2 - The second player in the game.
   */
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
  }
}

const player1 = new Player(firstPlayerColor);
const player2 = new Player(secondPlayerColor);
const game = new Game(player1, player2);

/**
 * Handles the game's main player objects.
 * @type {Player[]}
 */
export const players = [player1, player2];

const diceImageElement = document.getElementById("diceImage");
const disabledRollDiceButton = document.getElementById("rollDice");
const firstPlayerLabel = document.getElementById("player1Label");
const secondPlayerLabel = document.getElementById("player2Label");
const startButton = document.getElementsByClassName("startGame")[0];
const firstPlayer = document.getElementById("firstPlayer");
const secondPlayer = document.getElementById("secondPlayer");
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const playerNamesContainer = document.getElementsByClassName(
  "player-names-container"
)[0];
const gifContainer = document.getElementById("gif-container");
const formTitle = document.getElementById("form-title");
const formContainerBoxShadow =
  document.getElementsByClassName("form-container")[0];
const playerNamesBoxShadow = document.getElementsByClassName("player-names")[0];

firstPlayerLabel.classList.add("current-player");
addClass(playerNamesContainer, "display_none");
addClass(playerNamesBoxShadow, "display_boxshadow");

addExitGameListener();
addSwitchButtonEventListener();
addIconListener();
addRollDiceButtonEventListener(rollDice);
startButton.addEventListener("click", handleStartButton);

/**
 * Handles the logic for starting the game when the start button is clicked.
 */
function handleStartButton() {
  const namesValidModal = document.getElementById("namesValid");
  const player1Name = player1NameInput.value;
  const player2Name = player2NameInput.value;

  if (player1Name.trim() === "" || player2Name.trim() === "") {
    $(namesValidModal).modal("show");
  } else {
    activatePlayersForm();
    updatePlayerInfo(player1Name, player2Name);
    deactivatePlayersForm();
  }
}

/**
 * Updates the player information with the given names.
 * @param {string} player1Name - The name of the first player.
 * @param {string} player2Name - The name of the second player.
 */
function updatePlayerInfo(player1Name, player2Name) {
  player1.name = player1Name;
  player2.name = player2Name;
  firstPlayer.textContent = player1.name;
  secondPlayer.textContent = player2.name;
}

/**
 * Handles non-six rolls.
 * @param {Player} currentPlayer - The current player.
 */
function handleNonSixRoll(currentPlayer) {
  switchPlayer();
}

/**
 * Handles six rolls.
 * @param {Player} currentPlayer - The current player.
 */
function handleSixRoll(currentPlayer) {
  currentPlayer.consecutiveSix++;
  if (currentPlayer.consecutiveSix >= limitToRollTheDiceConsecutively) {
    switchPlayer();
  }
}

/**
 * Asynchronously rolls the dice and handles the game's logic.
 */
async function rollDice() {
  handleDisableRollDiceButton();
  let currentDiceNumber;

  try {
    currentDiceNumber = await fetchDiceNumber(generateDiceNumber);

    setQuestionTraps();

    game.currentPlayer.handlePlayerTurn(currentDiceNumber);
    objectTileElement.updateTileColors(players);

    const selectedDiceImage = diceImages[currentDiceNumber - 1];
    diceImageElement.src = selectedDiceImage;
    addTraps(game.currentPlayer);
    resetQuestionTraps();
    const logMessage = updateLogMessage(
      objectTileElement.isInTheTrap,
      objectTileElement.trapEffectNumber,
      game.currentPlayer,
      currentDiceNumber
    );

    history.push(logMessage);
    updateHistory();
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  } finally {
    setTimeout(() => handlePostRollLogic(currentDiceNumber), 1500);
  }
}

/**
 * Handles post-roll logic.
 * @param {number} currentDiceNumber - The number rolled on the dice.
 */
function handlePostRollLogic(currentDiceNumber) {
  diceImageElement.src = "images/roll-dice.gif";

  if (currentDiceNumber !== numberSixOnTheDice) {
    handleNonSixRoll(game.currentPlayer);
  } else {
    handleSixRoll(game.currentPlayer);
  }
  const winner = game.currentPlayer.determineWinner(player1, player2);
  if (winner) {
    showWinnerModal(winner.name);
  }

  handleEnableRollDiceButton();
}

/**
 * Switches the current player's turn.
 */
function switchPlayer() {
  game.currentPlayer.consecutiveSix = 0;

  if (game.currentPlayer === player1) {
    game.currentPlayer = player2;
    firstPlayerLabel.classList.remove("current-player");
    secondPlayerLabel.classList.add("current-player");
  } else {
    game.currentPlayer = player1;
    secondPlayerLabel.classList.remove("current-player");
    firstPlayerLabel.classList.add("current-player");
  }
}

/**
 * Activates the player names form.
 */
function activatePlayersForm() {
  firstPlayer.textContent = player1Name;
  secondPlayer.textContent = player2Name;
  player1NameInput.value = "";
  player2NameInput.value = "";

  addClass(gifContainer, "display_none");
  addClass(playerNamesContainer, "display_block");

  formTitle.textContent = "Player Names";
}

/**
 * Deactivates the player names form.
 */
function deactivatePlayersForm() {
  removeClass(startButton, "colorBackgroundButton");
  addClass(startButton, "style_button");

  player1NameInput.disabled = true;
  player1NameInput.placeholder = "";
  player2NameInput.disabled = true;
  player2NameInput.placeholder = "";

  addClass(formContainerBoxShadow, "display_boxshadow");
  addClass(playerNamesBoxShadow, "boxshadow_style");

  startButton.disabled = true;
}

/**
 * Adds a class to an HTML element.
 * @param {HTMLElement} element - The HTML element to which the class will be added.
 * @param {string} className - The name of the class to be added.
 */
function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Removes a class from an HTML element.
 * @param {HTMLElement} element - The HTML element from which the class will be removed.
 * @param {string} className - The name of the class to be removed.
 */
function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Shows the winner modal with the specified winner's name.
 * @param {string} winnerName - The name of the winning player.
 */
function showWinnerModal(winnerName) {
  const winnerModal = document.getElementsByClassName("winnerModal");
  const winnerNameElement = document.getElementById("winnerName");

  winnerNameElement.textContent = winnerName;

  $(winnerModal).modal("show");

  const closeModalWinnerButton = document.getElementById("closeModalWinner");
  closeModalWinnerButton.addEventListener("click", handleDisableRollDiceButton);

  const startNewGameButton = document.getElementById("startNewGameButton");
  startNewGameButton.addEventListener("click", reloadPage);
}

/**
 * Disables the roll dice button.
 */
function handleDisableRollDiceButton() {
  // adding a second class from css to the button couldn't override the first class, styling directly from javascript
  disabledRollDiceButton.disabled = true;
  disabledRollDiceButton.style.backgroundColor = "#4caf50";
  disabledRollDiceButton.style.cursor = "auto";
  disabledRollDiceButton.style.transform = "none";
}

/**
 * Enables the roll dice button.
 */
function handleEnableRollDiceButton() {
  disabledRollDiceButton.disabled = false;
  disabledRollDiceButton.style.cursor = "pointer";
  disabledRollDiceButton.style.backgroundColor = "";
}
