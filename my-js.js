const player1 = createPlayer('Maru');
const computer = createComputer();

const Board = (function(){
    const btns = document.querySelectorAll(".cell");
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
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

    function checkPos(playerMark) { // returns an array of  current positions
        const column = drawNestIndex(board, playerMark);
        const currentPos = [];

        if (column.length > 0) {
            for (let i = 0; i < column.length; i++) {
                let squares = drawIndex(board[column[i]], playerMark);
                for (let j = 0; j < squares.length; j++) {
                    currentPos.push([column[i], squares[j]]);
                }
                
            }
        }
        return currentPos;
    }

    function isWinningPos(playerPos) { // returns an array of winning positions or an empty array
        for (let key in winningPos) {
            if (JSON.stringify(winningPos[key]) === JSON.stringify(playerPos)) {
                console.log("ok");
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

            for (let btn of btns) {
                btn.addEventListener("click", function handler(e) {
                    const clickedCell = e.target.dataset.pos
                        .split("-")
                        .map(Number);

                    btns.forEach(b => b.removeEventListener("click", handler));

                    if (board[clickedCell[0]][clickedCell[1]] !== "") reject("wrong move");
                    else {
                        btn.textContent = player1.playerMark;
                        resolve(clickedCell);
                    }
                });
            }
        }

        return new Promise(takeClick)
        .catch(reason => {
            return reason;
        })
    }

    function disUnDisButtons(flag) {
        for (let btn of btns) {
            btn.disabled = false;
            if (!flag) btn.disabled = true;
        } 
    }

    function resetBoard() {
        board = board.map(item => item.map(item => item = ""));
    }
    

    return {setPos, checkPos, isWinningPos, isBoardEmpty, board,
         takeButtonInput, disUnDisButtons, resetBoard}
})();

const GameController = (function(){
    let gameOnFlag = true;
    let playerFlag = true;
    let computerFlag = true;
    const startButton = document.querySelector(".start-button");
    const resetButton = document.querySelector(".reset-button");


    async function currentTurn(move, mark, flag) {
        flag = true;
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

    function checkWin(mark, flag) {
        const checkCurrentPos = Board.checkPos(mark);
        const isWinPos = Board.isWinningPos(checkCurrentPos);
        if (isWinPos) {
                gameOnFlag = false;
                Board.disUnDisButtons(gameOnFlag);
                alert(`${mark} wins!`)
                return;
        } else if (!Board.isBoardEmpty()) {
            gameOnFlag = false;
            alert("It's a draw!")
            return;
        } else flag = false;
    }

    async function gameOn() {
        while (gameOnFlag) {
            await currentTurn(Board.takeButtonInput, player1.playerMark, playerFlag);
            checkWin(player1.playerMark, playerFlag);
            if (!gameOnFlag) break;
            if (Board.isBoardEmpty() && computerFlag) {
                currentTurn(computer.choosePosition,
                     computer.computerMark, computerFlag);
                checkWin(computer.computerMark, computerFlag);
                if (!gameOnFlag) break;
            }
        }
    }

    startButton.addEventListener("click", () => {
        Board.disUnDisButtons(gameOnFlag);
        gameOn();
    })

    resetButton.addEventListener("click", () => {
        Board.resetBoard();
        gameOnFlag = true;
        playerFlag = true;
        computerFlag = true;

        const btns = document.querySelectorAll(".cell");

        for (let btn of btns) {
            btn.textContent = "";
        }
    })

    
})();


function createPlayer(name) {
    const playerName = name;
    const playerMark = "o";

    return {playerName, playerMark}
};

function createComputer() {
    const computerMark = "x";

    function choosePosition() { // returns an array of open position indexes
  
        const mainArr = drawNestIndex(Board.board, "");
        const randMainIndex = Math.floor(Math.random() * mainArr.length);

        const subArr = drawIndex(Board.board[mainArr[randMainIndex]], "");
        const randSubIndex = Math.floor(Math.random() * subArr.length);

        return [mainArr[randMainIndex], subArr[randSubIndex]];

    }

    return {computerMark, choosePosition}
};

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


