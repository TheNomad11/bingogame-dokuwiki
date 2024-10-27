document.addEventListener('DOMContentLoaded', function() {
    console.log('Bingo games to initialize:', bingoGames.length);
    
    bingoGames.forEach(function(game, index) {
        console.log('Initializing game:', index + 1);
        initBingoGame(game.id, game.words);
    });
});

function initBingoGame(containerId, words) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }

    const bingoCard = container.querySelector('.bingo-card');
    const popup = container.querySelector('.bingo-popup');
    const closePopup = container.querySelector('button');
    const popupMessage = container.querySelector('h2');
    const bingoSound = container.querySelector('audio');

    let completedRows = new Set();
    let completedColumns = new Set();

    console.log('Words for this game:', words.length);

    // Ensure we have exactly 16 words
    words = words.slice(0, 16);

    // Shuffle the words
    shuffleArray(words);

    // Clear existing content
    bingoCard.innerHTML = '';

    // Create bingo card
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.textContent = words[i] || '';
        cell.dataset.row = Math.floor(i / 4);
        cell.dataset.col = i % 4;
        cell.addEventListener('click', () => toggleCell(cell));
        bingoCard.appendChild(cell);
    }

    console.log('Cells created:', bingoCard.children.length);

    // Explicitly set grid layout
    bingoCard.style.display = 'grid';
    bingoCard.style.gridTemplateColumns = 'repeat(4, 1fr)';
    bingoCard.style.gridTemplateRows = 'repeat(4, 1fr)';

    function toggleCell(cell) {
        cell.classList.toggle('selected');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        checkRow(row);
        checkColumn(col);
        checkAllCompleted();
    }

    function checkRow(rowIndex) {
        if (completedRows.has(rowIndex)) return;

        const cells = bingoCard.querySelectorAll(`.bingo-cell[data-row="${rowIndex}"]`);
        const isRowComplete = Array.from(cells).every(cell => cell.classList.contains('selected'));

        if (isRowComplete) {
            completedRows.add(rowIndex);
            showPopup(`Reihe ${rowIndex + 1} abgeschlossen!`);
        }
    }

    function checkColumn(colIndex) {
        if (completedColumns.has(colIndex)) return;

        const cells = bingoCard.querySelectorAll(`.bingo-cell[data-col="${colIndex}"]`);
        const isColumnComplete = Array.from(cells).every(cell => cell.classList.contains('selected'));

        if (isColumnComplete) {
            completedColumns.add(colIndex);
            showPopup(`Spalte ${colIndex + 1} abgeschlossen!`);
        }
    }

    function checkAllCompleted() {
        if (completedRows.size === 4 && completedColumns.size === 4) {
            setTimeout(() => showPopup("Glückwunsch! Alle Reihen und Spalten abgeschlossen!"), 1500);
        }
    }

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'flex';
        
        // Play sound effect
        bingoSound.currentTime = 0;
        bingoSound.play().catch(e => console.log("Audio play failed:", e));
    }

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
