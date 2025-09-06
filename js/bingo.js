document.addEventListener("DOMContentLoaded", function () {
    const bingoBoards = document.querySelectorAll(".bingo-board");

    bingoBoards.forEach(board => {
        const cells = board.querySelectorAll(".bingo-cell");
        const scoreDisplay = board.querySelector(".bingo-score");
        let score = 0;
        let completedRows = new Set();

        // Load sound
        const winSound = new Audio(DOKU_BASE + "lib/plugins/bingolistening/sounds/win.mp3");

        cells.forEach(cell => {
            cell.addEventListener("click", function () {
                if (cell.classList.contains("clicked")) return;

                cell.classList.add("clicked");
                score++;
                scoreDisplay.textContent = "Punkte: " + score;

                // After each click, check rows
                checkRows();
            });
        });

        function checkRows() {
            const size = Math.sqrt(cells.length); // 3 for 3x3, 4 for 4x4
            let allRowsCompleted = true;

            // Horizontal rows
            for (let r = 0; r < size; r++) {
                let rowComplete = true;
                for (let c = 0; c < size; c++) {
                    const idx = r * size + c;
                    if (!cells[idx].classList.contains("clicked")) {
                        rowComplete = false;
                        allRowsCompleted = false;
                        break;
                    }
                }
                if (rowComplete && !completedRows.has("row" + r)) {
                    completedRows.add("row" + r);
                    winSound.play();
                }
            }

            // Vertical rows
            for (let c = 0; c < size; c++) {
                let colComplete = true;
                for (let r = 0; r < size; r++) {
                    const idx = r * size + c;
                    if (!cells[idx].classList.contains("clicked")) {
                        colComplete = false;
                        allRowsCompleted = false;
                        break;
                    }
                }
                if (colComplete && !completedRows.has("col" + c)) {
                    completedRows.add("col" + c);
                    winSound.play();
                }
            }

            // If all rows are completed → final sound
            if (allRowsCompleted && !completedRows.has("all")) {
                completedRows.add("all");
                winSound.play();
            }
        }
    });
});
