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
        const indexesList = arr.map((item, index) => {
            if (item == "") return index;
        });
        const freePos = indexesList.filter(item => item !== undefined);
        let randomNum = Math.floor(Math.random() * freePos.length);

        return freePos[randomNum];
        
    }

    return {computerMark, choosePosition}
};

const playerMaru = createPlayer('Maru');
const playerComputer = createComputer();

