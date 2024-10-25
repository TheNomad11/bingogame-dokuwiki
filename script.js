document.addEventListener('DOMContentLoaded', function() {
    const bingoCard = document.getElementById('bingo-card');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    const popupMessage = document.getElementById('popup-message');
    const bingoSound = document.getElementById('bingo-sound');

    let completedRows = new Set();
    let completedColumns = new Set();

    // Use the words provided in the DokuWiki syntax
    const words = window.bingoWords || [];

    // Shuffle the words
    shuffleArray(words);

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

        const cells = document.querySelectorAll(`.bingo-cell[data-row="${rowIndex}"]`);
        const isRowComplete = Array.from(cells).every(cell => cell.classList.contains('selected'));

        if (isRowComplete) {
            completedRows.add(rowIndex);
            showPopup(`Reihe ${rowIndex + 1} abgeschlossen!`);
        }
    }

    function checkColumn(colIndex) {
        if (completedColumns.has(colIndex)) return;

        const cells = document.querySelectorAll(`.bingo-cell[data-col="${colIndex}"]`);
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
});
