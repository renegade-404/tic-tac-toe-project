const Board = (function(){ // handles operations on the inputs and cells; returns information
    // to the gameController about each player's inputs and whether there is a winner or not
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

    function getBoardCopy() { // for access to the current state of the board
        return board.map(column => [...column]);
    }

    function returnPositions(playerMark) { // returns an array of  current positions
        const rowsWithCells = drawRowIndex(board, playerMark);
        const currentPositions = [];

        if (rowsWithCells.length > 0) { 
            for (let i = 0; i < rowsWithCells.length; i++) {
                currentPositions.push([]); // pushes empty row for coordinates
                let cells = drawCellIndex(board[rowsWithCells[i]], playerMark); // returns indexes with a mark
                for (let j = 0; j < cells.length; j++) {
                    currentPositions[i].push([rowsWithCells[i], cells[j]]); // pushes coordinates into the row
                }

            }
        }
        return currentPositions; // returns an array [[row[[position]], row[[position]], row[[position]]]
    }

    function checkIfWinningPosition(playerPosition) { // returns true if winning position is found
        const flatPlayerPosition = playerPosition.flat();
        
        for (let key in winningPositions) {
            let matchCount = 0; // to count found matching win coordinates
 
            for (let winCoordination of winningPositions[key]) {
                if (flatPlayerPosition.some(pos => 
                    JSON.stringify(pos) === JSON.stringify(winCoordination))) { // compare arrays
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

    function setPosition(position, mark) { // add a position into the board;
        // if computer's turn - insert computer's mark
        board[position[0]].splice(position[1], 1, mark);
        if (mark == computer.computerMark) {
            const cell = document.querySelector(`[data-pos='${position[0]}-${position[1]}']`);
            cell.textContent = mark;
        }
    }

    function takeButtonInput() { // handles player's click inputs
        function takeClick(resolve, reject) {
            currentHandler = function handleCellClick(e) {
                const clickedCell = e.target.dataset.pos.split("-").map(Number);

                const column = clickedCell[0];
                const col = clickedCell[1];

                if (Board.getBoardCopy()[column][col] !== "") { // reject if occupied position
                    reject("wrong move");
                    return
                }

                e.target.textContent = player.playerMark;
                resolve(clickedCell);

                cleanupCellsListeners(); // remove eventListener from the button
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

            currentHandler = null; // reset
        }
    }

    function disableCellsButtons(gameFinished) { // disables buttons depending of gameFinished status
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

const GameController = (function(){ // controls game logic; handles game start and reset;
    // 
    let isGameRunning = false;
    const startButton = document.querySelector(".start-button");
    const resetButton = document.querySelector(".reset-button");


    async function currentTurn(move, mark) { // sets a move on the board if not rejected in takeButtonInput
        let currentMove;
        while (true) {
            try {
                currentMove = await move();
                if (currentMove == "wrong move") {
                    continue // loops until the right move is chosen
                } else {
                    Board.setPosition(currentMove, mark);
                    break;
                }
                
            } catch (e) {
                throw e;
        }
    }   
}

    function checkIfWinOrDraw(mark) {
        // returns true if wining position found or the board is full
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

    async function gameStart() { // runs the game in turns
        if (isGameRunning) return;
        isGameRunning = true;
        while (true) {
            await currentTurn(Board.takeButtonInput, player.playerMark);
            if (checkIfWinOrDraw(player.playerMark)) break;
            if (Board.isBoardEmpty()) {
                await currentTurn(computer.chooseRandomPosition,
                     computer.computerMark);
                if (checkIfWinOrDraw(computer.computerMark)) break;
            }
        }
        isGameRunning = false; 
    }

    startButton.addEventListener("click", () => { // enable start button
        Board.disableCellsButtons(false);
        gameStart();
    })

    resetButton.addEventListener("click", async () => { // enable reset button;
        // stops the game, resets the board and disables buttons; removes evenListeners from the cells
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

    function chooseRandomPosition() { // returns a random position coordinates from the open positions
        const board = getBoard();

        const row = drawRowIndex(board, "");
        const randomRowIndex = Math.floor(Math.random() * row.length);

        const column = drawCellIndex(board[row[randomRowIndex]], "");
        const randomCellIndex = Math.floor(Math.random() * column.length);

        return [row[randomRowIndex], column[randomCellIndex]];

    }

    return {computerMark, chooseRandomPosition}
};

const player = createPlayer('Maru');
const computer = createComputer(() => Board.getBoardCopy());

function drawRowIndex(arr, mark) { // finds a row that includes provided mark
  return arr
  .map((item, index) => {
    if (item.includes(mark)) return index
  })
  .filter(item => item !== undefined);
}

function drawCellIndex(arr, mark) { // returns a cell that includes provided mark
  return arr
  .map((item, index) => {
    if (item === mark) return index
  })
  .filter(item => item !== undefined);
}


