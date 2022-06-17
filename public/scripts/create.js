// import Confirmation from "../../models/Confirmation"
// const mongoose = require("mongoose")
// const conn = await mongoose.connect(process.env.MONGO_URI, {})
// const connectDB = require("./config/db")
// console.log(connectDB)

// const { json } = require("express")

var clickMode = document.getElementById("clickMode")

// create a type mode for across and down
const dropdownContent = document.getElementsByClassName("dropdown-content")[0].children //get array of that div
var selectedCell = undefined
var size = undefined
var hintMapper = {}
var totalHints = 0
var hintsForm = document.getElementById("hints")
var isEditMode = true

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
      if (!isEditMode) {
        return
      }
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

var hintButton = document.getElementById("hintBtn")
hintButton.addEventListener("click", event => {
  if (selectedCell !== undefined) {
    selectedCell.style.background = "white"
    selectedCell = undefined
  }

  handleHints()
  // console.log(hintMapper)
  // clickMode.removeEventListener("click")
  // window.removeEventListener("keydown")
  isEditMode = false
  // hide unnecessary buttons
  clickMode.style.display = "none"
  let sizeBox = document.getElementsByClassName("dropdown")[0]
  sizeBox.style.display = "none"
  hintButton.style.display = "none"
  // iterating over each hint and updating page
  for (var i = 1; i <= totalHints; i++) {
    let hintObj = hintMapper[i]
    // update cell with hint Number
    let cell = document.getElementById(`${hintObj.cellId}`)
    let pElement = document.createElement("p")
    pElement.style.position = "relative"
    pElement.style.left = "-50"
    pElement.style.top = "-30"
    pElement.style.fontSize = 20
    pElement.innerText = `${i}`
    cell.appendChild(pElement)
    // add a hint for submission
    if (hintObj.isWordAcross) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:across`)
      hintInput.setAttribute("placeholder", `${i} Across`)
      hintsForm.appendChild(hintInput)
    }
    if (hintObj.isWordDown) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:down`)
      hintInput.setAttribute("placeholder", `${i} Down`)
      hintsForm.appendChild(hintInput)
    }
  }
  // adding submit button to form
  let submitBtn = document.createElement("button")
  // submitBtn.setAttribute("type", "submit")
  // submitBtn.setAttribute("value", "Submit")
  submitBtn.id = "hintSubmit"
  submitBtn.innerText = "submit"
  submitBtn.addEventListener("click", async () => {
    let hintValues = hintsForm.children
    for (var j = 0; j < hintValues.length; j++) {
      let hintValue = hintValues[j]
      let hintInfo = hintValue.name.split(":")
      let hintNumber = parseInt(hintInfo[0])
      if (hintInfo[1] === "across") {
        hintMapper[hintNumber].acrossHint = hintValue.value
      }
      if (hintInfo[1] === "down") {
        hintMapper[hintNumber].downHint = hintValue.value
      }
    }
    let solutionStr = ""
    for (var k = 1; k <= size * size; k++) {
      let tempCell = document.getElementById(`${k}`)
      if (tempCell.style.background === "black") {
        solutionStr += "!"
      } else {
        solutionStr += tempCell.innerText.charAt(0)
      }
    }
    const example = {
      size: size,
      solution: solutionStr,
      hints: hintMapper
    }
    const test = await fetch("/crossword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(example)
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  })

  hintsForm.appendChild(submitBtn)
})

function handleHints() {
  for (let i = 1; i <= size * size; i++) {
    let cell = document.getElementById(`${i}`)
    // skipping black cells since they are not part of a word
    if (cell.style.background === "black") {
      continue
    }
    let cellAbove = i >= 1 && i <= size ? undefined : document.getElementById(`${i - size}`)
    let cellBelow = i >= size * (size - 1) && i <= size * size ? undefined : document.getElementById(`${i + size}`) //this is bottom row bec 20 - 25
    let cellRight = i % size == 0 ? undefined : document.getElementById(`${i + 1}`)
    let cellLeft = i % size == 1 ? undefined : document.getElementById(`${i - 1}`)
    // checking if new hint found
    let newHint = {}
    let isNewHint = false
    // checking if word is down: must not have cell above, but must have cell below
    if ((cellAbove === undefined || cellAbove.style.background === "black") && cellBelow !== undefined && cellBelow.style.background !== "black") {
      isNewHint = true
      newHint.cellId = i
      newHint.isWordDown = true
    }
    // checking if word exists across: must not have cell to left, but must have cell to right
    if ((cellLeft === undefined || cellLeft.style.background === "black") && cellRight !== undefined && cellRight.style.background !== "black") {
      isNewHint = true
      newHint.cellId = i
      newHint.isWordAcross = true
    }
    // checking if current cell is a hint or not
    if (isNewHint) {
      totalHints++
      hintMapper[totalHints] = newHint
    }
  }
}
