// Wordle game logic

const WORD_BANK = ["phoenix", "jett", "astra", "waylay", "brimstone", "sage", "sova", "viper", "cypher", "reyna", "killjoy", "breach", "omen", "raze", "skye", "yoru", "kayo", "chamber", "neon", "fade", "harbor", "gekko", "deadlock", "iso", "clove", "vyse", "tejo"];
let answer = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
let wordLength = answer.length;
let maxRows = 6;
let currentRow = 0;
let currentCol = 0;
let guesses = Array(maxRows).fill("");
let letterStates = {};

// Dynamically generate grid
function createGrid() {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '';
  for (let r = 0; r < maxRows; r++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let c = 0; c < wordLength; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}


function updateGrid() {
  const rows = document.querySelectorAll(".row");
  for (let r = 0; r < maxRows; r++) {
    const cells = rows[r].querySelectorAll(".cell");
    for (let c = 0; c < wordLength; c++) {
      cells[c].textContent = guesses[r][c] || "";
      if (r === currentRow) {
        cells[c].className = "cell";
      }
    }
  }
}

function colorRow(rowIdx) {
  const row = document.querySelectorAll(".row")[rowIdx];
  const cells = row.querySelectorAll(".cell");
  const guess = guesses[rowIdx];
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  let answerUsed = Array(wordLength).fill(false);
  let guessResult = Array(wordLength).fill("absent");

  // First pass: mark correct
  for (let i = 0; i < wordLength; i++) {
    if (guessArr[i] === answerArr[i]) {
      guessResult[i] = "correct";
      answerUsed[i] = true;
    }
  }
  // Second pass: mark present
  for (let i = 0; i < wordLength; i++) {
    if (guessResult[i] === "correct") continue;
    for (let j = 0; j < wordLength; j++) {
      if (!answerUsed[j] && guessArr[i] === answerArr[j]) {
        guessResult[i] = "present";
        answerused[j] = true;
        break;
      }
    }
  }
  // Apply colors & update keyboard
  for (let i = 0; i < wordLength; i++) {
    cells[i].classList.add(guessResult[i]);
    const letter = guessArr[i];
    if (guessResult[i] === "correct") {
      letterStates[letter] = "correct";
    } else if (guessResult[i] === "present") {
      if (letterStates[letter] !== "correct") {
        letterStates[letter] = "present";
      }
    } else {
      if (!letterStates[letter]) {
        letterStates[letter] = "absent";
      }
    }
  }
  updateKeyboard();
}

function updateKeyboard() {
  document.querySelectorAll('.key').forEach(btn => {
    const key = btn.dataset.key.toLowerCase();
    btn.classList.remove('correct', 'present', 'absent');
    if (letterStates[key]) {
      btn.classList.add(letterStates[key]);
    }
  });
}


function handleKeyInput(key) {
  if (currentRow >= maxRows) return;
  if (key === "Backspace") {
    if (currentCol > 0) {
      guesses[currentRow] = guesses[currentRow].slice(0, -1);
      currentCol--;
      updateGrid();
    }
  } else if (/^[a-zA-Z]$/.test(key)) {
    if (currentCol < wordLength) {
      guesses[currentRow] += key.toLowerCase();
      currentCol++;
      updateGrid();
    }
  } else if (key === "Enter") {
    if (guesses[currentRow].length === wordLength) {
      if (!WORD_BANK.includes(guesses[currentRow])) {
        alert("Not in word list");
        return;
      }
      colorRow(currentRow);
      if (guesses[currentRow] === answer) {
        alert("You win!");
        currentRow = maxRows;
        return;
      }
      currentRow++;
      currentCol = 0;
      updateGrid();
      if (currentRow === maxRows) {
        alert("Game over! The word was " + answer);
      }
    }
  }
}

function handleKey(e) {
  handleKeyInput(e.key);
}

document.addEventListener("keydown", handleKey);

// Keyboard GUI click support
document.querySelectorAll('.key').forEach(btn => {
  btn.addEventListener('click', () => {
    handleKeyInput(btn.dataset.key);
  });
});

createGrid();
updateGrid();

document.addEventListener("keydown", handleKey);
updateGrid();


