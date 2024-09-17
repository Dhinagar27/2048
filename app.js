document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('#score')
  const resultDisplay = document.querySelector('#result')
  const width = 4
  let squares = []
  let score = 0
  
  // Create the playing board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.innerHTML = 0
      gridDisplay.appendChild(square)
      squares.push(square)
    }
  }

  createBoard()

  // Generate a new number
  function generate() {
    const randomNumber = Math.floor(Math.random() * squares.length)
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2
    } else {
      generate() // Recursively generate a new number if the square is already filled
    }
  }

  generate()  // Generate two numbers initially
  generate()

  // Move right
  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML)
        ]

        let filteredRow = row.filter(num => num) // Filter out the zeroes
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = zeros.concat(filteredRow) // Add zeros to the front (for right movement)

        squares[i].innerHTML = newRow[0]
        squares[i + 1].innerHTML = newRow[1]
        squares[i + 2].innerHTML = newRow[2]
        squares[i + 3].innerHTML = newRow[3]
      }
    }
  }

  // Move left
  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML)
        ]

        let filteredRow = row.filter(num => num) // Filter out the zeroes
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = filteredRow.concat(zeros) // Add zeros to the end (for left movement)

        squares[i].innerHTML = newRow[0]
        squares[i + 1].innerHTML = newRow[1]
        squares[i + 2].innerHTML = newRow[2]
        squares[i + 3].innerHTML = newRow[3]
      }
    }
  }

  // Move down
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML)
      ]

      let filteredColumn = column.filter(num => num) // Filter out the zeroes
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = zeros.concat(filteredColumn) // Add zeros to the top (for down movement)

      squares[i].innerHTML = newColumn[0]
      squares[i + width].innerHTML = newColumn[1]
      squares[i + width * 2].innerHTML = newColumn[2]
      squares[i + width * 3].innerHTML = newColumn[3]
    }
  }

  // Move up
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML)
      ]

      let filteredColumn = column.filter(num => num) // Filter out the zeroes
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeros) // Add zeros to the bottom (for up movement)

      squares[i].innerHTML = newColumn[0]
      squares[i + width].innerHTML = newColumn[1]
      squares[i + width * 2].innerHTML = newColumn[2]
      squares[i + width * 3].innerHTML = newColumn[3]
    }
  }

  // Combine row values if two adjacent cells have the same value
  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
        squares[i].innerHTML = combinedTotal
        squares[i + 1].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
    checkForWin()
  }

  // Combine column values if two adjacent cells have the same value
  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
        squares[i].innerHTML = combinedTotal
        squares[i + width].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
    checkForWin()
  }

  // Check for a win (e.g., a tile reaches 2048)
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = 'You WIN!'
        document.removeEventListener('keydown', control) // Stop further movements
      }
    }
  }

  // Check for game over when no zeros are present and no more valid moves
  function checkForGameOver() {
    let zeros = squares.filter(square => square.innerHTML == 0).length
    if (zeros === 0) {
      let noMovesLeft = true
      for (let i = 0; i < squares.length - 1; i++) {
        if (squares[i].innerHTML == squares[i + 1].innerHTML ||
            squares[i].innerHTML == squares[i + width]?.innerHTML) {
          noMovesLeft = false
          break
        }
      }
      if (noMovesLeft) {
        resultDisplay.innerHTML = 'You LOSE'
        document.removeEventListener('keydown', control)
      }
    }
  }

  // Assign functions to key presses
  function control(e) {
    if (e.key === 'ArrowLeft') {
      keyLeft()
    } else if (e.key === 'ArrowRight') {
      keyRight()
    } else if (e.key === 'ArrowUp') {
      keyUp()
    } else if (e.key === 'ArrowDown') {
      keyDown()
    }
    checkForGameOver()
  }

  document.addEventListener('keydown', control)

  function keyLeft() {
    moveLeft()
    combineRow()
    moveLeft()
    generate()
  }

  function keyRight() {
    moveRight()
    combineRow()
    moveRight()
    generate()
  }

  function keyUp() {
    moveUp()
    combineColumn()
    moveUp()
    generate()
  }

  function keyDown() {
    moveDown()
    combineColumn()
    moveDown()
    generate()
  }

  // Add colors based on the tile values
  function addColours() {
    squares.forEach(square => {
      let value = parseInt(square.innerHTML)
      square.style.backgroundColor = value == 0 ? '#afa192' :
        value == 2 ? '#eee4da' :
        value == 4 ? '#ede0c8' :
        value == 8 ? '#f2b179' :
        value == 16 ? '#f59563' :
        value == 32 ? '#f67c5f' :
        value == 64 ? '#f65e3b' :
        value == 128 ? '#edcf72' :
        value == 256 ? '#edcc61' :
        value == 512 ? '#edc850' :
        value == 1024 ? '#edc53f' :
        value == 2048 ? '#edc22e' : '#3c3a32' // Colors for tiles
      })
    }
  
    // Continuously update the colors
    let myTimer = setInterval(addColours, 50)
  
    // Call checkForGameOver after each move to verify if the game is over
    function checkForGameOver() {
      let zeros = squares.filter(square => square.innerHTML == 0).length
      if (zeros === 0) {
        let noMovesLeft = true
        for (let i = 0; i < squares.length; i++) {
          // Check for possible moves in rows
          if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
            noMovesLeft = false
            break
          }
          // Check for possible moves in columns
          if (i < 12 && squares[i].innerHTML === squares[i + width].innerHTML) {
            noMovesLeft = false
            break
          }
        }
        if (noMovesLeft) {
          resultDisplay.innerHTML = 'You LOSE'
          document.removeEventListener('keydown', control)
        }
      }
    }
  
    // Assign functions to key presses
    function control(e) {
      if (e.key === 'ArrowLeft') {
        keyLeft()
      } else if (e.key === 'ArrowRight') {
        keyRight()
      } else if (e.key === 'ArrowUp') {
        keyUp()
      } else if (e.key === 'ArrowDown') {
        keyDown()
      }
      checkForGameOver()
    }
  
    document.addEventListener('keydown', control)
  
    function keyLeft() {
      moveLeft()
      combineRow()
      moveLeft()
      generate()
      checkForGameOver()
    }
  
    function keyRight() {
      moveRight()
      combineRow()
      moveRight()
      generate()
      checkForGameOver()
    }
  
    function keyUp() {
      moveUp()
      combineColumn()
      moveUp()
      generate()
      checkForGameOver()
    }
  
    function keyDown() {
      moveDown()
      combineColumn()
      moveDown()
      generate()
      checkForGameOver()
    }
  })
  
