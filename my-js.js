const Board = (function(){
    const cellButtons = document.querySelectorAll(".cell");
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    let currentHandler = null;
    const winningPositions = {
        1: [[0, 0], [0, 1], [0, 2]],
        2: [[1, 0], [1, 1], [1, 2]],
        3: [[2, 0], [2, 1], [2, 2]],
        4: [[0, 0], [1, 0], [2, 0]],
        5: [[0, 1], [1, 1], [2, 1]],
        6: [[0, 2], [1, 2], [2, 2]],
        7: [[0, 2], [1, 1], [2, 0]],
        8: [[0, 0], [1, 1], [2, 2]],
    };

    function getBoardCopy() {
        return board.map(row => [...row]);
    }

    function returnPositions(playerMark) { // returns an array of  current positions
        const columnsWithCells = drawColumnIndex(board, playerMark);
        const currentPositions = [];

        if (columnsWithCells.length > 0) {
            for (let i = 0; i < columnsWithCells.length; i++) {
                currentPositions.push([]);
                let cells = drawRowIndex(board[columnsWithCells[i]], playerMark);
                for (let j = 0; j < cells.length; j++) {
                    currentPositions[i].push([columnsWithCells[i], cells[j]]);
                }

            }
        }
        return currentPositions;
    }

    function checkIfWinningPosition(playerPosition) { // returns true if winning position found

        const flatPlayerPosition = playerPosition.flat();
        
        for (let key in winningPositions) {
            let matchCount = 0;
 
            for (let winCoordination of winningPositions[key]) {
                if (flatPlayerPosition.some(pos => 
                    JSON.stringify(pos) === JSON.stringify(winCoordination))) {
                    matchCount++;
                }
            }
            // found a winning position ? return true
            if (matchCount === 3) {
                return true;
            }
        }
        return false;
    }

    function isBoardEmpty() {
        return board.some(item => item.includes(""));
    }

    function setPosition(position, mark) {
        board[position[0]].splice(position[1], 1, mark);
        if (mark == computer.computerMark) {
            const cell = document.querySelector(`[data-pos='${position[0]}-${position[1]}']`);
            cell.textContent = mark;
        }
    }

    function takeButtonInput() {
        function takeClick(resolve, reject) {
            currentHandler = function handleCellClick(e) {
                const clickedCell = e.target.dataset.pos.split("-").map(Number);

                const row = clickedCell[0];
                const col = clickedCell[1];

                if (Board.getBoardCopy()[row][col] !== "") {
                    reject("wrong move");
                    return
                }

                e.target.textContent = player.playerMark;
                resolve(clickedCell);

                cleanupCellsListeners();
            }

            for (let btn of cellButtons) {
                btn.addEventListener("click", currentHandler);
            }
        }

        return new Promise(takeClick)
        .catch(reason => {
            return reason;
        })
    }

    function cleanupCellsListeners() {
        if (currentHandler) {
            for (let btn of cellButtons) {
                btn.removeEventListener("click", currentHandler);
            }

            currentHandler = null;
        }
    }

    function disableCellsButtons(gameFinished) {
        for (let btn of cellButtons) {
            btn.disabled = false;
            if (gameFinished) btn.disabled = true;
        } 
    }

    function resetBoard() {
        return board = [["", "", ""], ["", "", ""], ["", "", ""]];
    }
    

    return {setPosition, returnPositions,
            checkIfWinningPosition, isBoardEmpty,
            getBoardCopy, takeButtonInput, disableCellsButtons,
            resetBoard, cleanupCellsListeners}
})();

const GameController = (function(){
    let isGameRunning = false;
    const startButton = document.querySelector(".start-button");
    const resetButton = document.querySelector(".reset-button");


    async function currentTurn(move, mark) {
        let currentMove;
        while (true) {
            try {
                currentMove = await move();
                if (currentMove == "wrong move") {
                    continue
                } else {
                    Board.setPosition(currentMove, mark);
                    break;
                }
                
            } catch (e) {
                throw e;
        }
    } 
        console.log(currentMove);
        
    
}

    function checkWin(mark) {
        const checkCurrentPosition = Board.returnPositions(mark);
        const isWinningPosition = Board.checkIfWinningPosition(checkCurrentPosition);
        if (isWinningPosition) {
                Board.disableCellsButtons(true);
                alert(`${mark} wins!`)
                return true;
        } else if (!Board.isBoardEmpty()) {
            alert("It's a draw!")
            return true;
        }

        return false;
    }

    async function gameStart() {
        if (isGameRunning) return;
        isGameRunning = true;
        while (true) {
            await currentTurn(Board.takeButtonInput, player.playerMark);
            if (checkWin(player.playerMark)) break;
            if (Board.isBoardEmpty()) {
                await currentTurn(computer.chooseRandomPosition,
                     computer.computerMark);
                if (checkWin(computer.computerMark)) break;
            }
        }
        isGameRunning = false; 
    }

    startButton.addEventListener("click", () => {
        Board.disableCellsButtons(false);
        gameStart();
    })

    resetButton.addEventListener("click", async () => {
        isGameRunning = false; 
        await new Promise(resolve => setTimeout(resolve, 100));
        Board.resetBoard();
        Board.cleanupCellsListeners();
        Board.disableCellsButtons(false);

        const cellButtons = document.querySelectorAll(".cell");
        cellButtons.forEach(btn => btn.textContent = "");

        gameStart();
    })

    
})();


function createPlayer(name) {
    const playerName = name;
    const playerMark = "o";

    return {playerName, playerMark}
};

function createComputer(getBoard) {
    const computerMark = "x";

    function chooseRandomPosition() { // returns an array of random open position
        const board = getBoard();

        const column = drawColumnIndex(board, "");
        const randomColumnIndex = Math.floor(Math.random() * column.length);

        const row = drawRowIndex(board[column[randomColumnIndex]], "");
        const randomRowIndex = Math.floor(Math.random() * row.length);

        return [column[randomColumnIndex], row[randomRowIndex]];

    }

    return {computerMark, chooseRandomPosition}
};

const player = createPlayer('Maru');
const computer = createComputer(() => Board.getBoardCopy());

function drawColumnIndex(arr, mark) {
  return arr
  .map((item, index) => {
    if (item.includes(mark)) return index
  })
  .filter(item => item !== undefined);
}

function drawRowIndex(arr, mark) {
  return arr
  .map((item, index) => {
    if (item === mark) return index
  })
  .filter(item => item !== undefined);
}


