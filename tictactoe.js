const readline = require('node:readline')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

// We're using a 4x4 matrix for the 3x3 game board
// to simplify index access and improve readability, avoiding the need for subtractions.
const EMPTY = ' '
const CIRCLE = "O"
const CROSS = "X"
const tictactoeBoard = [
    [EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY, EMPTY],
]


class MatrixInput {
    constructor(row, col) {
        this.row = row
        this.col = col
    }

    isEmpty() {
        return tictactoeBoard[this.row][this.col] === EMPTY
    }
}


const aiInputs = [
    // four corners of the board
    new MatrixInput(1, 1),
    new MatrixInput(1, 3),
    new MatrixInput(3, 1),
    new MatrixInput(3, 3),

    new MatrixInput(1, 2),
    new MatrixInput(2, 1),
    new MatrixInput(2, 2),
    new MatrixInput(2, 3),
    new MatrixInput(3, 2)
]


let isUserTurn = false
const userSymbol = CROSS
const aiSymbol = CIRCLE

function getWinner() {
    const containsEqualSymbols = (pattern) => {
        return (tictactoeBoard[pattern[0][0]][pattern[0][1]] === tictactoeBoard[pattern[1][0]][pattern[1][1]])
                && (tictactoeBoard[pattern[0][0]][pattern[0][1]] === tictactoeBoard[pattern[2][0]][pattern[2][1]])
                && (tictactoeBoard[pattern[0][0]][pattern[0][1]] !== EMPTY)
    }

    const returnWinnerName = (pattern) => {
        return tictactoeBoard[pattern[0][0]][pattern[0][1]] === userSymbol ? 'User' : 'AI'
    }


    const diagonal1 = [
        [1, 1],
        [2, 2],
        [3, 3],
    ]

    if (containsEqualSymbols(diagonal1)) {
        return returnWinnerName(diagonal1)
    }

    const diagonal2 = [
        [1, 3],
        [2, 2],
        [3, 1]
    ]

    if (containsEqualSymbols(diagonal2)) {
        return returnWinnerName(diagonal2)
    }

    const horizontal1 = [
        [1, 1],
        [1, 2],
        [1, 3]
    ]

    if (containsEqualSymbols(horizontal1)) {
        return returnWinnerName(horizontal1)
    }

    const horizontal2 = [
        [2, 1],
        [2, 2],
        [2, 3]
    ]

    if (containsEqualSymbols(horizontal2)) {
        return returnWinnerName(horizontal2)
    }

    const horizontal3 = [
        [3, 1],
        [3, 2],
        [3, 3]
    ]

    if (containsEqualSymbols(horizontal3)) {
        return returnWinnerName(horizontal3)
    }

    const vertical1 = [
        [1, 1],
        [2, 1],
        [3, 1]
    ]

    if (containsEqualSymbols(vertical1)) {
        return returnWinnerName(vertical1)
    }

    const vertical2 = [
        [1, 2],
        [2, 2],
        [3, 2]
    ]

    if (containsEqualSymbols(vertical2)) {
        return returnWinnerName(vertical2)
    }

    const vertical3 = [
        [1, 3],
        [2, 3],
        [3, 3]
    ]

    if (containsEqualSymbols(vertical3)) {
        return returnWinnerName(vertical3)
    }

}


function drawBoard() {
    console.log("\n\nTic Tac Toe Board::\n")
    
    for (let i = 1; i <= 3; i++) {
        let rowVal = ''
        for (let j = 1; j <= 3; j++) {
            rowVal += `|${tictactoeBoard[i][j]}` 
        }
        console.log(rowVal)
        console.log('-'.repeat(rowVal.length))
        
    }

    console.log("\n\n")
}

let totalAttempts = 9

function getPosForAIToWin() {
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            if (tictactoeBoard[i][j] !== EMPTY) continue

            tictactoeBoard[i][j] = aiSymbol
            const winner = getWinner()
            tictactoeBoard[i][j] = EMPTY

            if ("AI" === winner) {
                return new MatrixInput(i, j)
            }
        }
    }
}

function getPosToBlockUserVictory() {

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            if (tictactoeBoard[i][j] !== EMPTY) continue

            tictactoeBoard[i][j] = userSymbol
            const winner = getWinner()
            tictactoeBoard[i][j] = EMPTY

            if ("User" === winner) {
                return new MatrixInput(i, j)
            }
        }
    }
}


async function playTicTacToe() {
    console.log("AI is starting the game.")
    
    while (totalAttempts > 0) {
        
        if (!isUserTurn) {
            const aiInput = getPosForAIToWin() || getPosToBlockUserVictory() || aiInputs.find(matrixInput => matrixInput.isEmpty())
            if (aiInput) { 
                tictactoeBoard[aiInput.row][aiInput.col] = CIRCLE
            }
        } else {
            let userRow = 0, userCol = 0
            let userInputInvalid = false

            do {
                const userInput = await new Promise((resolve, _) => {
                    rl.question(`Please enter ${userInputInvalid ? 'valid ' : ''}row,col as input where you'd like to put ${userSymbol}. Ex: 1,2\n`, input => {
                        resolve(input)
                    })
                })
                
                if (userInput) {
                    userRow = parseInt(userInput.split(',')[0])
                    userCol = parseInt(userInput.split(',')[1])
                }
                userInputInvalid = true
            } while (userRow < 1 || userRow > 3 || userCol < 1 || userCol > 3 || tictactoeBoard[userRow][userCol] !== EMPTY)

            tictactoeBoard[userRow][userCol] = userSymbol
        }

        drawBoard()
        const winner = getWinner()
        if (winner) {
            return winner
        }

        isUserTurn = !isUserTurn
        totalAttempts--
    }
}

playTicTacToe()
    .then(winner => {
        winner && console.log(`${winner} has won!!`)
        console.log("\n\nGame Over!")
        console.log("Thank you for playing!\n\n")
    }).catch(err => {
        console.error(`${err} has occurred.`)
    }).finally(() => {
        rl.close()
    })