const switchButton = document.getElementById("switch");

/**
 * Reloads the current page.
 */
function reloadPage() {
  location.reload();
}

/**
 * Handles the exit game action and shows an exit confirmation modal.
 */
function handleExitGame() {
  const exitModal = document.getElementById("exitModal");
  $(exitModal).modal("show");

  const confirmExitButton = document.getElementById("confirmExitButton");
  confirmExitButton.addEventListener("click", reloadPage);
}

/**
 * Handles toggling the background image and text color based on the state of the background switch button.
 */
function handleBackgroundToggle() {
  const body = document.body;

  if (switchButton.checked) {
    body.style.backgroundImage = 'url("images/background2.png")';
    body.style.color = "white";
  } else {
    body.style.backgroundImage = 'url("images/background1.png")';
    body.style.color = "black";
  }
}

/**
 * Exits the game when the exit button is clicked.
 */
function addExitGameListener() {
  const exitButtons = document.getElementsByClassName("exit");
  for (const exitButton of exitButtons) {
    exitButton.addEventListener("click", handleExitGame);
  }
}

function addSwitchButtonEventListener() {
  switchButton.addEventListener("change", handleBackgroundToggle);
}

/**
 * Handles with the playing or stopping the song and changing the button icon.
 */
function addIconListener() {
  const song = document.getElementById("song");
  const icons = document.getElementsByClassName("icon");
  for (const icon of icons) {
    icon.addEventListener("click", function () {
      if (song.paused) {
        song.play();
        icon.src = "media/pause.png";
      } else {
        song.pause();
        icon.src = "media/play.png";
      }
    });
  }
}

/**
 * Handles the roll dice button.
 *
 * @param {function} callback - The function to execute when the roll dice button is clicked.
 */
function addRollDiceButtonEventListener(callback) {
  const rollDiceButton = document.querySelector(".roll-dice");
  rollDiceButton.addEventListener("click", callback);
}

export {
  reloadPage,
  addExitGameListener,
  addSwitchButtonEventListener,
  addIconListener,
  addRollDiceButtonEventListener,
};
