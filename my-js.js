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

    function choosePosition(arr) {
  
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

