//COOOODIIIIIIING

// Spinning gear
const settingsIcon = document.getElementById("settingsIcon");
const settingsPopup = document.getElementById("settingsPopup");
const rulesIcon = document.getElementById("rulesIcon");
const rulesPopup = document.getElementById("rulesPopup");

// Toggle the rules popup and color when the rules icon is clicked
rulesIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  const isRulesOpen = rulesPopup.style.display === "none";
  rulesPopup.style.display = isRulesOpen ? "block" : "none";
  settingsPopup.style.display = "none"; // Close settings popup if open
  settingsIcon.classList.remove("active");
  rulesIcon.classList.toggle("active", isRulesOpen);
});

// Toggle the settings popup and spin/color when the settings icon is clicked
settingsIcon.addEventListener("click", (event) => {
  event.stopPropagation();
  const isSettingsOpen = settingsPopup.style.display === "none";
  settingsPopup.style.display = isSettingsOpen ? "block" : "none";
  rulesPopup.style.display = "none"; // Close rules popup if open
  rulesIcon.classList.remove("active");
  settingsIcon.classList.toggle("active", isSettingsOpen);

  // Add spin animation when settings icon is clicked
  if (isSettingsOpen) {
    settingsIcon.classList.add("spin");
    setTimeout(() => settingsIcon.classList.remove("spin"), 1000); // Removes spin after 1s
  }
});

// Hide both popups when clicking outside of them
document.addEventListener("click", (event) => {
  if (!rulesPopup.contains(event.target) && event.target !== rulesIcon) {
    rulesPopup.style.display = "none";
    rulesIcon.classList.remove("active");
  }
  if (!settingsPopup.contains(event.target) && event.target !== settingsIcon) {
    settingsPopup.style.display = "none";
    settingsIcon.classList.remove("active");
  }
});


// DARK  or LIGHT mode slider
document.body.classList.add(localStorage.getItem("theme") || "light-theme");

const themeToggle = document.getElementById("themeToggle");

themeToggle.checked = document.body.classList.contains("dark-theme");

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.replace("light-theme", "dark-theme");
    localStorage.setItem("theme", "dark-theme");
  } else {
    document.body.classList.replace("dark-theme", "light-theme");
    localStorage.setItem("theme", "light-theme");
  }
});





// GAME GAME GAME GAME

// GAME GAME GAME GAME
const board = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");
const rows = 7;
const cols = 9;
const pieces = {};
let turn = "Red";
let selectedPiece = null;
let validMoves = [];

// Sounds

const moveSound = new Audio("Images/move.mp3");
const ggSound = new Audio("Images/gg.mp3");
const takesSound = new Audio("Images/takes.mp3");

let isMuted = false;

// Bases cells
const redBase = { row: 3, col: 0 };
const blueBase = { row: 3, col: 8 };

// Trappers
const redTraps = [
  { row: 2, col: 0 },
  { row: 3, col: 1 },
  { row: 4, col: 0 }
];
const blueTraps = [
  { row: 2, col: 8 },
  { row: 3, col: 7 },
  { row: 4, col: 8 }
];

//Original value of the piecebefore entering a trap
const originalValues = {};

// Board creation
function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (isWaterCell(row, col)) {
        cell.classList.add("water");
      }

      // Add base cells
      if (row === redBase.row && col === redBase.col) {
        cell.classList.add("red-base");
      } else if (row === blueBase.row && col === blueBase.col) {
        cell.classList.add("blue-base");
      }

      // Add trap cells
      if (redTraps.some(trap => trap.row === row && trap.col === col)) {
        cell.classList.add("red-trap");
      } else if (blueTraps.some(trap => trap.row === row && trap.col === col)) {
        cell.classList.add("blue-trap");
      }

      cell.addEventListener("click", () => handleCellClick(row, col));
      board.appendChild(cell);
    }
  }
}

// mute sounds 

const muteToggle = document.getElementById("muteToggle");
muteToggle.checked = isMuted;

muteToggle.addEventListener("change", () => {
  isMuted = muteToggle.checked;
  localStorage.setItem("muteState", isMuted ? "true" : "false");
});

// Function to play sound if not muted
function playSound(sound) {
  if (!isMuted) {
    sound.play();
  }
}

window.addEventListener("load", () => {
  isMuted = localStorage.getItem("muteState") === "true";
  muteToggle.checked = isMuted;
});

function initializePieces() {
  // Set up the pieces
  pieces["redElephant"] = { row: 0, col: 2, symbol: "E", color: "red", value: 8 }; // done
  pieces["redLion"] = { row: 6, col: 0, symbol: "L", color: "red", value: 7 };  //done
  pieces["redTiger"] = { row: 0, col: 0, symbol: "T", color: "red", value: 6 }; //done
  pieces["redLeopard"] = { row: 4, col: 2, symbol: "P", color: "red", value: 5 }; //done
  pieces["redDog"] = { row: 5, col: 1, symbol: "D", color: "red", value: 4 }; //done
  pieces["redWolf"] = { row: 2, col: 2, symbol: "W", color: "red", value: 3 }; //done
  pieces["redCat"] = { row: 1, col: 1, symbol: "C", color: "red", value: 2 };
  pieces["redMouse"] = { row: 6, col: 2, symbol: "M", color: "red", value: 1 };

  pieces["blueElephant"] = { row: 6, col: 6, symbol: "E", color: "blue", value: 8 }; //done
  pieces["blueLion"] = { row: 0, col: 8, symbol: "L", color: "blue", value: 7 }; //done
  pieces["blueTiger"] = { row: 6, col: 8, symbol: "T", color: "blue", value: 6 }; //done
  pieces["blueLeopard"] = { row: 2, col: 6, symbol: "P", color: "blue", value: 5 }; //done
  pieces["blueDog"] = { row: 1, col: 7, symbol: "D", color: "blue", value: 4 };
  pieces["blueWolf"] = { row: 4, col: 6, symbol: "W", color: "blue", value: 3 };
  pieces["blueCat"] = { row: 5, col: 7, symbol: "C", color: "blue", value: 2 };
  pieces["blueMouse"] = { row: 0, col: 6, symbol: "M", color: "blue", value: 1 };

  updateBoard();
}

// Update board
function updateBoard() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = ""; // Clear cell 
    cell.classList.remove("red", "blue", "highlight");
  });

  for (const key in pieces) {
    const piece = pieces[key];
    const cell = document.querySelector(`.cell[data-row='${piece.row}'][data-col='${piece.col}']`);
    if (cell) {
      // Check if an image already exists; 
      let img = cell.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        img.classList.add("piece");
        cell.appendChild(img);
      }
      img.src = `Images/${piece.color}${piece.symbol}.png`;
      img.alt = piece.symbol;

      cell.classList.add(piece.color);
    }
  }
  playSound(moveSound); 
  updateTurnDisplay();
}


// Change turn ig fixed
function updateTurnDisplay() {
  turnDisplay.textContent = `Turn: ${turn}`;
}

// Water cells
const waterCells = [
  { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 5 },
  { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 },
  { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 },
  { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }
];
//   Checking if water cell
function isWaterCell(row, col) {
  return waterCells.some(cell => cell.row === row && cell.col === col);
}



//   Handling cell selection
function handleCellClick(row, col) {

  event.preventDefault();

  if (selectedPiece) {
    if (validMoves.some(move => move.row === row && move.col === col)) {
      moveSelectedPiece(row, col);
      checkWinCondition(row, col); // Check for win condition
      turn = turn === "Red" ? "Blue" : "Red";
      updateTurnDisplay(); // Update turns
      clearHighlights();
      selectedPiece = null;
    } else {
      clearHighlights();
      selectedPiece = null;
    }
  } else {
    for (const key in pieces) {
      const piece = pieces[key];
      if (piece.row === row && piece.col === col && piece.color.toLowerCase() === turn.toLowerCase()) {
        selectedPiece = key;
        validMoves = calculateValidMoves(piece);
        highlightValidMoves(validMoves);
      }
    }
  }
}
// Move pieces 
function moveSelectedPiece(row, col) {
  const piece = pieces[selectedPiece];
  const targetPiece = Object.values(pieces).find(p => p.row === row && p.col === col);

  // Save move history
  moveHistory.push({
    pieceKey: selectedPiece,
    prevRow: piece.row,
    prevCol: piece.col,
    capturedPiece: targetPiece
      ? { key: Object.keys(pieces).find(key => pieces[key] === targetPiece), ...targetPiece }
      : null
  });
  //Capturing pieces
  if (targetPiece) {
    const capturingTrapMouse = targetPiece.symbol === "M" && isOnOpponentTrap(targetPiece.row, targetPiece.col, targetPiece.color) && piece.symbol === "E";
    if (
      (targetPiece.color !== piece.color &&
        (piece.value >= targetPiece.value || (piece.symbol === "M" && targetPiece.symbol === "E") || capturingTrapMouse)) ||
      targetPiece.color !== piece.color
    ) {
      delete pieces[Object.keys(pieces).find(key => pieces[key] === targetPiece)];
      playSound(takesSound);

      // Mute move sound
      moveSound.muted = true;

      // Unmute the move sound after 2 seconds
      setTimeout(() => {
        moveSound.muted = false;
      }, 1000);

    } else {
      clearHighlights();
      selectedPiece = null;
      return;
    }
  }
  // check if opponent on trap
  if (isOnOpponentTrap(piece.row, piece.col, piece.color) && originalValues[selectedPiece] != null) {
    piece.value = originalValues[selectedPiece];
    delete originalValues[selectedPiece];
  }

  piece.row = row;
  piece.col = col;

  if (isOnOpponentTrap(row, col, piece.color)) {
    originalValues[selectedPiece] = piece.value;
    piece.value = 0;
  }

  updateBoard();
}

// Check if the cell is an opponent's trap
function isOnOpponentTrap(row, col, color) {
  if (color === "red") {
    return blueTraps.some(trap => trap.row === row && trap.col === col);
  } else if (color === "blue") {
    return redTraps.some(trap => trap.row === row && trap.col === col);
  }
  return false;
}


// Check for win condition
function checkWinCondition(row, col) {
  const piece = pieces[selectedPiece];

  if (row === redBase.row && col === redBase.col && piece.color === "blue") {
    playSound(ggSound);
    alert("Blue wins!");
    resetGame();
  } else if (row === blueBase.row && col === blueBase.col && piece.color === "red") {
    playSound(ggSound);
    alert("Red wins!");
    resetGame();
  }
}

// What moves are valid
function calculateValidMoves(piece) {
  const moves = [
    { row: piece.row - 1, col: piece.col },
    { row: piece.row + 1, col: piece.col },
    { row: piece.row, col: piece.col - 1 },
    { row: piece.row, col: piece.col + 1 }
  ];

  if (piece.symbol === "L" || piece.symbol === "T") {
    const jumpMoves = getJumpMoves(piece);
    moves.push(...jumpMoves);
  }

  return moves.filter(move => {
    if (move.row < 0 || move.row >= rows || move.col < 0 || move.col >= cols) return false;

    const targetPiece = Object.values(pieces).find(p => p.row === move.row && p.col === move.col);

    const inEnemyTrap = isOnOpponentTrap(piece.row, piece.col, piece.color);

    // Allow capture of any enemy piece if in an enemy trap
    if (targetPiece) {
      if (targetPiece.color === piece.color) return false;
      if (!inEnemyTrap && piece.value < targetPiece.value && !(piece.symbol === "M" && targetPiece.symbol === "E")) return false;
      if (piece.symbol === "E" && targetPiece.symbol === "M") return false;
    }

    if (isWaterCell(move.row, move.col) && piece.symbol !== "M") return false;
    if (isWaterCell(piece.row, piece.col) && targetPiece && targetPiece.symbol !== "M") return false;

    if ((move.row === redBase.row && move.col === redBase.col && piece.color === "red") ||
      (move.row === blueBase.row && move.col === blueBase.col && piece.color === "blue")) return false;

    return true;
  });
}

// Jump moves for tigers and lions
function getJumpMoves(piece) {
  const jumpMoves = [];
  const directions = [
    { dr: -1, dc: 0 }, // up
    { dr: 1, dc: 0 },  // down
    { dr: 0, dc: -1 }, // left
    { dr: 0, dc: 1 }   // right
  ];

  directions.forEach(direction => {
    let row = piece.row + direction.dr;
    let col = piece.col + direction.dc;

    // Check if we're starting from a water cell
    if (isWaterCell(row, col)) {
      let hasMouseBlock = false;

      // Jump to the other side of water
      while (isWaterCell(row, col)) {
        const blockingPiece = Object.values(pieces).find(p => p.row === row && p.col === col);

        // If a mouse is in the water cell, jumping is blocked
        if (blockingPiece && blockingPiece.symbol === "M" && blockingPiece.color !== piece.color) {
          hasMouseBlock = true;
          break;
        }

        row += direction.dr;
        col += direction.dc;
      }

      if (!hasMouseBlock && row >= 0 && row < rows && col >= 0 && col < cols) {
        const targetPiece = Object.values(pieces).find(p => p.row === row && p.col === col);

        // Allow jump move if the destination is empty or can be captured
        if (!targetPiece || targetPiece.color !== piece.color && piece.value >= targetPiece.value) {
          jumpMoves.push({ row, col });
        }
      }
    }
  });

  return jumpMoves;
}


//   Show valid moves on the board
function highlightValidMoves(moves) {
  moves.forEach(move => {
    const cell = document.querySelector(`.cell[data-row='${move.row}'][data-col='${move.col}']`);
    if (cell) cell.classList.add("highlight");
  });
}

//   Clear highlighted moves
function clearHighlights() {
  document.querySelectorAll(".highlight").forEach(cell => cell.classList.remove("highlight"));
  validMoves = [];
}

// TAKEBACKS
const moveHistory = [];
let takeBackRequested = false;

// Add the Take Back button
const takeBackButton = document.createElement("button");
const icon = document.createElement("span");
icon.classList.add("fa-solid", "fa-backward");  // Add Font Awesome classes
takeBackButton.textContent = " Take Back";
takeBackButton.prepend(icon);

takeBackButton.id = "takeBackButton";

document.body.appendChild(takeBackButton);

takeBackButton.addEventListener("click", handleTakeBack);

// Alerts and call
function handleTakeBack() {
  if (moveHistory.length === 0) {
    alert("No moves to take back.");
    return;
  }

  if (!takeBackRequested) {
    takeBackRequested = true;

    // Who's turn it is
    let opponentTurn = turn === "Red" ? "Blue" : "Red";

    const opponentResponse = confirm(`${opponentTurn} requests a take back. Blue do you accept?`);

    if (opponentResponse) {
      takeBackMove();
      takeBackRequested = false;
    } else {
      alert("Take-back request denied.");
      takeBackRequested = false;
    }
  }
}

// Take back logic
function takeBackMove() {
  const lastMove = moveHistory.pop();

  if (!lastMove) return;

  // Restore previous position
  const { pieceKey, prevRow, prevCol, capturedPiece } = lastMove;
  const piece = pieces[pieceKey];

  piece.row = prevRow;
  piece.col = prevCol;

  // Restore captured piece 
  if (capturedPiece) {
    pieces[capturedPiece.key] = capturedPiece;
  }

  // Switch turn back
  turn = turn === "Red" ? "Blue" : "Red";

  updateBoard();
  updateTurnDisplay();
  alert("Move taken back!");
}



// Reset game 
function resetGame() {
  turn = "Red";
  selectedPiece = null;
  initializePieces();
  updateTurnDisplay();
  clearHighlights();
}

// Start Game
createBoard();
initializePieces();
