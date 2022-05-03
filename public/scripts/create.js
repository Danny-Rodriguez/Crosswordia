const dropdownContent = document.getElementsByClassName("dropdown-content")[0].children //get array of that div
const selectedCell = undefined
function drawGrid(size) {
  var cellSize = 50
  if (size === 5) {
    cellSize = 100
  }
  if (size === 10) {
    cellSize = 100
  }
  if (size === 15) {
    cellSize = 100
  }
  var crossGrid = document.getElementById("crossGrid")
  crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`

  for (var i = 0; i < size * size; i++) {
    let cell = document.createElement("div")
    cell.className = "cell"
    cell.id = `${i + 1}`
    cell.innerText = cell.id
    cell.addEventListener("click", event => {
      console.log(cell.id)
    })
    crossGrid.append(cell)
  }
}

for (var i = 0; i < dropdownContent.length; i++) {
  let child = dropdownContent[i]
  child.addEventListener("click", event => {
    if (child.innerText === "5x5") {
      drawGrid(5)
    }
    if (child.innerText === "10x10") {
      drawGrid(10)
    }
    if (child.innerText === "15x15") {
      drawGrid(15)
    }
  })
}
