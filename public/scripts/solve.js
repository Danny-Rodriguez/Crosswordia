var userUrl
var selectedCell = undefined
const alphabet = /^[a-z]*$/i
const crossGrid = document.getElementById("crossGrid")
const footer = document.getElementById("footer")
const titlePage = document.getElementById("titlePage")
titlePage.innerText = "Solve my Crossword!"
const correct = document.getElementById("correct")

await fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(crossword => {
    console.log(crossword)
    console.log(crossword._id)
    console.log(Date(crossword.createdAt))
    let size = crossword.size
    let hints = crossword.hints
    let solution = crossword.solution

    var cellSize = 50
    if (size === 5) {
      cellSize = 100
      // let footer = document.getElementById("footer")
      footer.className = "footerCrossword"
    }
    if (size === 10) {
      cellSize = 80
      // let footer = document.getElementById("footer")
      footer.className = "footerCrossword"
    }
    if (size === 15) {
      cellSize = 50
      // let footer = document.getElementById("footer")
      footer.className = "footerCrossword"
    }

    crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.border = `5px solid black`

    for (var i = 0; i < size * size; i++) {
      let cell = document.createElement("div")
      cell.className = `cell${size} position-relative`
      cell.id = `${i + 1}`
      if (solution.charAt(i) === "!") {
        cell.style.background = "black"
        crossGrid.append(cell)
        continue
      }

      cell.addEventListener("click", event => {
        cell.style.background = "yellow"

        if (selectedCell != undefined && selectedCell !== cell) {
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
        if (selectedCell.innerHTML !== "") {
          if (size === 5) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter5">${event.key.toUpperCase()}</p>`
          }
          if (size === 10) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter10">${event.key.toUpperCase()}</p>`
          }
          if (size === 15) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter15">${event.key.toUpperCase()}</p>`
          }
          for (let key in hints) {
            let value = hints[key]
            if (value.cellId === parseInt(selectedCell.id)) {
              let pElement = document.createElement("p")
              pElement.style.position = "absolute"
              pElement.className = `pNumber${size} pCell`
              pElement.innerText = `${key}`
              console.log("line 98")
              selectedCell.appendChild(pElement)
            }
          }
        } else {
          if (size === 5) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter5">${event.key.toUpperCase()}</p>`
          }
          if (size === 10) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter10">${event.key.toUpperCase()}</p>`
          }
          if (size === 15) {
            selectedCell.innerHTML = `<p class="position-absolute pLetter15">${event.key.toUpperCase()}</p>`
          }
        }
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
        //* Preserves hint number if letter is erased
      } else if (event.key === "Backspace") {
        let foundPrev = false
        for (var i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
          let prevCell = document.getElementById(`${i}`)
          if (prevCell.style.background === "white" || prevCell.style.background === "") {
            selectedCell.style.background = "white"
            if (selectedCell.innerText !== "") {
              selectedCell.innerText = ""
              for (let key in hints) {
                let value = hints[key]
                if (value.cellId === parseInt(selectedCell.id)) {
                  let pElement = document.createElement("p")
                  pElement.style.position = "absolute"
                  pElement.className = `pNumber${size} pCell`
                  pElement.innerText = `${key}`
                  console.log("line 140")
                  selectedCell.appendChild(pElement)
                  break
                }
              }
            } else {
              selectedCell.innerText = ""
            }
            selectedCell = prevCell
            selectedCell.style.background = "yellow"
            foundPrev = true
            break
          }
        }
        // could not find previous cell
        if (!foundPrev) {
          if (selectedCell.innerText !== "") {
            selectedCell.innerText = ""
            for (let key in hints) {
              let value = hints[key]
              if (value.cellId === parseInt(selectedCell.id)) {
                let pElement = document.createElement("p")
                pElement.style.position = "absolute"
                pElement.className = `pNumber${size} pCell`
                pElement.innerText = `${key}`
                selectedCell.appendChild(pElement)
                console.log("line 161")
                break
              }
            }
          } else {
            selectedCell.innerText = ""
          }
        }
      }
    })

    // Adding hints
    var hintDiv = document.getElementById("hints")
    var hintAcross = document.getElementById("hints-across")
    var hintDown = document.getElementById("hints-down")
    for (var key in hints) {
      let value = hints[key]
      // console.log(value)
      let cell = document.getElementById(`${value.cellId}`)

      //* Constructs initial Hint Numbers
      let pElement = document.createElement("p")
      pElement.style.position = "absolute"
      pElement.className = `pNumber${size} pCell`
      pElement.innerText = key
      cell.appendChild(pElement)

      if (value.isWordAcross) {
        let pAcross = document.createElement("p")
        pAcross.innerText = `${key} - ${value.acrossHint}`
        hintAcross.appendChild(pAcross)
      }
      if (value.isWordDown) {
        let pDown = document.createElement("p")
        pDown.innerText = `${key} - ${value.downHint}`
        hintDown.appendChild(pDown)
      }
    }
    // Check my answer
    var checkBtn = document.getElementById("check")
    checkBtn.addEventListener("click", () => {
      let solutionStr = ""
      for (var k = 1; k <= size * size; k++) {
        let tempCell = document.getElementById(`${k}`)
        if (tempCell.style.background === "black") {
          solutionStr += "!"
        } else {
          solutionStr += tempCell.innerText.charAt(0)
        }
      }

      for (let i = 0; i < crossGrid.childNodes.length; i++) {
        if (crossGrid.childNodes[i].innerText === "" && crossGrid.childNodes[i].style.background !== "black") {
          GrowlNotification.notify({
            title: "Whoops!",
            description: "You forgot to fill out the whole crossword!",
            type: "warning",
            position: "top-center",
            closeTimeout: 3000
          })
          return
        }
      }

      if (solution === solutionStr) {
        GrowlNotification.notify({
          title: "Well Done!",
          description: "You have solved the crossword!",
          type: "success",
          position: "top-center",
          closeTimeout: 3000
        })
      } else {
        GrowlNotification.notify({
          title: "Sorry!",
          description: "That wasn't the solution, try again!",
          type: "error",
          position: "top-center",
          closeTimeout: 3000
        })
      }
    })
  })
