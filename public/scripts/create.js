var clickMode = document.getElementById("clickMode")
var alphabet = /^[a-z]*$/i

// create a type mode for across and down
const dropdownContent = document.getElementsByClassName("dropdown-content")[0].children //get array of that div
var selectedCell = undefined
var size = undefined
var hintMapper = {}
var totalHints = 0
var hintsHidden = document.getElementById("hintsHidden")
var hintsForm = document.getElementById("hints")
var isEditMode = true
var theUrl
var userUrl

// creates grid based on size
function drawGrid() {
  var cellSize = 50
  if (size === 5) {
    cellSize = 100
  }
  if (size === 10) {
    cellSize = 80
    let footer = document.getElementById("footer")
    footer.className = "footerCrossword"
  }
  if (size === 15) {
    cellSize = 50
    let footer = document.getElementById("footer")
    footer.className = "footerCrossword"
  }
  var crossGrid = document.getElementById("crossGrid")
  while (crossGrid.firstChild) {
    crossGrid.removeChild(crossGrid.firstChild)
  }
  crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.border = `5px solid black`

  for (var i = 0; i < size * size; i++) {
    let cell = document.createElement("div")
    cell.className = `cell${size} position-relative`
    cell.id = `${i + 1}`
    cell.addEventListener("click", event => {
      if (!isEditMode) {
        return
      }
      //* Did not change button color
      if (clickMode.innerText === "Add a Box") {
        cell.style.background = "yellow"
        // clickMode.className = "button-50"

        if (selectedCell != undefined && selectedCell !== cell) {
          selectedCell.style.background = "white"
        }
        selectedCell = cell
      } else if (clickMode.innerText === "Activate Typing") {
        cell.style.background = "black"
        cell.innerText = ""
        // clickMode.className = "button-50-w"
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

    console.log(`Excuse me, I want this to work!`)
    drawGrid()
  })
}
//* This changed the color
clickMode.addEventListener("click", event => {
  // changing modes
  if (clickMode.innerText === "Add a Box") {
    clickMode.innerText = "Activate Typing"
    clickMode.className = "button-50-w"
    // unselecting the cell
    selectedCell.style.background = "white"
  } else if (clickMode.innerText === "Activate Typing") {
    clickMode.innerText = "Add a Box"
    clickMode.className = "button-50"
  }
  selectedCell = undefined
})

window.addEventListener("keydown", event => {
  if (selectedCell === undefined) {
    return
  }
  if (event.key.match(alphabet) && event.key.length === 1) {
    //talk about this
    selectedCell.innerHTML = `<p class="position-absolute pLetter">${event.key.toUpperCase()}</p>`
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
})

var hintButton = document.getElementById("hintBtn")
hintButton.addEventListener("click", event => {
  if (selectedCell !== undefined) {
    selectedCell.style.background = "white"
    selectedCell = undefined
  }

  let crossGrid = document.getElementById("crossGrid")
  if (crossGrid.children.length === 0) {
    alert("Hey you gotta choose a Crossword size first!")
    return
  }
  for (let i = 0; i < crossGrid.childNodes.length; i++) {
    if (crossGrid.childNodes[i].innerText === "") {
      alert("Hey you forgot to fill out the whole crossword!")
      return
    }
  }

  var hintsAcross = document.getElementById("hints-input-across")
  var hintsDown = document.getElementById("hints-input-down")

  handleHints()
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
    pElement.style.position = "absolute"
    pElement.className = `pNumber${size} pCell`
    pElement.innerText = `${i}`
    cell.appendChild(pElement)
    // add a hint for submission
    if (hintObj.isWordAcross) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:across`)
      hintInput.setAttribute("placeholder", `${i} Across`)
      // hintsAcross.appendChild("<h3>Across</h3>")
      let h3across = document.getElementById("h3-across")
      h3across.innerText = "Across"
      hintsAcross.appendChild(hintInput)
      hintsHidden.appendChild(hintInput.cloneNode(true))
      // hintsForm.appendChild(hintInput)
    }
    if (hintObj.isWordDown) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:down`)
      hintInput.setAttribute("placeholder", `${i} Down`)
      // hintsDown.innerHTML = "<h3>Down</h3>"
      let h3down = document.getElementById("h3-down")
      h3down.innerText = "Down"
      hintsDown.appendChild(hintInput)
      hintsHidden.appendChild(hintInput.cloneNode(true))
      // hintsForm.appendChild(hintInput)
    }
  }

  // let submitBtn = document.createElement("button")
  let submitBtn = document.getElementById("hintSubmit")
  submitBtn.style.display = "block"
  // submitBtn.id = "hintSubmit"
  // // submitBtn.className = "button-82-pushable"
  // submitBtn.innerText = "submit"
  submitBtn.addEventListener("click", async () => {
    // let hintValues = hintsForm.children
    // let hintValues = hintsHidden.children
    // for (var j = 0; j < hintValues.length; j++) {
    //   let hintValue = hintValues[j]
    //   let hintInfo = hintValue.name.split(":")
    //   let hintNumber = parseInt(hintInfo[0])
    //   if (hintInfo[1] === "across") {
    //     hintMapper[hintNumber].acrossHint = hintValue.value
    //   }
    //   if (hintInfo[1] === "down") {
    //     hintMapper[hintNumber].downHint = hintValue.value
    //   }
    // }

    let hintValuesAcross = hintsAcross.children
    for (let g = 1; g < hintValuesAcross.length; g++) {
      let hintValue = hintValuesAcross[g]
      let hintInfo = hintValue.name.split(":")
      let hintNumber = parseInt(hintInfo[0])
      if (hintInfo[1] === "across") {
        hintMapper[hintNumber].acrossHint = hintValue.value
      }
    }

    let hintValuesDown = hintsDown.children
    for (let n = 1; n < hintValuesDown.length; n++) {
      let hintValue = hintValuesDown[n]
      let hintInfo = hintValue.name.split(":")
      let hintNumber = parseInt(hintInfo[0])
      if (hintInfo[1] === "down") {
        hintMapper[hintNumber].downHint = hintValue.value
      }
    }

    for (const key in hintMapper) {
      if (hintMapper[key].acrossHint === "" || hintMapper[key].downHint === "") {
        alert("Oops! You forgot to fill out all the hints!")
        return
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
    console.log(example)
    const test = await fetch("/crossword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(example)
    })
      .then(res => {
        // console.log(res)
        theUrl = res.url
      })
      .catch(err => {
        console.error(err)
      })
    document.location = `${theUrl}`
  })
  // hintsHidden.appendChild(submitBtn)
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
