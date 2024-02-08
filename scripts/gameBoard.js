import {
  numberOfTilesPerRow,
  trapEffects,
  winningTileNumber,
} from "./constants.js";
import Mustache from "../library/mustache.js";
import { players } from "./game.js";

/**
 * Represents a tile element on the game board.
 * @class
 */
export default class TileElement {
  /**
  * Creates a new TileElement object.
  * @constructor
  */
  constructor() {
    this.isInTheTrap = false;
    this.trapEffectNumber;
    this.tilesData = [];
  }

  /**
   * Updates the `isInTheTrap` property with the provided value.
   * @param {boolean} value - The new value for `isInTheTrap`.
   */
  updateIsInTheTrap(value) {
    this.isInTheTrap = value;
  }

  /**
   * Updates the `trapEffectNumber` property with the provided value.
   * @param {number} value - The new value for `trapEffectNumber`.
   */
  updateTrapEffectNumber(value) {
    this.trapEffectNumber = value;
  }

  /**
   * Updates the colors of the tiles on the game board based on player positions.
   * @param {Player[]} players - An array of player objects.
   */
  updateTileColors(players) {
    this.clearTileColors();
    players.forEach((player) => {
      if (tiles[player.position]) {
        this.tilesData[player.position - 1].backgroundColor = player.color;
      }
    });

    tilesHtml = this.tilesData
      .map((tileData) => {
        return Mustache.render(tileTemplate, tileData);
      })
      .join("");

    gameBoardContainer.innerHTML = tilesHtml;
    organizeTiles();
  }

  /**
   * Clears the background colors of all tiles.
   */
  clearTileColors() {
    this.tilesData.forEach((tileData) => {
      tileData.backgroundColor = "";
    });
  }

  /**
   * Gets the player occupying a specific tile.
   * @param {HTMLElement} tile - The tile element.
   * @param {Player[]} players - An array of player objects.
   */
  getOccupyingPlayer(tile, players) {
    const tileId = tile.id.split("-")[1];
    const tileData = this.tilesData.find((tile) => tile.id === parseInt(tileId));

    for (const player of players) {
      if (tileData.backgroundColor === player.color) {
        return player;
      }
    }

    return null;
  }
}

/**
 * An instance of the TileElement class.
 */
export const objectTileElement = new TileElement();

const keysToReset = [];
const mutableTrapEffects = { ...trapEffects };

const tileTemplate = document.getElementById("tile-template").innerHTML;
const gameBoardContainer = document.querySelector(".game-board");

const tileNumbers = Array.from({ length: winningTileNumber }, (_, i) => i + 1);

tileNumbers.forEach((number) => {
  const tile = {
    id: number,
    content:
      mutableTrapEffects[number] !== null
        ? mutableTrapEffects[number] >= 0
          ? "+" + mutableTrapEffects[number]
          : mutableTrapEffects[number]
        : "?",
    backgroundColor: "",
    birdGif: number === 1,
    crownGif: number === winningTileNumber,
  };
  objectTileElement.tilesData.push(tile);

  const tileElement = document.createElement("div");
  tileElement.classList.add("tile");
  tileElement.id = `tile-${tile.id}`;
  gameBoardContainer.appendChild(tileElement);
});

/**
 * Object that stores information about tiles on the game board.
 * @type {Object}
 */
export const tiles = {};
const tileElements = Array.from(gameBoardContainer.querySelectorAll(".tile"));

/**
 * Initializes the game board.
 */
function initializeBoard() {
  tileElements.forEach((tile) => {
    const id = tile.id.split("-")[1];
    tiles[id] = tile;
  });
  organizeTiles();
}

let tilesHtml = "";

objectTileElement.tilesData.forEach((tileData) => {
  const renderedTile = Mustache.render(tileTemplate, tileData);
  tilesHtml += renderedTile;
});

/**
 * Organizes and displays tiles on the game board based on their arrangement.
 */
function organizeTiles() {
  gameBoardContainer.innerHTML = tilesHtml;

  let tileStart = 1;

  Array.from({ length: numberOfTilesPerRow }, (_, row) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row" + (row + 1);

    let tileEnd;

    if (row % 2 === 0) {
      tileEnd = tileStart + 8;
    } else {
      tileEnd = tileStart;
    }

    tileNumbers
      .filter((number) => number >= tileStart && number <= tileEnd)
      .forEach((number) => {
        const tile = document.getElementById("tile-" + number);

        if (tile) {
          rowDiv.appendChild(tile);
        }
      });

    gameBoardContainer.appendChild(rowDiv);
    tileStart = tileEnd + 1;
  });

  const tile50 = document.getElementById("tile-50");
  if (tile50) {
    const row9Div = document.querySelector(".row9");
    row9Div.appendChild(tile50);
  }
}

/**
 * Generates a random trap effect for question traps.
 * @returns {number} - The random trap effect.
 */
function questionTrap() {
  let randomTrap = [-3, -2, -1, 1, 2, 3];
  const randomIndex = Math.floor(Math.random() * randomTrap.length);
  const chooseRandomTrap = randomTrap[randomIndex];
  return chooseRandomTrap;
}

/**
 * Sets random question traps for game tiles.
 */
function setQuestionTraps() {
  for (const key in mutableTrapEffects) {
    if (
      mutableTrapEffects.hasOwnProperty(key) &&
      mutableTrapEffects[key] === null
    ) {
      mutableTrapEffects[key] = questionTrap();
      keysToReset.push(key);
    }
  }
}

/**
 * Resets question traps to null.
 */
function resetQuestionTraps() {
  for (const key of keysToReset) {
    mutableTrapEffects[key] = null;
  }
}

/**
 * Adds traps to the player's position and updates tile colors.
 * @param {Player} currentPlayer - The current player.
 */
function addTraps(currentPlayer) {
  let trapEffect = mutableTrapEffects[currentPlayer.position];

  if (trapEffect) {
    objectTileElement.updateIsInTheTrap(true);
    objectTileElement.updateTrapEffectNumber(trapEffect);
    currentPlayer.position += trapEffect;
    setTimeout(function () {
      objectTileElement.updateTileColors(players);
    }, 900);
  } else {
    objectTileElement.updateIsInTheTrap(false);
  }
}

export {
  mutableTrapEffects,
  initializeBoard,
  setQuestionTraps,
  resetQuestionTraps,
  addTraps,
};
