import {
  winningTileNumber,
  numberSixOnTheDice,
} from "./constants.js";
import { mutableTrapEffects, objectTileElement, tiles } from "./gameBoard.js";
import { players } from "./game.js";

/**
 * Represents a player in the game.
 * @class
 */
export default class Player {
  /**
   * Creates a new Player.
   * @constructor
   * @param {string} color - The color of the player's game piece.
   * @param {string} - The name of the player.
   */
  constructor(color, name = "") {
    this.name = name;
    this.color = color;
    this.diceNumber = 0;
    this.consecutiveSix = 0;
    this.position = 0;
    this.isPlaying = false;
    this.playerTakenDown = null;
  }

  /**
   * Handles moving the player to the destination tile.
   * @param {HTMLElement} destinationTile - The tile the player is moving to.
   */
  handlePlayerMoving(destinationTile) {
    const occupyingPlayer = objectTileElement.getOccupyingPlayer(destinationTile, players);
    if (occupyingPlayer) {
      if (occupyingPlayer.color === this.color) {
        occupyingPlayer.position = this.position;
      } else {
        occupyingPlayer.position = 1;
        this.playerTakenDown = occupyingPlayer;
      }
    }
  }

  /**
   * Handles a player's turn in the game.
   * @param {number} diceNumber - The number rolled on the dice.
   */
  handlePlayerTurn(diceNumber) {
    this.playerTakenDown = null;
    if (!this.isPlaying && diceNumber === numberSixOnTheDice) {
      this.isPlaying = true;
      this.position = 1;
      objectTileElement.updateTileColors(players);
    } else if (this.isPlaying) {
      const nextPosition = this.position + diceNumber;
      const trapEffect = mutableTrapEffects[nextPosition];
      let destinationTile;

      if (trapEffect !== undefined) {
        destinationTile = tiles[this.position + diceNumber + trapEffect];
      } else {
        destinationTile = tiles[this.position + diceNumber];
      }

      if (destinationTile) {
        this.handlePlayerMoving(destinationTile);
      }

      this.updatePlayerPosition(diceNumber);
    }
  }

  /**
   * Updates the player's position on the game board.
   * @param {number} diceNumber - The number rolled on the dice.
   */
  updatePlayerPosition(diceNumber) {
    const remainingDistanceToGoal = winningTileNumber - this.position;

    if (!(remainingDistanceToGoal < diceNumber)) {
      this.position += diceNumber;
      this.diceNumber = diceNumber;
    }
  }

  /**
   * Finds the winner of the game.
   * @returns {Player|null} - The winning player or null if there's no winner.
   */
  findWinner() {
    if (this.position === winningTileNumber) {
      return this;
    }
    return null;
  }

  /**
   * Determines the winner of the game between two players.
   * @param {Player} player1 - The first player.
   * @param {Player} player2 - The second player.
   * @returns {Player|null} - The winning player or null if there's no winner.
   */
  determineWinner(player1, player2) {
    if (player1.position === winningTileNumber) {
      return player1;
    } else if (player2.position === winningTileNumber) {
      return player2;
    } else {
      return null;
    }
  }
}