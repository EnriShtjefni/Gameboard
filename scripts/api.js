/**
 * Asynchronously fetches a random dice number from an API.
 *
 * @param {Function} callback - A callback function to be called on error.
 * @returns {Promise<number>} A promise that resolves to the fetched dice number.
 */
async function fetchDiceNumber(callback) {
  try {
    const response = await fetch(
      "https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new"
    );

    if (!response.ok) {
      return callback();
    }

    const data = await response.text();
    return parseInt(data.trim(), 10);
  } catch (error) {
    return callback();
  }
}

/**
 * Generates a random integer between 1 and 6.
 *
 * @returns {number} A random integer between 1 and 6.
 */
function generateDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

export { fetchDiceNumber, generateDiceNumber };
