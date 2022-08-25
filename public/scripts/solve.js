let userUrl
let selectedCell = undefined
let typeDown = false
const crossGrid = document.getElementById("crossGrid")
const footer = document.getElementById("footer")

await fetch(document.location.origin + document.location.pathname + "/fetch", {
  method: "POST",
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    return Promise.reject(response)
  })
  .then(crossword => {
    // console.log(crossword)
    let size = crossword.size
    let hints = crossword.hints
    let solution = crossword.solution
    const alphabet = /^[a-z]*$/i
    let cellSize
    if (size === 5) {
      cellSize = 100

      footer.className = "footerCrossword"
    }
    if (size === 10) {
      cellSize = 75

      footer.className = "footerCrossword"
    }
    if (size === 15) {
      cellSize = 50

      footer.className = "footerCrossword"
    }

    crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.border = `5px solid black`

    for (let i = 0; i < size * size; i++) {
      let cell = document.createElement("div")
      cell.className = `cell${size} position-relative`
      cell.id = `${i + 1}`
      if (solution.charAt(i) === "!") {
        cell.style.background = "black"
        crossGrid.append(cell)
        continue
      }

      // for before yellow: let i = size * Math.floor(cell.id / size) + 1
      // edge case for right end: size * Math.floor(cell.id / size) - size + 1
      //Todo Get rid of previous orange line when moving to next line
      // if cell.id % size === 0, use for loop again. Consider helpering it

      cell.addEventListener("click", event => {
        // let prevCell = document.getElementById(`${i + 1}`)
        // prevCell.classList.add("prevCell")
        // console.log(prevCell)
        for (let i = 0; i < crossGrid.childNodes.length; i++) {
          if (crossGrid.childNodes[i].style.background === "orange") {
            crossGrid.childNodes[i].style.background = "white"
          }
        }
        if (cell.style.background === "yellow") {
          typeDown = !typeDown
        }
        cell.style.background = "yellow"
        //? Consider making this a conditional like startingIndex. Ternary?
        let maxId = size * Math.floor(cell.id / size) + size
        // let maxId = size * Math.floor(cell.id / size)
        let startingIndex
        if (cell.id % size === 0) {
          startingIndex = parseInt(cell.id) - size
        } else {
          startingIndex = size * Math.floor(cell.id / size)
        }
        if (typeDown === false) {
          // for (let i = parseInt(cell.id); i < crossGrid.childNodes.length; i++) {
          // for (let i = size * Math.floor(cell.id / size); i < crossGrid.childNodes.length; i++) {
          for (let i = startingIndex; i < crossGrid.childNodes.length; i++) {
            //! Clean this up or refactor
            // if (cell.id % size === 0) {
            //   // continue
            //   for (let i = parseInt(cell.id) - size; i < crossGrid.childNodes.length; i++) {
            //     if (crossGrid.childNodes[i].style.background === "black") {
            //       continue
            //     }
            //     if (crossGrid.childNodes[i].style.background === "yellow") {
            //       break
            //     }
            //     crossGrid.childNodes[i].style.background = "orange"
            //   }
            //   // break
            // }
            //? Consider making this a conditional like startingIndex. Ternary?
            if (cell.id % size === 0) {
              if (i >= maxId - size) {
                break
              }
            }

            if (i >= maxId) {
              break
            }
            // || crossGrid.childNodes[i].style.background === "yellow"
            if (crossGrid.childNodes[i].style.background === "black") {
              continue
            }
            if (crossGrid.childNodes[i].style.background === "yellow") {
              if (crossGrid.childNodes[i] !== cell) {
                crossGrid.childNodes[i].style.background = "orange"
              }
              // crossGrid.childNodes[i].style.background = "orange"
              continue
            }
            crossGrid.childNodes[i].style.background = "orange"
          }
        }
        //Todo: Needs to backfill with orange when typeDown === true
        //Todo: Add backspace support, both directions
        //Todo: Hints
        if (typeDown === true) {
          for (let i = parseInt(cell.id) + size - 1; i < crossGrid.childNodes.length; i += size) {
            if (crossGrid.childNodes[i].style.background === "black") {
              continue
            }
            crossGrid.childNodes[i].style.background = "orange"
          }
        }
        // && selectedCell.style.background !== "yellow"
        if (selectedCell != undefined && selectedCell !== cell && selectedCell.style.background !== "orange") {
          if (selectedCell.style.background === "yellow") {
            selectedCell.style.background = "orange"
          }
          selectedCell.style.background = "white"
        }
        selectedCell = cell
      })
      crossGrid.append(cell)
    }

    //* Adds letter to box with hint number
    window.addEventListener("keydown", event => {
      if (selectedCell === undefined) {
        return
      }
      if (event.key.match(alphabet) && event.key.length === 1) {
        const pLetterText = selectedCell.querySelector(`.pLetter${size}`)
        if (pLetterText && pLetterText !== "") {
          pLetterText.textContent = `${event.key.toUpperCase()}`
        } else {
          const pLetter = document.createElement("p")
          pLetter.className = `position-absolute pLetter${size}`
          pLetter.textContent = `${event.key.toUpperCase()}`
          selectedCell.prepend(pLetter)
        }

        //* This for loop selects the next cell across
        if (typeDown === false) {
          for (let i = parseInt(selectedCell.id) + 1; i <= crossGrid.childNodes.length; i++) {
            let nextCell = document.getElementById(`${i}`)
            if (nextCell.style.background === "white" || nextCell.style.background === "orange" || nextCell.style.background === "") {
              selectedCell.style.background = "white"
              selectedCell = nextCell
              selectedCell.style.background = "yellow"
              let maxId = size * Math.floor(selectedCell.id / size) + size
              for (let i = parseInt(selectedCell.id); i < crossGrid.childNodes.length; i++) {
                if (selectedCell.id % size === 0) {
                  break
                }

                if (i >= maxId) {
                  break
                }

                if (crossGrid.childNodes[i].style.background === "black") {
                  continue
                }
                crossGrid.childNodes[i].style.background = "orange"
              }
              break
            }
          }
        }

        //* This for loop selects the next cell down
        if (typeDown === true) {
          for (let i = parseInt(selectedCell.id) + size; i <= size * size; i = i + size) {
            let nextCell = document.getElementById(`${i}`)
            if (nextCell.style.background === "white" || nextCell.style.background === "orange" || nextCell.style.background === "") {
              selectedCell.style.background = "white"
              selectedCell = nextCell
              selectedCell.style.background = "yellow"
              break
            }
          }
        }

        //* Preserves hint number if letter is erased
        //either delete all orange or preferebly it follows your cursor back
      } else if (event.key === "Backspace") {
        let foundPrev = false
        for (let i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
          let prevCell = document.getElementById(`${i}`)
          if (prevCell.style.background === "white" || prevCell.style.background === "") {
            selectedCell.style.background = "white"
            if (selectedCell.textContent !== "") {
              selectedCell.textContent = ""
              for (let key in hints) {
                let value = hints[key]
                if (value.cellId === parseInt(selectedCell.id)) {
                  let pElement = document.createElement("p")
                  pElement.className = `pNumber${size} pCell`
                  pElement.textContent = `${key}`
                  // console.log("line 123")
                  selectedCell.appendChild(pElement)
                  break
                }
              }
            } else {
              selectedCell.textContent = ""
            }
            selectedCell = prevCell
            selectedCell.style.background = "yellow"
            foundPrev = true
            break
          }
        }
        // could not find previous cell
        if (!foundPrev) {
          if (selectedCell.textContent !== "") {
            selectedCell.textContent = ""
            for (let key in hints) {
              let value = hints[key]
              if (value.cellId === parseInt(selectedCell.id)) {
                let pElement = document.createElement("p")
                pElement.className = `pNumber${size} pCell`
                pElement.textContent = `${key}`
                selectedCell.appendChild(pElement)
                // console.log("line 149")
                break
              }
            }
          } else {
            selectedCell.textContent = ""
          }
        }
      }
    })

    // Adding hints
    const hintDiv = document.getElementById("hints")
    const hintAcross = document.getElementById("hints-across")
    const hintDown = document.getElementById("hints-down")
    for (let key in hints) {
      let value = hints[key]
      let cell = document.getElementById(`${value.cellId}`)

      //* Constructs initial Hint Numbers
      let pElement = document.createElement("p")
      pElement.className = `pNumber${size} pCell`
      pElement.textContent = key
      cell.appendChild(pElement)

      if (value.isWordAcross) {
        let pAcross = document.createElement("p")
        pAcross.textContent = `${key} - ${value.acrossHint}`
        hintAcross.appendChild(pAcross)
      }
      if (value.isWordDown) {
        let pDown = document.createElement("p")
        pDown.textContent = `${key} - ${value.downHint}`
        hintDown.appendChild(pDown)
      }
    }
    // Check my answer
    const checkBtn = document.querySelector(".button-19")
    checkBtn.addEventListener("click", () => {
      let solutionStr = ""
      for (let i = 1; i <= size * size; i++) {
        let tempCell = document.getElementById(`${i}`)
        if (tempCell.style.background === "black") {
          solutionStr += "!"
        } else {
          solutionStr += tempCell.textContent.charAt(0)
        }
      }
      console.log(solutionStr)
      const solutionNotAllowed = /([0-9]+)/
      if (solutionNotAllowed.exec(solutionStr) || solutionStr.length !== solution.length) {
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

      if (solution === solutionStr) {
        GrowlNotification.notify({
          title: "Well Done!",
          description: "You have solved the crossword!",
          image: {
            visible: true,
            customImage: "../img/success-outline.svg"
          },
          type: "success",
          position: "top-center",
          closeTimeout: 3000
        })
      } else {
        GrowlNotification.notify({
          title: "Sorry!",
          description: "That wasn't the solution, try again!",
          image: {
            visible: true,
            customImage: "../img/danger-outline.svg"
          },
          type: "error",
          position: "top-center",
          closeTimeout: 3000
        })
      }
    })
  })
