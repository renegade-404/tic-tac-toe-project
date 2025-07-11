const Board = (function(){
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    const winningPositions = {
        1: [[0, 0,], [0, 1], [0, 2]],
        2: [1, [0, 1, 2]],
        3: [2, [0, 1, 2]],
    };

    function checkPos(playerMark) { // returns an array of  current positions
        const column = drawNestIndex(board, playerMark);
        let currentPos = [];

        if (column.length > 0) {
            for (let i = 0; i < column.length; i++) {
                let squares = drawIndex(board[column[i]], playerMark);
                let sortedSquares = squares.map(item => [column[i], item]);
                currentPos.push(sortedSquares);
            }
        }
        return currentPos;
    }

    const setPosition = function(position, mark) {
        board[position[0]].splice(position[1], 1, mark);
    }

    const checkForWin = function() {

    }

    return {setPosition, board}
})();


function createPlayer(name) {
    const playerName = name;
    const playerMark = "O";

    function takeInput(prompt) {
        return prompt;
    }

    return {playerName, playerMark, takeInput}
};

function createComputer() {
    const computerMark = "X";

    function choosePosition(arr) { // return an array of open position indexes
  
        function drawIndex(arr) {
            return arr
                .map((item, index) => {
                    if (Array.isArray(item)) {
                        if (item.includes("")) return index
                    } else if (item === "") return index
                })
                .filter(item => item !== undefined);
        }

        const mainArr = drawIndex(arr);
        const randMainIndex = Math.floor(Math.random() * mainArr.length);

        const subArr = drawIndex(arr[mainArr[randMainIndex]]);
        const randSubIndex = Math.floor(Math.random() * subArr.length);

        return [mainArr[randMainIndex], subArr[randSubIndex]];

    }

    return {computerMark, choosePosition}
};

const playerMaru = createPlayer('Maru');
const playerComputer = createComputer();

