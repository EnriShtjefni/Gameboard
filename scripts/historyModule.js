/**
 * An array to store the game history.
 * @type {string[]}
 */
export const history = [];

/**
 * Updates the history container by displaying the game history at the history container.
 */
export function updateHistory() {
  const historyContainer = document.getElementsByClassName("history-container")[0];
  historyContainer.innerHTML = "";

  history.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.textContent = item;
    historyContainer.appendChild(historyItem);
  });

  historyContainer.scrollTop = historyContainer.scrollHeight;
}

/**
 * Generates a log message based on game events, including dice roll, traps, takedowns, and winners.
 *
 * @param {boolean} isInTheTrap - Indicates whether the player is in a trap.
 * @param {number|null} trapEffectNumber - The effect of the trap (or null if there's no trap).
 * @param {Player} player - The player involved in the event.
 * @param {number} dice - The dice roll result.
 * @returns {string} - The log message describing the game event.
 */
export function updateLogMessage(isInTheTrap, trapEffectNumber, player, dice) {
  const winner = player.findWinner();
  const trapMessage = isInTheTrap
    ? `${player.name} rolled a ${dice}. ${player.name} hit a ${trapEffectNumber} trap${player.playerTakenDown ? ` and took down ${player.playerTakenDown.name}` : ''}` : '';
  const takedownMessage = player.playerTakenDown
    ? `${player.name} rolled a ${dice} and took down ${player.playerTakenDown.name}` : '';
  const winnerMessage = winner
    ? `${player.name} rolled a ${dice} Congratulations ${winner.name}! You are the winner!` : '';
  return trapMessage || takedownMessage || winnerMessage || `${player.name} rolled a ${dice}`;
}