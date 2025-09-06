document.addEventListener("DOMContentLoaded", () => {
    const boardElement = document.getElementById("bingo-board");
    const words = JSON.parse(boardElement.dataset.words);
    const size = parseInt(boardElement.dataset.size) || 4;
    const bingoSound = new Audio(boardElement.dataset.sound);

    let board = [];
    let nextCellIndex = Array(size).fill(0); // track next required cell per row
    let completedRows = new Set();

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

    function handleClick(cell, index) {
        const lineIndex = lines.findIndex(line => line.includes(index));
        if (lineIndex === -1 || completedRows.has(lineIndex)) return;

        const expectedIndex = lines[lineIndex][nextCellIndex[lineIndex]];
        if (index === expectedIndex) {
            // correct next word
            cell.classList.add("clicked");
            nextCellIndex[lineIndex]++;

            if (nextCellIndex[lineIndex] === size) {
                // full line completed
                completedRows.add(lineIndex);
                bingoSound.play();
                alert("Reihe/Spalte fertig!");
            }
        }
        // if wrong: do nothing (skip mode)
    }
});
