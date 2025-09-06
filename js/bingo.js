function initBingo(config) {
    const boardElement = document.getElementById(config.containerId);
    const scoreElement = document.getElementById(config.scoreId);
    const words = [...config.words];
    const size = parseInt(config.size);
    const bingoSound = new Audio(config.sound);

    let board = [];
    let points = 0;
    let nextCellIndex = Array(size).fill(0); // track next required cell per line
    let completedLines = new Set();

    // shuffle words
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const shuffledWords = shuffle(words);

    // generate cells
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = shuffledWords[i];
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleClick(cell, i));
        boardElement.appendChild(cell);
        board.push(cell);
    }

    // define rows and columns
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
        let lineCompletedThisClick = false;
        let correctClick = false;

        // check all lines that include this cell
        lines.forEach((line, lineIndex) => {
            if (line.includes(index) && !completedLines.has(lineIndex)) {
                const expectedIndex = line[nextCellIndex[lineIndex]];
                if (index === expectedIndex) {
                    cell.classList.add('clicked');
                    nextCellIndex[lineIndex]++;
                    points++;
                    correctClick = true;

                    if (nextCellIndex[lineIndex] === size) {
                        completedLines.add(lineIndex);
                        lineCompletedThisClick = true;
                    }
                }
            }
        });

        if (!correctClick) points--;

        scoreElement.textContent = 'Punkte: ' + points;

        if (lineCompletedThisClick) {
            bingoSound.play();
            alert('Reihe/Spalte fertig!');
        }

        if (completedLines.size === lines.length) {
            alert('Alle Reihen/Spalten sind fertig! Endpunkte: ' + points);
        }
    }
}
