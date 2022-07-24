// console.log("solve.js is running")
var userUrl
var selectedCell = undefined
var alphabet = /^[a-z]*$/i

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
      let footer = document.getElementById("footer")
      footer.className = "footerCrossword"
    }
    if (size === 15) {
      cellSize = 50
      let footer = document.getElementById("footer")
      footer.className = "footerCrossword"
    }

    crossGrid.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`
    crossGrid.style.border = `5px solid black`

    for (var i = 0; i < size * size; i++) {
      let cell = document.createElement("div")
      // if (size === 5) {
      //   cell.className = "cell5 position-relative"
      // }
      cell.className = `cell${size} position-relative`
      // cell.className = `cell5 position-relative`
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

    // Adds user's profile page
    var userPageBtn = document.getElementById("userPageBtn")
    userPageBtn.addEventListener("click", async () => {
      let googleId
      const example = {
        // googleId: req.user.googleId
        googleId: googleId
      }
      const test = await fetch("/user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(example)
      })
        .then(res => {
          // console.log(res)
          // console.log(res.url)
          // theRes = res
          userUrl = res.url
          console.log(res)
        })
        .catch(err => {
          console.error(err)
        })
      document.location = `${userUrl}`
    })

    //* Adds letter to box with hint number
    window.addEventListener("keydown", event => {
      if (selectedCell === undefined) {
        return
      }
      // if (event.key.charCodeAt(0) >= 65 && event.key.charCodeAt(0) <= 122 && event.key.length === 1) {
      if (event.key.match(alphabet) && event.key.length === 1) {
        //talk about this
        // if (selectedCell.innerText !== "") {
        if (selectedCell.innerHTML !== "") {
          // selectedCell.innerText = event.key.toUpperCase()
          selectedCell.innerHTML = `<p class="position-absolute pLetter">${event.key.toUpperCase()}</p>`
          for (let key in hints) {
            let value = hints[key]
            if (value.cellId === parseInt(selectedCell.id)) {
              let pElement = document.createElement("p")
              pElement.style.position = "absolute"
              pElement.className = `pNumber${size} pCell`
              // pElement.style.left = "10%"
              // pElement.style.top = "0%"
              // pElement.style.fontSize = 20
              pElement.innerText = `${key}`
              console.log("line 98")
              selectedCell.appendChild(pElement)
            }
          }
        } else {
          selectedCell.innerHTML = `<p class="position-absolute pLetter">${event.key.toUpperCase()}</p>`
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
                  // pElement.style.left = "10%"
                  // pElement.style.top = "0%"
                  // pElement.style.fontSize = 20
                  pElement.innerText = `${key}`
                  console.log("line 140")
                  selectedCell.appendChild(pElement)

                  // if (size === 10) {
                  //   let pElement = document.createElement("p")
                  //   pElement.style.position = "absolute"
                  //   pElement.className = `pNumber${size}`
                  //   // pElement.style.right = "30"
                  //   // pElement.style.top = "-20"
                  //   // pElement.style.fontSize = 20
                  //   pElement.innerText = `${key}`
                  //   console.log("line 183")
                  //   selectedCell.appendChild(pElement)
                  //   /* right: 30px; */
                  //   // top: -20px;
                  //   // font-size: 20px;
                  //   // margin-right: 50;
                  // }

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
                // pElement.style.left = "10%"
                // pElement.style.top = "0%"
                // pElement.style.fontSize = 20
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
      let cell = document.getElementById(`${value.cellId}`)

      //* Constructs initial Hint Numbers
      let pElement = document.createElement("p")
      pElement.style.position = "absolute"
      pElement.className = `pNumber${size} pCell`
      pElement.innerText = key
      cell.appendChild(pElement)

      // if (size === 5) {
      //   let pElement = document.createElement("p")
      //   pElement.style.position = "absolute"
      //   pElement.className = `pNumber${size} pCell`
      //   //position-relative
      //   // pElement.style.fontSize = 20
      //   pElement.innerText = key
      //   // console.log("line 183")
      //   cell.appendChild(pElement)
      // }
      // if (size === 10) {
      //   let pElement = document.createElement("p")
      //   pElement.style.position = "absolute"
      //   pElement.className = `pNumber${size} pCell`
      //   //! pElement.className = "position-absolute top-0 start-0 pCell"
      //   // pElement.style.fontSize = 20
      //   pElement.innerText = `${key}`
      //   // let pLetter = document.getElementsByClassName("pLetter")
      //   // pLetter.style.fontSize = 2
      //   console.log("line 183")
      //   cell.appendChild(pElement)
      // }
      // if (size === 15) {
      //   let pElement = document.createElement("p")
      //   pElement.className = "position-relative"
      //   pElement.style.right = "30"
      //   pElement.style.top = "-30"
      //   pElement.style.fontSize = 20
      //   pElement.innerText = `${key}`
      //   console.log("line 183")
      //   cell.appendChild(pElement)
      // }

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
      if (solution === solutionStr) {
        alert("Congratulations, you have solved the crossword!")
      } else {
        alert("Sorry, that's not correct")
      }
    })
  })
