const Board = (function(){
    const btns = document.querySelectorAll(".cell");
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    let currentHandler = null;
    const winningPos = {
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

    function checkPos(playerMark) { // returns an array of  current positions
        const column = drawNestIndex(board, playerMark);
        const currentPos = [];

        if (column.length > 0) {
            for (let i = 0; i < column.length; i++) {
                currentPos.push([]);
                let squares = drawIndex(board[column[i]], playerMark);
                for (let j = 0; j < squares.length; j++) {
                    currentPos[i].push([column[i], squares[j]]);
                }

            }
        }
        return currentPos;
    }

    function isWinningPos(playerPos) { // returns true if winning position found

        const flatPlayerPos = playerPos.flat();
        
        for (let key in winningPos) {
            let matchCount = 0;
 
            for (let coord of winningPos[key]) {
                if (flatPlayerPos.some(pos => 
                    JSON.stringify(pos) === JSON.stringify(coord))) {
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

    const setPos = function(position, mark) {
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

                e.target.textContent = player1.playerMark;
                resolve(clickedCell);

                cleanupCellListeners();
            }

            for (let btn of btns) {
                btn.addEventListener("click", currentHandler);
            }
        }

        return new Promise(takeClick)
        .catch(reason => {
            return reason;
        })
    }

    function cleanupCellListeners() {
        if (currentHandler) {
            for (let btn of btns) {
                btn.removeEventListener("click", currentHandler);
            }

            currentHandler = null;
        }
    }

    function disUnDisButtons(startGame) {
        for (let btn of btns) {
            btn.disabled = false;
            if (!startGame) btn.disabled = true;
        } 
    }

    function resetBoard() {
        return board = [["", "", ""], ["", "", ""], ["", "", ""]];
    }
    

    return {setPos, checkPos, isWinningPos, isBoardEmpty, getBoardCopy,
         takeButtonInput, disUnDisButtons, resetBoard, cleanupCellListeners}
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
                    Board.setPos(currentMove, mark);
                    break;
                }
                
            } catch (e) {
                throw e;
        }
    } 
        console.log(currentMove);
        
    
}

    function checkWin(mark) {
        const checkCurrentPos = Board.checkPos(mark);
        const isWinPos = Board.isWinningPos(checkCurrentPos);
        if (isWinPos) {
                Board.disUnDisButtons(false);
                alert(`${mark} wins!`)
                return true;
        } else if (!Board.isBoardEmpty()) {

            alert("It's a draw!")
            return true;
        }

        return false;
    }

    async function gameOn() {
        if (isGameRunning) return;
        isGameRunning = true;
        while (true) {
            await currentTurn(Board.takeButtonInput, player1.playerMark);
            if (checkWin(player1.playerMark)) break;
            if (Board.isBoardEmpty()) {
                await currentTurn(computer.choosePosition,
                     computer.computerMark);
                if (checkWin(computer.computerMark)) break;
            }
        }
        isGameRunning = false; 
    }

    startButton.addEventListener("click", () => {
        Board.disUnDisButtons(true);
        gameOn();
    })

    resetButton.addEventListener("click", async () => {
        isGameRunning = false;  // Force stop any running game
        await new Promise(resolve => setTimeout(resolve, 100));
        Board.resetBoard();
        Board.cleanupCellListeners();
        Board.disUnDisButtons(true);

        const btns = document.querySelectorAll(".cell");
        btns.forEach(btn => btn.textContent = "");

        gameOn();
    })

    
})();


function createPlayer(name) {
    const playerName = name;
    const playerMark = "o";

    return {playerName, playerMark}
};

function createComputer(getBoard) {
    const computerMark = "x";

    function choosePosition() { // returns an array of open position indexes
        const board = getBoard();

        const mainArr = drawNestIndex(board, "");
        const randMainIndex = Math.floor(Math.random() * mainArr.length);

        const subArr = drawIndex(board[mainArr[randMainIndex]], "");
        const randSubIndex = Math.floor(Math.random() * subArr.length);

        return [mainArr[randMainIndex], subArr[randSubIndex]];

    }

    return {computerMark, choosePosition}
};

const player1 = createPlayer('Maru');
const computer = createComputer(() => Board.getBoardCopy());

function drawNestIndex(arr, mark) {
  return arr
  .map((item, index) => {
    if (item.includes(mark)) return index
  })
  .filter(item => item !== undefined);
}

function drawIndex(arr, mark) {
  return arr
  .map((item, index) => {
    if (item === mark) return index
  })
  .filter(item => item !== undefined);
}


