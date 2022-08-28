let userUrl
let selectedCell = undefined
let typeDown = false
const crossGrid = document.getElementById("crossGrid")
const footer = document.getElementById("footer")
const nodes = crossGrid.childNodes

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

      // footer.className = "footerCrossword"
    }
    if (size === 10) {
      cellSize = 75

      // footer.className = "footerCrossword"
    }
    if (size === 15) {
      cellSize = 50

      // footer.className = "footerCrossword"
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

      function cellColorChanger2(startingIndex, endIndex, increment, inputCell, typeDown) {
        for (let i = startingIndex; i < endIndex; i++) {
          let nodeCell = document.getElementById(`${i}`)
          if (nodeCell && nodeCell.style.background === "black") {
            break
          }
          if (nodeCell && nodeCell.style.background === "yellow") {
            if (nodeCell !== inputCell) {
              nodeCell.style.background = "orange"
            }
            continue
          }
          if (nodeCell) {
            nodeCell.style.background = "orange"
          }
        }
      }

      function cellColorChanger(startingIndex, increment, inputCell, typeDown) {
        let maxId = size * Math.floor(inputCell.id / size) + size
        for (let i = startingIndex; i < nodes.length; i += increment) {
          // console.log(typeDown)
          if (typeDown === false) {
            if (inputCell.id % size === 0) {
              if (i >= maxId - size) {
                break
              }
            }

            if (i >= maxId) {
              break
            }
          }
          // stops orange lining until black
          // if (nodes[i].style.background === "yellow") {
          //   continue
          //   if (nodes[i].style.background === "black") {
          //     // continue
          //     break
          //   }
          // }
          // if (nodes[i].style.background === "black") {
          //   const end = parseInt(nodes[i].id) - 1
          //   for (let j = 0; j < end; j++) {
          //     let cell = document.getElementById(`${j}`)
          //     console.log(cell)
          //     if (cell.style.background === "orange") {
          //       cell.style.background = "white"
          //     }
          //   }
          //   // continue
          //   break
          // }
          if (nodes[i].style.background === "black") {
            break
          }
          if (nodes[i].style.background === "yellow") {
            if (nodes[i] !== inputCell) {
              nodes[i].style.background = "orange"
            }
            continue
          }
          nodes[i].style.background = "orange"
        }
      }

      //Todo: implement helper function
      //* Makes whole row or column orange when clicked
      cell.addEventListener("click", event => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].style.background === "orange") {
            nodes[i].style.background = "white"
          }
        }

        if (cell.style.background === "yellow") {
          typeDown = !typeDown
        }
        cell.style.background = "yellow"

        if (typeDown === false) {
          //@ Orange forwards -->
          // let maxId = size * Math.floor(cell.id / size) + size
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i++) {
            // if (nodes[i] === cell) {
            //   nodes[i].style.background === "yellow"
            // }

            // if (nodes[i] !== cell) {
            //   nodes[i].style.background === "orange"
            // }

            if (nodes[i].id % size === 0) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow"
              }
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              break
            }

            if (nodes[i].style.background === "black") {
              break
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              continue
            }
            nodes[i].style.background = "orange"
          }

          //@ Orange Backwards <--
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i--) {
            if (nodes[i].id % size === 1) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow"
              }
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              break
            }

            if (nodes[i].style.background === "black") {
              break
            }

            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              continue
            }
            nodes[i].style.background = "orange"
          }
        }
        //Todo: Hints
        if (typeDown === true) {
          // let startingIndexDown = parseInt(cell.id)
          // while (startingIndexDown > size) {
          //   startingIndexDown -= size
          // }
          // startingIndexDown--

          //@ Orange Down v
          for (let i = cell.id - 1; i < nodes.length; i += size) {
            if (nodes[i].style.background === "black") {
              break
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              continue
            }
            nodes[i].style.background = "orange"
          }

          //@ Orange Up ^
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i -= size) {
            if (nodes[i].style.background === "black") {
              break
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "orange"
              }
              continue
            }
            nodes[i].style.background = "orange"
          }
        }
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

      //^ Helper Function
      //@Use this const right here!
      const pLetterText = selectedCell.querySelector(`.pLetter${size}`)
      function create_pLetter(pLetterText) {
        if (pLetterText && pLetterText !== "") {
          // return (pLetterText.textContent = `${event.key.toUpperCase()}`)
          pLetterText.textContent = `${event.key.toUpperCase()}`
        } else {
          const pLetter = document.createElement("p")
          pLetter.className = `position-absolute pLetter${size}`
          pLetter.textContent = `${event.key.toUpperCase()}`
          // return selectedCell.prepend(pLetter)
          selectedCell.prepend(pLetter)
        }
      }
      if (event.key.match(alphabet) && event.key.length === 1) {
        //@ Prevents overflow of orange boxes unto next row
        if (typeDown === false && selectedCell.id % size === 0) {
          create_pLetter(pLetterText)
          return
        }
        create_pLetter(pLetterText)
        //!

        // let increment
        // if (typeDown === false) {
        //   handleOrangeYellow(1)
        // }

        // if (typeDown === true) {
        //   handleOrangeYellow(size)
        // }
        // handleOrangeYellow(increment)
        ///* This for loop selects the next cell across

        if (typeDown === false) {
          for (let i = parseInt(selectedCell.id) + 1; i <= nodes.length; i += 1) {
            let nextCell = document.getElementById(`${i}`)
            if (nextCell.style.background === "black") {
              break
            }
            if (nextCell.style.background === "white" || nextCell.style.background === "orange" || nextCell.style.background === "") {
              selectedCell.style.background = "orange"
              selectedCell = nextCell
              selectedCell.style.background = "yellow"
              break
            }
          }
        }

        ///* This for loop selects the next cell down

        if (typeDown === true) {
          for (let i = parseInt(selectedCell.id) + size; i <= size * size; i += size) {
            let nextCell = document.getElementById(`${i}`)
            if (nextCell.style.background === "black") {
              break
            }
            if (nextCell.style.background === "white" || nextCell.style.background === "orange" || nextCell.style.background === "") {
              selectedCell.style.background = "orange"
              selectedCell = nextCell
              selectedCell.style.background = "yellow"
              break
            }
          }
        }

        //* Preserves hint number if letter is erased
        //either delete all orange or preferebly it follows your cursor back
      } else if (event.key === "Backspace") {
        if (typeDown === false) {
          let foundPrev = false
          for (let i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
            let prevCell = document.getElementById(`${i}`)
            if (selectedCell.id % size === 1) {
              if (selectedCell.querySelector(`.pLetter${size}`)) {
                selectedCell.querySelector(`.pLetter${size}`).textContent = ""
                break
              }
              break
            }

            if (prevCell.style.background === "black") {
              break
            }

            if (prevCell.style.background !== "black") {
              //@ Prevents overflow of orange boxes unto previous row
              if (selectedCell.querySelector(`.pLetter${size}`) && selectedCell.id % size === 1) {
                selectedCell.querySelector(`.pLetter${size}`).textContent = ""
                return
              }
              selectedCell.style.background = "orange"

              if (selectedCell.querySelector(`.pLetter${size}`)) {
                selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              }
              selectedCell = prevCell
              selectedCell.style.background = "yellow"
              foundPrev = true
              break
            }
          }
          //!
          // if (!foundPrev) {
          //   selectedCell.querySelector(`.pLetter${size}`).textContent = ""
          // }
        }
        if (typeDown === true) {
          let foundPrev = false
          for (let i = parseInt(selectedCell.id) - 1; i >= 1; i -= size) {
            // console.log(i)
            let prevCell = document.getElementById(`${i + 1 - size}`)
            // console.log(prevCell)
            if (prevCell && prevCell.style.background === "black") {
              break
            }
            if (prevCell && prevCell.style.background !== "black") {
              selectedCell.style.background = "orange"

              if (selectedCell.querySelector(`.pLetter${size}`)) {
                selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              }
              selectedCell = prevCell
              selectedCell.style.background = "yellow"
              foundPrev = true
              break
            }
          }
          if (!foundPrev && selectedCell.querySelector(`.pLetter${size}`)) {
            selectedCell.querySelector(`.pLetter${size}`).textContent = ""
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
