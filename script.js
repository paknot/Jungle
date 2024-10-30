// script.js

const board = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");
const rows = 7;
const cols = 9;
const pieces = {};
let turn = "Red";
let selectedPiece = null;
let validMoves = [];


function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (isWaterCell(row, col)) {
        cell.classList.add("water"); // Adding a class for water styling
      }
      cell.addEventListener("click", () => handleCellClick(row, col));
      board.appendChild(cell);
    }
  }
}
function initializePieces() {
  // SEt up the pieces
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
    cell.textContent = "";
    cell.classList.remove("red", "blue", "highlight");
  });
  
  for (const key in pieces) {
    const piece = pieces[key];
    const cell = document.querySelector(`.cell[data-row='${piece.row}'][data-col='${piece.col}']`);
    if (cell) {
      cell.textContent = piece.symbol;
      cell.classList.add(piece.color);
    }
  }
  updateTurnDisplay();
}
// Change turn TO FIX
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
    if (selectedPiece) {
      // Is valid move
      if (validMoves.some(move => move.row === row && move.col === col)) {
        moveSelectedPiece(row, col);
        turn = turn === "Red" ? "Blue" : "Red"; // Changing turn only if a move is valid
        clearHighlights();
        selectedPiece = null;
      } else {
        // Clear if clicked not on a valid move
        clearHighlights();
        selectedPiece = null;
      }
    } else {
      // Piece selection if their turn
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
//   Moving pieces
  function moveSelectedPiece(row, col) {
    const targetPiece = Object.values(pieces).find(p => p.row === row && p.col === col);
  
    if (targetPiece) {
      if (targetPiece.color !== pieces[selectedPiece].color) {
        // Value check and mouse/elephant check
        if (
          (pieces[selectedPiece].value >= targetPiece.value && !(pieces[selectedPiece].symbol === "E" && targetPiece.symbol === "M")) ||
          (pieces[selectedPiece].symbol === "M" && targetPiece.symbol === "E") || // Mouse can capture elephant
          (pieces[selectedPiece].symbol === "M" && targetPiece.symbol === "M") // Mouse can capture another mouse
        ) {
          delete pieces[Object.keys(pieces).find(key => pieces[key] === targetPiece)]; // Takes takes takes
        } else {
          // If capture is not allowed reset 
          clearHighlights();
          selectedPiece = null;
          return;
        }
      } else {
        // If trying to capture a piece of the same color reset 
        clearHighlights();
        selectedPiece = null;
        return;
      }
    }
  
    // Transfering a piece
    pieces[selectedPiece].row = row;
    pieces[selectedPiece].col = col;
    updateBoard();
  }
  
// Move possibilities
const style = document.createElement('style');
style.innerHTML = `
  .water {
    background-color: lightblue;
  }
`;
document.head.appendChild(style);

function calculateValidMoves(piece) {
  const moves = [
    { row: piece.row - 1, col: piece.col }, // up
    { row: piece.row + 1, col: piece.col }, // down
    { row: piece.row, col: piece.col - 1 }, // left
    { row: piece.row, col: piece.col + 1 }  // right
  ];

  // Add jump moves for Lion and Tiger
  if (piece.symbol === "L" || piece.symbol === "T") {
    const jumpMoves = getJumpMoves(piece);
    moves.push(...jumpMoves);
  }

  return moves.filter(move => {
    if (move.row < 0 || move.row >= rows || move.col < 0 || move.col >= cols) return false;

    const targetPiece = Object.values(pieces).find(p => p.row === move.row && p.col === move.col);

    if (targetPiece) {
      if (targetPiece.color === piece.color) return false;

      // Only allow capture if value conditions are met
      if (
        piece.value < targetPiece.value && !(piece.symbol === "M" && targetPiece.symbol === "E") ||
        (piece.symbol === "E" && targetPiece.symbol === "M")
      ) return false;
    }

    if (isWaterCell(move.row, move.col) && piece.symbol !== "M") return false;

    if (isWaterCell(piece.row, piece.col) && targetPiece && targetPiece.symbol !== "M") return false;

    return true;
  });
}

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
  
  // Start Game
  createBoard();
  initializePieces();
  