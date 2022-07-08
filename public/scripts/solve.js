// console.log("solve.js is running")
var selectedCell = undefined

await fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(crossword => {
    console.log(crossword)
    console.log(crossword._id)
    console.log(Date(crossword.createdAt))
    let size = crossword.size
    let hints = crossword.hints
    let solution = crossword.solution
    var crossGrid = document.getElementById("crossGrid")

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

    crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.border = `5px solid black`

    for (var i = 0; i < size * size; i++) {
      let cell = document.createElement("div")
      cell.className = "cell"
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

    window.addEventListener("keydown", event => {
      if (selectedCell === undefined) {
        return
      }
      if (event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 122 && event.key.length === 1) {
        //talk about this
        if (selectedCell.innerText !== "") {
          selectedCell.innerText = event.key.toUpperCase()
          for (let key in hints) {
            let value = hints[key]
            if (value.cellId === parseInt(selectedCell.id)) {
              let pElement = document.createElement("p")
              pElement.style.position = "relative"
              pElement.style.left = "-50"
              pElement.style.top = "-30"
              pElement.style.fontSize = 20
              pElement.innerText = `${key}`
              selectedCell.appendChild(pElement)
            }
          }
        } else {
          selectedCell.innerText = event.key.toUpperCase()
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
                  pElement.style.position = "relative"
                  pElement.style.left = "-50"
                  pElement.style.top = "-30"
                  pElement.style.fontSize = 20
                  pElement.innerText = `${key}`
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
                pElement.style.position = "relative"
                pElement.style.left = "-50"
                pElement.style.top = "-30"
                pElement.style.fontSize = 20
                pElement.innerText = `${key}`
                selectedCell.appendChild(pElement)
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
      let cell = document.getElementById(`${value.cellId}`)
      let pElement = document.createElement("p")
      pElement.style.position = "relative"
      pElement.style.left = "-50"
      pElement.style.top = "-30"
      pElement.style.fontSize = 20
      pElement.innerText = `${key}`
      cell.appendChild(pElement)

      if (value.isWordAcross) {
        let pAcross = document.createElement("p")
        pAcross.innerText = `${key} Across: ${value.acrossHint}`
        hintAcross.appendChild(pAcross)
      }
      if (value.isWordDown) {
        let pDown = document.createElement("p")
        pDown.innerText = `${key} Down: ${value.downHint}`
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
      if (solution === solutionStr) {
        alert("Congratulations, you have solved the crossword!")
      } else {
        alert("Sorry, that's not correct")
      }
    })
  })
