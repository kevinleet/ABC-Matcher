let $mainContainer = $('.main-container')
let $gameBoard = $('.game-board')
let $clickCounter = $('#click-counter')

// Array to hold the letters of each flash card 
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

// Function to generate an array of 3 pairs of unique letters
function generateLetters() {
    let letterArray = []
    while (letterArray.length < 8) {
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)]
        if (!letterArray.includes(letter)) {
            letterArray.push(letter)
            letterArray.push(letter)
        }
    }
    let shuffledArray = letterArray.sort(() => Math.random() -0.5)
    return shuffledArray
}

// Function to generate game board, using random letter array from calling generateLetters()
function generateBoard() {
    let letterArray = generateLetters()
    let id = 1
    for (const letter of letterArray) {
        $gameBoard.append(
            `<button class="card" id="card${id}" letter="${letter}"><img src="./images/blank.jpg"/></button>`
        )
        id++
    }
}

// Declare variables to keep track of number of matches, clicks, and game state
let matchCount = 0
let clickCount = 0
const gameState = {
    numOfCardsFaceUp: 0,
    firstClickedId: null,
    firstClickedLetter: null,
    lastClickedId: null,
    lastClickedLetter: null,
}

// Function to reset the game state
function resetGameState() {
    gameState.numOfCardsFaceUp = 0
    gameState.firstClickedId = null
    gameState.firstClickedLetter = null
    gameState.lastClickedId = null
    gameState.lastClickedLetter = null
}

// Function to start/reset game
function resetGame() {
    $gameBoard.empty()
    resetGameState()
    generateBoard()
    removeCardEventHandlers()
    addCardEventHandlers()
    matchCount = 0
    clickCount = 0
    $clickCounter.text(`${clickCount}`)
}

// Event listener for div elements within gameBoard
function addCardEventHandlers() {
    $gameBoard.on('click', 'button', function () {
        let id = $(this).attr("id")
        let letter = $(this).attr("letter")
        handleCardClick(id, letter)
    })
}

// Function to remove event handlers 
function removeCardEventHandlers() {
    $gameBoard.off('click', 'button')
}

// Function to handle card click event
function handleCardClick(id, letter) {
    let $card = $(`#${id}`)
    if (gameState.numOfCardsFaceUp == 0) {
        $card.children().attr("src", `./images/${letter}.jpg`)
        gameState.numOfCardsFaceUp++
        gameState.firstClickedId = id
        gameState.firstClickedLetter = letter
        clickCount++
        $clickCounter.text(`${clickCount}`)
    } else if (gameState.numOfCardsFaceUp == 1) {
        $card.children().attr("src", `./images/${letter}.jpg`)
        gameState.lastClickedId = id
        gameState.lastClickedLetter = letter
        if (gameState.firstClickedId == gameState.lastClickedId){
            return
        }
        clickCount++
        $clickCounter.text(`${clickCount}`)
        let $firstClicked = $(`#${gameState.firstClickedId}`)
        let $lastClicked = $(`#${gameState.lastClickedId}`)
        if (gameState.firstClickedLetter == gameState.lastClickedLetter) {
            removeCardEventHandlers()
            setTimeout(() => {
                $firstClicked.prop("disabled", "true")
                $lastClicked.prop("disabled", "true")
                resetGameState()
                addCardEventHandlers()
                matchCount++
                if (matchCount >= 4) {
                    let value = confirm(`You matched all cards in ${clickCount} clicks! Play again?`)
                    if (value) {
                        resetGame()
                    }
                }
            }, 1000)
        } else {
            removeCardEventHandlers()
            setTimeout(() => {
                $firstClicked.children().attr("src", "./images/blank.jpg")
                $lastClicked.children().attr("src", "./images/blank.jpg")
                resetGameState()
                addCardEventHandlers()
            }, 1000)
        }
    }
}

resetGame()