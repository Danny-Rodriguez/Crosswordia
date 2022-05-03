var clickMode = document.getElementById("clickMode")
const dropdownContent = document.getElementsByClassName("dropdown-content")[0].children //get array of that div
var selectedCell = undefined
var size = undefined
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
    cell.addEventListener("click", event => {
      if (clickMode.innerText === "box") {
        cell.style.background = "white"
        cell.innerText = ""
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
  if (clickMode.innerText === "box") {
    clickMode.innerText = "type"
  } else if (clickMode.innerText === "type") {
    clickMode.innerText = "box"
  }
})

window.addEventListener("keydown", event => {
  if (selectedCell === undefined) {
    return
  }
  selectedCell.innerText = event.key
  // let nextCell = undefined
  for (var i = parseInt(selectedCell.id) + 1; i <= size * size; i++) {
    let currentCell = document.getElementById(`${i}`)
    if (currentCell.style.background === "white" || currentCell.style.background === "") {
      selectedCell = currentCell
      break
    }
  }
})
