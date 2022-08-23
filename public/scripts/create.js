const clickMode = document.getElementById("clickMode")
const alphabet = /^[a-z]*$/i
let selectedCell = undefined
let size = undefined
let hintMapper = {}
let totalHints = 0
let isEditMode = true
let theUrl

// creates grid based on size
function drawGrid() {
  const footer = document.getElementById("footer")
  let cellSize
  if (size === 5) {
    cellSize = 100
  }
  if (size === 10) {
    cellSize = 75
    footer.className = "footerCrossword"
  }
  if (size === 15) {
    cellSize = 50
    footer.className = "footerCrossword"
  }
  const crossGrid = document.getElementById("crossGrid")
  while (crossGrid.firstChild) {
    crossGrid.removeChild(crossGrid.firstChild)
  }
  crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
  crossGrid.style.border = `5px solid black`

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div")
    cell.className = `cell${size} position-relative`
    cell.id = `${i + 1}`
    cell.addEventListener("click", event => {
      if (!isEditMode) {
        return
      }
      //* Did not change button color
      if (clickMode.textContent === "Add a Box") {
        cell.style.background = "yellow"

        if (selectedCell != undefined && selectedCell !== cell) {
          selectedCell.style.background = "white"
        }
        selectedCell = cell
      } else if (clickMode.textContent === "Activate Typing") {
        cell.style.background = "black"
        cell.textContent = ""
      }
    })
    crossGrid.append(cell)
  }
}

const sizeButtons = document.getElementsByClassName("sizeButtons")[0].children
for (let i = 0; i < sizeButtons.length; i++) {
  const child = sizeButtons[i]
  child.addEventListener("click", event => {
    document.getElementById("chooseH1").style.setProperty("display", "none", "important")
    if (child.textContent === "5x5") {
      size = 5
    }
    if (child.textContent === "10x10") {
      size = 10
    }
    if (child.textContent === "15x15") {
      size = 15
    }
    // document.getElementById("thesaurus").style.display = "block"
    document.getElementById("thesaurus").classList.remove("d-none")
    document.getElementById("boxAndFinish").className = "d-flex flex-column"
    crossGrid.style.display = "grid"

    drawGrid()
  })
}

//* This changed the color
clickMode.addEventListener("click", event => {
  // changing modes
  if (clickMode.textContent === "Add a Box") {
    clickMode.textContent = "Activate Typing"
    clickMode.className = "button-50-w"
    // unselecting the cell
    selectedCell.style.background = "white"
  } else if (clickMode.textContent === "Activate Typing") {
    clickMode.textContent = "Add a Box"
    clickMode.className = "button-50"
  }
  selectedCell = undefined
})

window.addEventListener("keydown", event => {
  const wordInput = document.getElementById("word")
  if (selectedCell === undefined) {
    return
  }
  if (wordInput !== document.activeElement && event.key.match(alphabet) && event.key.length === 1) {
    const pLetter = document.createElement("p")
    pLetter.className = `position-absolute pLetter${size}`
    pLetter.textContent = `${event.key.toUpperCase()}`
    selectedCell.appendChild(pLetter)

    // This for loop selects the next cell across
    for (let i = parseInt(selectedCell.id) + 1; i <= size * size; i++) {
      let nextCell = document.getElementById(`${i}`)
      if (nextCell.style.background === "white" || nextCell.style.background === "") {
        selectedCell.style.background = "white"
        selectedCell = nextCell
        selectedCell.style.background = "yellow"
        break
      }
    }
  } else if (wordInput !== document.activeElement) {
    // } else if (wordInput !== document.activeElement && event.code === "Backspace") {
    // console.log(event.repeat)
    let foundPrev = false
    for (let i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
      let prevCell = document.getElementById(`${i}`)
      if (prevCell.style.background === "white" || prevCell.style.background === "") {
        selectedCell.style.background = "white"
        selectedCell.textContent = ""
        selectedCell = prevCell
        selectedCell.style.background = "yellow"
        foundPrev = true
        break
      }
    }
    // This is for the first cell
    if (!foundPrev) {
      selectedCell.textContent = ""
    }
  }
})

const dictSubmit = document.getElementById("dictSubmit")
dictSubmit.addEventListener("click", async event => {
  event.preventDefault()
  const word = document.getElementById("word")
  const listDict = document.getElementById("listDict")
  const toFetch = await fetch(`/dictionary`, {
    method: "POST",
    body: JSON.stringify({
      word: word.value
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response)
    })
    .then(function (data) {
      let dataArr = data[0].meta.syns.flat().slice(0, 10)
      console.log(dataArr)

      //** Helper Function
      function createDictionaryList(entry) {
        const li = document.createElement("li")
        li.textContent = entry
        return li
      }

      function removeAllChildNodes(parent) {
        while (parent.firstChild) {
          parent.removeChild(parent.firstChild)
        }
      }

      if (listDict.childElementCount >= 10) {
        removeAllChildNodes(listDict)
      }

      for (let i = 0; i < dataArr.length; i++) {
        listDict.appendChild(createDictionaryList(`${dataArr[i]}`))
      }
    })
    .catch(function (error) {
      console.warn("Something went wrong.", error)
    })
})

let hintButton = document.getElementById("hintBtn")
hintButton.addEventListener("click", event => {
  if (selectedCell !== undefined) {
    selectedCell.style.background = "white"
    selectedCell = undefined
  }

  let crossGrid = document.getElementById("crossGrid")
  for (let i = 0; i < crossGrid.childNodes.length; i++) {
    if (crossGrid.childNodes[i].textContent === "" && crossGrid.childNodes[i].style.background !== "black") {
      GrowlNotification.notify({
        title: "Whoops!",
        description: "You forgot to fill out the whole crossword!",
        image: {
          visible: true,
          customImage: "../img/warning-outline.svg"
        },
        type: "warning",
        position: "top-center",
        closeTimeout: 3000
      })
      return
    }
  }

  const hintsAcross = document.getElementById("hints-input-across")
  const hintsDown = document.getElementById("hints-input-down")

  handleHints()
  isEditMode = false
  // hide unnecessary buttons
  clickMode.style.display = "none"
  // document.querySelector(".sizeButtons").style.display = "none"
  document.querySelector(".sizeButtons").style.setProperty("display", "none", "important")
  document.querySelector(".wrapper").style.marginTop = "inherit"
  hintButton.style.display = "none"
  // iterating over each hint and updating page
  for (let i = 1; i <= totalHints; i++) {
    let hintObj = hintMapper[i]
    // update cell with hint Number
    let cell = document.getElementById(`${hintObj.cellId}`)
    let pElement = document.createElement("p")
    pElement.style.position = "absolute"
    pElement.className = `pNumber${size} pCell`
    pElement.textContent = `${i}`
    cell.appendChild(pElement)
    // add a hint for submission
    if (hintObj.isWordAcross) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:across`)
      hintInput.setAttribute("placeholder", `${i} Across`)
      hintsAcross.appendChild(hintInput)
    }
    if (hintObj.isWordDown) {
      let hintInput = document.createElement("input")
      hintInput.setAttribute("type", "text")
      hintInput.setAttribute("name", `${i}:down`)
      hintInput.setAttribute("placeholder", `${i} Down`)
      hintsDown.appendChild(hintInput)
    }
  }
  const hintsForm = document.getElementById("hints")
  hintsForm.classList.remove("d-none")

  let submitBtn = document.getElementById("hintSubmit")
  submitBtn.addEventListener("click", async () => {
    let hintValuesAcross = hintsAcross.children
    for (let i = 1; i < hintValuesAcross.length; i++) {
      let hintValue = hintValuesAcross[i]
      let hintInfo = hintValue.name.split(":")
      let hintNumber = parseInt(hintInfo[0])
      if (hintInfo[1] === "across") {
        hintMapper[hintNumber].acrossHint = hintValue.value
      }
    }

    let hintValuesDown = hintsDown.children
    for (let i = 1; i < hintValuesDown.length; i++) {
      let hintValue = hintValuesDown[i]
      let hintInfo = hintValue.name.split(":")
      let hintNumber = parseInt(hintInfo[0])
      if (hintInfo[1] === "down") {
        hintMapper[hintNumber].downHint = hintValue.value
      }
    }

    for (const key in hintMapper) {
      if (hintMapper[key].acrossHint === "" || hintMapper[key].downHint === "") {
        GrowlNotification.notify({
          title: "Whoops!",
          description: "You forgot to fill out all the hints!",
          image: {
            visible: true,
            customImage: "../img/warning-outline.svg"
          },
          type: "warning",
          position: "top-center",
          closeTimeout: 3000
        })
        return
      }
    }

    GrowlNotification.notify({
      title: "Submitted Sucessfully!",
      image: {
        visible: true,
        customImage: "../img/info-outline.svg"
      },
      type: "info",
      position: "top-center",
      closeTimeout: 3000
    })

    let solutionStr = ""
    for (let i = 1; i <= size * size; i++) {
      let tempCell = document.getElementById(`${i}`)
      if (tempCell.style.background === "black") {
        solutionStr += "!"
      } else {
        solutionStr += tempCell.textContent.charAt(0)
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
        theUrl = res.url
      })
      .catch(err => {
        console.error(err)
      })
    document.location = `${theUrl}`
  })
  if (size === 15) {
    document.querySelector(".onlyHints").classList.add("d-flex")
    hintsForm.classList.remove("justify-content-around")
  }
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
