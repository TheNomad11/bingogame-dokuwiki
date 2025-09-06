// lib/plugins/bingo/js/bingo.js
function initBingo(config) {
    const boardElement = document.getElementById(config.containerId);
    const scoreElement = document.getElementById(config.scoreId);
    const bingoSound = new Audio(config.sound);

    const size = config.size;
    const words = config.words; // predefined correct order
    let points = 0;
    let nextWordIndex = 0; // track next expected word
    const board = [];

    // shuffle words for display
    function shuffle(array) {
        const a = [...array];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const shuffledWords = shuffle(words);

    // render board
    boardElement.innerHTML = "";
    boardElement.classList.add(`size-${size}`);
    shuffledWords.forEach((word, idx) => {
        const cell = document.createElement("div");
        cell.className = "bingo-cell";
        cell.textContent = word;
        cell.dataset.word = word;
        boardElement.appendChild(cell);
        board.push(cell);
        cell.addEventListener("click", () => handleClick(cell));
    });

    // map rows and columns
    const rows = [];
    for (let r = 0; r < size; r++) {
        rows.push([...Array(size).keys()].map(c => r * size + c));
    }
    const cols = [];
    for (let c = 0; c < size; c++) {
        cols.push([...Array(size).keys()].map(r => r * size + c));
    }
    const lines = rows.concat(cols);
    const completedLines = new Set();

    function handleClick(cell) {
        const word = cell.dataset.word;
        if (word === words[nextWordIndex]) {
            // correct click
            cell.classList.add("clicked");
            points += 1;
            nextWordIndex++;
            scoreElement.textContent = "Punkte: " + points;

            // check all lines
            lines.forEach((line, idx) => {
                if (completedLines.has(idx)) return;
                if (line.every(i => board[i].classList.contains("clicked"))) {
                    completedLines.add(idx);
                    bingoSound.play();
                    alert("Reihe/Spalte fertig!");
                }
            });

            // check if game finished
            if (nextWordIndex === words.length) {
                alert("Alle Wörter richtig geklickt! Gesamtpunkte: " + points);
            }
        } else {
            // wrong click
            points -= 1;
            scoreElement.textContent = "Punkte: " + points;
            alert("Falsches Feld! Folge der Reihenfolge.");
        }
    }
}
