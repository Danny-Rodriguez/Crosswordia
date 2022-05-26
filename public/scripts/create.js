var clickMode = document.getElementById("clickMode")
// create a type mode for across and down
const dropdownContent = document.getElementsByClassName("dropdown-content")[0].children //get array of that div
var selectedCell = undefined
var size = undefined
// creates grid based on size
function drawGrid() {
  var cellSize = 50
  if (size === 5) {
    cellSize = 100
  }
  if (size === 10) {
    cellSize = 80
  }
  if (size === 15) {
    cellSize = 50
  }
  var crossGrid = document.getElementById("crossGrid")
  while (crossGrid.firstChild) {
    crossGrid.removeChild(crossGrid.firstChild)
  }
  crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`

  for (var i = 0; i < size * size; i++) {
    let cell = document.createElement("div")
    cell.className = "cell"
    cell.id = `${i + 1}`
    // cell.innerText = cell.id
    //
    cell.addEventListener("click", event => {
      if (clickMode.innerText === "box") {
        cell.style.background = "yellow"

        if (selectedCell != undefined && selectedCell !== cell) {
          selectedCell.style.background = "white"
        }
        selectedCell = cell
      } else if (clickMode.innerText === "type") {
        cell.style.background = "black"
        cell.innerText = ""
      }
    })
    crossGrid.append(cell)
  }
}

for (var i = 0; i < dropdownContent.length; i++) {
  let child = dropdownContent[i]
  child.addEventListener("click", event => {
    if (child.innerText === "5x5") {
      size = 5
    }
    if (child.innerText === "10x10") {
      size = 10
    }
    if (child.innerText === "15x15") {
      size = 15
    }
    drawGrid()
  })
}

clickMode.addEventListener("click", event => {
  // changing modes
  if (clickMode.innerText === "box") {
    clickMode.innerText = "type"
    // unselecting the cell
    selectedCell.style.background = "white"
  } else if (clickMode.innerText === "type") {
    clickMode.innerText = "box"
  }
  selectedCell = undefined
})

window.addEventListener("keydown", event => {
  if (selectedCell === undefined) {
    return
  }
  if (event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 122 && event.key.length === 1) {
    //talk about this
    selectedCell.innerText = event.key.toUpperCase()
    // This for loop selects the next cell across
    for (var i = parseInt(selectedCell.id) + 1; i <= size * size; i++) {
      let nextCell = document.getElementById(`${i}`)
      if (nextCell.style.background === "white" || nextCell.style.background === "") {
        selectedCell.style.background = "white"
        selectedCell = nextCell
        selectedCell.style.background = "yellow"
        break
      }
    }
  } else if (event.key === "Backspace") {
    let foundPrev = false
    for (var i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
      let prevCell = document.getElementById(`${i}`)
      if (prevCell.style.background === "white" || prevCell.style.background === "") {
        selectedCell.style.background = "white"
        selectedCell.innerText = ""
        selectedCell = prevCell
        selectedCell.style.background = "yellow"
        foundPrev = true
        break
      }
    }
    // could not find previous cell
    if (!foundPrev) {
      selectedCell.innerText = ""
    }
  }
  // Todo: Write code for selecting cell down. add a button. click functionality to change mode and text. Depending on mode it chooses which loop to run to select the next cell. Use if statements to determine which you're on
})
// think of how to assign a hint. Look at the NYT crossword puzzle for hints
// add css
