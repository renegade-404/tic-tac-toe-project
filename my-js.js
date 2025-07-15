const player1 = createPlayer('Maru');
const computer = createComputer();

const Board = (function(){
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];
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
                let sortedSquares = squares.map(item => [column[i], item]);
                currentPos.push(sortedSquares);
            }
        }
        return currentPos;
    }

    function isWinningPos(playerPos) { // returns an array of winning positions or an empty array
        playerPos = playerPos.filter((item) => {
            for (let key in winningPos) {
                if (winningPos[key].toString() == item.toString()) return item;
            }
        })
        return playerPos.toString();
    }

    function isBoardEmpty() {
        return board.some(item => item.includes(""));
    }

    const setPos = function(position, mark) {
        board[position[0]].splice(position[1], 1, mark);
    }

    function clickingButtons() {
        const btns = document.querySelectorAll(".cell");

        for (let btn of btns) {
            btn.addEventListener("click", (e) => {
                console.log(e.target.dataset.pos);
            })
        }
    }

    clickingButtons();


    return {setPos, checkPos, isWinningPos, isBoardEmpty, board}
})();

const GameController = (function(){
    let gameOnFlag = true;
    let playerFlag = true;
    let computerFlag = true;


    function currentTurn(move, mark, flag) {
        flag = true;
        const currentMove = move();
        console.log(currentMove);
        Board.setPos(currentMove, mark);
    }

    function checkWin(mark, flag) {
        const checkCurrentPos = Board.checkPos(mark);
        const isWinPos = Board.isWinningPos(checkCurrentPos);
        if (isWinPos.length >= 1) {
                gameOnFlag = false;
                console.log(isWinPos);
        } else if (!Board.isBoardEmpty()) {
            gameOnFlag = false;
            console.log("It's a draw!")
        } else flag = false;
    }

    function gameOn() {
        while (gameOnFlag) {
            currentTurn(player1.takeInput, player1.playerMark, playerFlag);
            checkWin(player1.playerMark, playerFlag);
            if (Board.isBoardEmpty() && computerFlag) {
                currentTurn(computer.choosePosition,
                     computer.computerMark, computerFlag);
                checkWin(computer.computerMark, computerFlag);
            }
        }
    }

    // gameOn();
    
})();


function createPlayer(name) {
    const playerName = name;
    const playerMark = "o";

    function takeInput() {
        const move = prompt("Please choose your position accordingly to the scheme: row number,square number.")
        return move.split(",").map(item => +item);
    }

    return {playerName, playerMark, takeInput}
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


