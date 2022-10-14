let selectedCell = undefined
let typeDown = false
const crossGrid = document.getElementById("crossGrid")
const nodes = crossGrid.childNodes
const hintAcross = document.getElementById("hints-across")
let prevHint = undefined
let prevCompHint = undefined
const currentHintMobile = document.querySelector(".currentHint")
let prevHintMobile = undefined
let keyDown

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
    let size = crossword.size
    let hints = crossword.hints
    let solution = crossword.solution
    const alphabet = /^[a-z]*$/i

    document.getElementById("thesaurus").classList.remove("d-none")
    crossGrid.classList.add(`gridSize${size}`)
    crossGrid.style.border = `5px solid black`

    for (let i = 0; i < size * size; i++) {
      let cell = document.createElement("div")
      cell.className = `cell${size} position-relative`
      cell.id = `${i + 1}`
      const pLetter = document.createElement("p")
      pLetter.className = `position-absolute pLetter${size}`
      // pLetter.setAttribute("contenteditable", "true")
      cell.prepend(pLetter)
      if (solution.charAt(i) === "!") {
        cell.style.background = "black"
        crossGrid.append(cell)
        continue
      }

      //Todo: implement helper function
      //* Makes whole row or column orange when clicked
      cell.addEventListener("click", event => {
        // crossGrid.focus()
        pLetter.style.visibility = "visible"
        // pLetter.focus()
        if (prevHint !== undefined) {
          prevHint.style.background = ""
          // prevHint.style.border = "none"
        }
        if (prevCompHint !== undefined) {
          prevCompHint.style.textDecoration = ""
          prevCompHint.style.setProperty("-webkit-text-decoration", "")
        }
        if (prevHintMobile !== undefined) {
          // prevHintMobile.textContent = "Looks like there's no word in this direction!"
          prevHintMobile.textContent = "No word in this direction! Try tapping ↺"
        }
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
          let vertComp = cell
          if (document.getElementById(`D${vertComp?.lastChild?.textContent}`)) {
            let pDown = document.getElementById(`D${vertComp.lastChild.textContent}`)
            // pDown.style.textDecoration = "underline orange"
            pDown.style.setProperty("text-decoration", "underline orange")
            pDown.style.setProperty("-webkit-text-decoration", "underline orange")
            pDown.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" })
            prevCompHint = pDown
          }

          //@ Orange forwards -->
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i++) {
            if (nodes[i].id % size === 0) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow"
              }
              if (nodes[i] !== cell && nodes[i].style.background !== "black") {
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
            let nextNode = nodes[i + 1]
            if (nodes[i].style.background === "black") {
              //* Highlights Hints
              if (document.getElementById(`A${nextNode?.lastChild?.textContent}`)) {
                let pAcross = document.getElementById(`A${nextNode.lastChild.textContent}`)
                pAcross.style.background = "yellow"
                pAcross.style.border = "1px solid"
                pAcross.style.borderRadius = "5px"
                pAcross.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                prevHint = pAcross
                // const currentHint = document.querySelector(".currentHint")
                currentHintMobile.textContent = "A" + pAcross.textContent
                prevHintMobile = currentHintMobile
              }
              break
            }

            if (nodes[i].id % size === 1) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow"
              }
              if (nodes[i] !== cell && nodes[i].style.background !== "black") {
                nodes[i].style.background = "orange"
              }
              if (nodes[i].hasChildNodes()) {
                //* Highlights Hints
                let pAcross = document.getElementById(`A${nodes[i].lastChild.textContent}`)
                if (pAcross) {
                  pAcross.style.background = "yellow"
                  pAcross.style.border = "1px solid"
                  pAcross.style.borderRadius = "5px"
                  pAcross.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                  prevHint = pAcross
                  currentHintMobile.textContent = "A" + pAcross.textContent
                  prevHintMobile = currentHintMobile
                }
              }
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

        if (typeDown === true) {
          //* Highlights Hints
          let vertComp = cell
          if (document.getElementById(`A${vertComp?.lastChild?.textContent}`)) {
            let pAcross = document.getElementById(`A${vertComp.lastChild.textContent}`)
            // pAcross.style.textDecoration = "underline orange"
            pAcross.style.setProperty("text-decoration", "underline orange")
            pAcross.style.setProperty("-webkit-text-decoration", "underline orange")
            pAcross.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" })
            prevCompHint = pAcross
            currentHintMobile.textContent = "A" + pAcross.textContent
            prevHintMobile = currentHintMobile
          }
          //@ Orange Down v
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i += size) {
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
            let nextNode = nodes[i + size]
            if (nodes[i].style.background === "black") {
              //* Highlights Hints
              if (document.getElementById(`D${nextNode?.lastChild?.textContent}`)) {
                let pDown = document.getElementById(`D${nextNode.lastChild.textContent}`)
                pDown.style.background = "yellow"
                pDown.style.border = "1px solid"
                pDown.style.borderRadius = "5px"
                pDown.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                prevHint = pDown
                // const currentHint = document.querySelector(".currentHint")
                currentHintMobile.textContent = "D" + pDown.textContent
                prevHintMobile = currentHintMobile
              }
              break
            }
            if (nodes[i].id <= size) {
              if (nodes[i].style.background === "black") {
                if (!nextNode.hasChildNodes()) {
                  continue
                } else {
                  //* Highlights Hints
                  if (document.getElementById(`D${nextNode.lastChild.textContent}`)) {
                    let pDown = document.getElementById(`D${nextNode.lastChild.textContent}`)
                    pDown.style.background = "yellow"
                    pDown.style.border = "1px solid"
                    pDown.style.borderRadius = "5px"
                    pDown.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                    prevHint = pDown
                    currentHintMobile.textContent = "D" + pDown.textContent
                    prevHintMobile = currentHintMobile
                  }
                }
                break
              }

              if (document.getElementById(`D${nodes[i]?.lastChild?.textContent}`)) {
                let pDown = document.getElementById(`D${nodes[i].lastChild.textContent}`)
                if (pDown) {
                  pDown.style.background = "yellow"
                  pDown.style.border = "1px solid"
                  pDown.style.borderRadius = "5px"
                  pDown.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                  prevHint = pDown
                  currentHintMobile.textContent = "D" + pDown.textContent
                  prevHintMobile = currentHintMobile
                }
              }
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
    keyDown = window.addEventListener("keydown", event => {
      const wordInput = document.getElementById("word")
      if (selectedCell === undefined) {
        return
      }

      //^ Helper Function
      const pLetterText = selectedCell.querySelector(`.pLetter${size}`)
      // function create_pLetter(pLetterText) {
      //   pLetterText.textContent = `${event.key.toUpperCase()}`
      // }

      // if (wordInput !== document.activeElement) {
      if (event.key.match(alphabet) && event.key.length === 1) {
        //@ Prevents overflow of orange boxes unto next row
        if (typeDown === false && selectedCell.id % size === 0) {
          create_pLetter(pLetterText)
          // onKeyPress()
          return
        }
        create_pLetter(pLetterText)
        // onKeyPress()

        //* This for loop selects the next cell across
        if (typeDown === false) {
          for (let i = parseInt(selectedCell.id) + 1; i <= nodes.length; i += 1) {
            let nextCell = document.getElementById(`${i}`)
            console.log(i)
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
          for (let i = parseInt(selectedCell.id) + size; i <= nodes.length; i += size) {
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
      } else if (event.key === "Backspace" || event.key === "{backspace}") {
        if (typeDown === false) {
          let foundPrev = false
          for (let i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
            let prevCell = document.getElementById(`${i}`)
            if (selectedCell.id % size === 1) {
              selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              break
            }

            if (prevCell.style.background === "black") {
              //* replaces !foundPrev. Could lead to error?
              selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              break
            }

            if (prevCell.style.background !== "black") {
              //@ Prevents overflow of orange boxes unto previous row
              if (selectedCell.id % size === 1) {
                selectedCell.querySelector(`.pLetter${size}`).textContent = ""
                return
              }
              selectedCell.style.background = "orange"

              selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              selectedCell = prevCell
              selectedCell.style.background = "yellow"
              foundPrev = true
              break
            }
          }
          //! No longer needed it seems, test more
          if (!foundPrev && selectedCell.querySelector(`.pLetter${size}`)) {
            selectedCell.querySelector(`.pLetter${size}`).textContent = ""
          }
        }
        if (typeDown === true) {
          let foundPrev = false
          for (let i = parseInt(selectedCell.id) - 1; i >= 1; i -= size) {
            let prevCell = document.getElementById(`${i + 1 - size}`)
            if (prevCell && prevCell.style.background === "black") {
              selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              break
            }
            if (prevCell && prevCell.style.background !== "black") {
              selectedCell.style.background = "orange"

              selectedCell.querySelector(`.pLetter${size}`).textContent = ""
              selectedCell = prevCell
              selectedCell.style.background = "yellow"
              foundPrev = true
              break
            }
          }
          //! Test
          if (!foundPrev && selectedCell.querySelector(`.pLetter${size}`)) {
            selectedCell.querySelector(`.pLetter${size}`).textContent = ""
          }
        }
      }
      // }
    })

    // Adding hints
    const hintDown = document.getElementById("hints-down")
    for (let key in hints) {
      let value = hints[key]
      let cell = document.getElementById(`${value.cellId}`)

      //* Constructs initial Hint Numbers
      let pElement = document.createElement("p")
      pElement.className = `pNumber${size} pCell`
      pElement.textContent = key
      pElement.id = `N${key}`
      cell.appendChild(pElement)

      if (value.isWordAcross) {
        let pAcross = document.createElement("p")
        pAcross.textContent = `${key} - ${value.acrossHint}`
        pAcross.id = `A${key}`
        hintAcross.appendChild(pAcross)
      }
      if (value.isWordDown) {
        let pDown = document.createElement("p")
        pDown.textContent = `${key} - ${value.downHint}`
        pDown.id = `D${key}`
        hintDown.appendChild(pDown)
      }
    }

    // Check my answer
    // const checkBtn = document.querySelector(".button-19")
    const checkBtn = document.querySelectorAll(".checkBtn, .hg-button-check")
    checkBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        let solutionStr = ""
        for (let i = 1; i <= size * size; i++) {
          let tempCell = document.getElementById(`${i}`)
          if (tempCell.style.background === "black") {
            solutionStr += "!"
          } else {
            solutionStr += tempCell.textContent.charAt(0)
          }
        }

        const solutionNotAllowed = /([0-9]+)/
        if (solutionNotAllowed.exec(solutionStr) || solutionStr.length !== solution.length) {
          forgotToFill()
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

    const revealBtn = document.querySelectorAll(".revealBtn, .hg-button-reveal")
    revealBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].style.background === "orange" || nodes[i].style.background === "yellow") {
            nodes[i].firstChild.textContent = solution.charAt(i)
          }
        }
      })
    })
    // const toggleBtn = document.querySelector(".hg-button-toggleVert")
    const toggleBtn = document.querySelectorAll(".hg-button-toggleVert, .h1Hints")
    // let toggleBtn = document.querySelector(".hg-rows > div:nth-child(3) > div:first-child")
    // async function toggle() {
    //   return (toggleBtn = document.querySelector(".hg-rows > div:nth-child(3) > div:first-child"))
    // }
    // const toggleBtn = document.querySelectorAll(".hg-button-toggleVert, .hg-button-toggleHor") //! It's the default
    toggleBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].style.background === "yellow") {
            nodes[i].click()
          }
        }
      })
    })

    for (let i = 0; i < hintAcross.children.length; i++) {
      //# Try mirroring this
      hintAcross.children[i].addEventListener("click", () => {
        typeDown = false
        let idClick = document.getElementById(`N${hintAcross.children[i].id.slice(1)}`)
        if (hintAcross.children[i].style.background !== "yellow") {
          idClick.click()
        }
      })
    }
    for (let i = 0; i < hintDown.children.length; i++) {
      hintDown.children[i].addEventListener("click", () => {
        typeDown = true
        let idClick = document.getElementById(`N${hintDown.children[i].id.slice(1)}`)
        if (hintDown.children[i].style.background !== "yellow") {
          idClick.click()
        }
      })
    }
    dictionary()
  })
