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
      if (clickMode.innerText === "Add a Box") {
        cell.style.background = "yellow"

        if (selectedCell != undefined && selectedCell !== cell) {
          selectedCell.style.background = "white"
        }
        selectedCell = cell
      } else if (clickMode.innerText === "Activate Typing") {
        cell.style.background = "black"
        cell.innerText = ""
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
    if (child.innerText === "5x5") {
      size = 5
    }
    if (child.innerText === "10x10") {
      size = 10
    }
    if (child.innerText === "15x15") {
      size = 15
    }
    // document.getElementById("thesaurus").style.display = "block"
    document.getElementById("thesaurus").className = "d-block"
    document.getElementById("boxAndFinish").className = "d-flex flex-column"
    crossGrid.style.display = "grid"

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
  const wordInput = document.getElementById("word")
  if (selectedCell === undefined) {
    return
  }
  if (wordInput !== document.activeElement && event.key.match(alphabet) && event.key.length === 1) {
    if (size === 5) {
      selectedCell.innerHTML = `<p class="position-absolute pLetter5">${event.key.toUpperCase()}</p>`
    }
    if (size === 10) {
      selectedCell.innerHTML = `<p class="position-absolute pLetter10">${event.key.toUpperCase()}</p>`
    }
    if (size === 15) {
      selectedCell.innerHTML = `<p class="position-absolute pLetter15">${event.key.toUpperCase()}</p>`
    }
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
        selectedCell.innerText = ""
        selectedCell = prevCell
        selectedCell.style.background = "yellow"
        foundPrev = true
        break
      }
    }
    // This is for the first cell
    if (!foundPrev) {
      selectedCell.innerText = ""
    }
  }
})

const dictSubmit = document.getElementById("dictSubmit")
dictSubmit.addEventListener("click", async event => {
  event.preventDefault()
  const word = document.getElementById("word")

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
      const listDict = document.getElementById("listDict")
      listDict.innerHTML = dataArr.map(i => `<li>${i}</li>`).join("")
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
  // if (crossGrid.children.length === 0) {
  //   GrowlNotification.notify({
  //     title: "Whoops!",
  //     description: "You gotta choose a crossword size first!",
  //     image: {
  //       visible: true,
  //       customImage: "../img/warning-outline.svg"
  //     },
  //     type: "warning",
  //     position: "top-center",
  //     closeTimeout: 3000
  //   })
  //   return
  // }
  // for (let i = 0; i < crossGrid.childNodes.length; i++) {
  //   if (crossGrid.childNodes[i].innerText === "" && crossGrid.childNodes[i].style.background !== "black") {
  //     GrowlNotification.notify({
  //       title: "Whoops!",
  //       description: "You forgot to fill out the whole crossword!",
  //       image: {
  //         visible: true,
  //         customImage: "../img/warning-outline.svg"
  //       },
  //       type: "warning",
  //       position: "top-center",
  //       closeTimeout: 3000
  //     })
  //     return
  //   }
  // }

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
    }
  }

  let submitBtn = document.getElementById("hintSubmit")
  submitBtn.className = "button-82-pushable"
  submitBtn.addEventListener("click", async () => {
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

    // for (const key in hintMapper) {
    //   if (hintMapper[key].acrossHint === "" || hintMapper[key].downHint === "") {
    //     GrowlNotification.notify({
    //       title: "Whoops!",
    //       description: "You forgot to fill out all the hints!",
    //       image: {
    //         visible: true,
    //         customImage: "../img/warning-outline.svg"
    //       },
    //       type: "warning",
    //       position: "top-center",
    //       closeTimeout: 3000
    //     })
    //     return
    //   }
    // }

    // GrowlNotification.notify({
    //   title: "Submitted Sucessfully!",
    //   image: {
    //     visible: true,
    //     customImage: "../img/info-outline.svg"
    //   },
    //   type: "info",
    //   position: "top-center",
    //   closeTimeout: 3000
    // })

    let solutionStr = ""
    for (let k = 1; k <= size * size; k++) {
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
        theUrl = res.url
      })
      .catch(err => {
        console.error(err)
      })
    document.location = `${theUrl}`
  })
  const hintsForm = document.getElementById("hints")
  if (size === 15) {
    document.querySelector(".onlyHints").style.display = "flex"
  }
  hintsForm.appendChild(submitBtn)
  // document.getElementsByClassName("onlyHints").style.display = "flex"
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
