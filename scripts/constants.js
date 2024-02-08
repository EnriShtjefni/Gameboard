/**
 * An array of file paths to images of six-sided dice, representing each possible face.
 */
const diceImages = [
  "images/dice-1.png",
  "images/dice-2.png",
  "images/dice-3.png",
  "images/dice-4.png",
  "images/dice-5.png",
  "images/dice-6.png",
];

/**
 * An object representing trap effects on specific tile positions.
 */
const trapEffects = {
  5: -1,
  9: 1,
  13: null,
  18: 3,
  22: -3,
  26: null,
  30: 6,
  35: -6,
  39: +9,
  44: null,
  49: -9,
};

const firstPlayerColor = "lightblue";
const secondPlayerColor = "pink";

const winningTileNumber = 50;
const numberSixOnTheDice = 6;
const limitToRollTheDiceConsecutively = 3;
const numberOfTilesPerRow = 9;

export {
  diceImages,
  trapEffects,
  winningTileNumber,
  numberSixOnTheDice,
  limitToRollTheDiceConsecutively,
  firstPlayerColor,
  secondPlayerColor,
  numberOfTilesPerRow,
};
