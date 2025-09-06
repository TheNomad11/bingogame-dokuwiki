document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("bingo-board");
    if (!boardElement) return;

    const words = JSON.parse(boardElement.dataset.words);
    const size = parseInt(boardElement.dataset.size) || 4;
    const bingoSound = new Audio(boardElement.dataset.sound);

    let board = [];
    let nextCellIndex = Array(size * 2).fill(0); // track progress for rows + cols
    let completedLines = new Set();
    let points = 0;

    // shuffle words
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledWords = shuffle([...words]);

    // generate board
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.className = "bingo-cell";
        cell.textContent = shuffledWords[i];
        cell.dataset.index = i;
        cell.addEventListener("click", () => handleClick(cell, i));
        boardElement.appendChild(cell);
        board.push(cell);
    }

    // define rows + cols
    const rows = [];
    for (let r = 0; r < size; r++) {
        rows.push([...Array(size).keys()].map(c => r * size + c));
    }
    const cols = [];
    for (let c = 0; c < size; c++) {
        cols.push([...Array(size).keys()].map(r => r * size + c));
    }
    const lines = rows.concat(cols);

    // update points display
    function updatePoints() {
        const pointsElement = document.getElementById("bingo-points");
        if (pointsElement) {
            pointsElement.textContent = "Punkte: " + points;
        }
    }

    function handleClick(cell, index) {
        // already clicked? skip
        if (cell.classList.contains("clicked")) return;

        // mark cell clicked
        cell.classList.add("clicked");
        points++;
        updatePoints();

        // check each line (row or column) that contains this cell
        lines.forEach((line, lineIndex) => {
            if (completedLines.has(lineIndex)) return;

            if (line.every(i => board[i].classList.contains("clicked"))) {
                completedLines.add(lineIndex);
                bingoSound.play();
                alert("Reihe/Spalte fertig!");
            }
        });

        // check win condition
        if (completedLines.size === lines.length) {
            alert("Alle Reihen/Spalten fertig! Bingo!");
        }
    }

    updatePoints();
});
