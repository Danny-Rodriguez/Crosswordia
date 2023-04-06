const clickMode = document.getElementById("clickMode");
const crossGrid = document.getElementById("crossGrid");
const name = document.getElementById("name");
const nodes = crossGrid.childNodes;
const alphabet = /^[a-z]*$/i;
let selectedCell = undefined;
let size = undefined;
let hintMapper = {};
let totalHints = 0;
let isEditMode = true;
let theUrl;
let typeDown = false;

let hintButton = document.getElementById("hintBtn");
document.querySelector(".hg-button-reveal > span").textContent = "Box ◾";

const revealBtn = document.querySelector(".hg-button-reveal");
revealBtn.style.setProperty("background", "aliceblue", "important");

const checkBtn = document.querySelector(".hg-button-check > span");
checkBtn.textContent = "Finish";

document.querySelector(".hg-button-check").addEventListener("click", () => {
  hintButton.click();
});

revealBtn.addEventListener("click", () => {
  clickMode.click();
  if (clickMode.textContent === "Blackout Cells") {
    revealBtn.textContent = "Box ◾";
  } else {
    // revealBtn.textContent = "Type◽"
    revealBtn.textContent = "Box ◽";
    // revealBtn.textContent = "Type▫"
  }
});

const toggleBtn = document.querySelectorAll(".creaDir, .hg-button-toggleVert");
toggleBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].style.background === "yellow") {
        nodes[i].click();
      }
    }
  });
});

//* creates grid based on size
function drawGrid() {
  const footer = document.getElementById("footer");
  if (size === 10 || size === 15) {
    footer.className = "footerCrossword";
  }

  removeAllChildNodes(crossGrid);
  crossGrid.classList.remove(`gridSize5`);
  crossGrid.classList.remove(`gridSize10`);
  crossGrid.classList.remove(`gridSize15`);
  crossGrid.classList.add(`gridSize${size}`);
  crossGrid.style.border = `5px solid black`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = `cell${size} position-relative`;
    cell.id = `${i + 1}`;
    //# Refactoring -->
    const pLetter = document.createElement("p");
    pLetter.className = `position-absolute pLetter${size}`;
    cell.prepend(pLetter);
    cell.addEventListener("click", event => {
      if (cell.style.background === "black") {
        const pLetter = document.createElement("p");
        pLetter.className = `position-absolute pLetter${size}`;
        cell.prepend(pLetter);
      }
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].style.background === "darkorchid") {
          nodes[i].style.background = "white";
        }
      }
      if (!isEditMode) {
        return;
      }
      //* Did not change button color
      if (clickMode.textContent === "Blackout Cells") {
        if (cell.style.background === "yellow") {
          typeDown = !typeDown;
        }
        cell.style.background = "yellow";

        if (typeDown === false) {
          //@ darkorchid forwards -->
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i++) {
            if (nodes[i].id % size === 0) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow";
              }
              if (nodes[i] !== cell && nodes[i].style.background !== "black") {
                nodes[i].style.background = "darkorchid";
              }
              break;
            }

            if (nodes[i].style.background === "black") {
              break;
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "darkorchid";
              }
              continue;
            }
            nodes[i].style.background = "darkorchid";
          }

          //@ darkorchid Backwards <--
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i--) {
            let pAcrossComp;
            let nextNode = nodes[i + 1];
            if (nodes[i].id % size === 1) {
              if (nodes[i] === cell) {
                nodes[i].style.background = "yellow";
              }
              if (nodes[i] !== cell && nodes[i].style.background !== "black") {
                nodes[i].style.background = "darkorchid";
              }
              break;
            }

            if (nodes[i].style.background === "black") {
              break;
            }

            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "darkorchid";
              }
              continue;
            }
            nodes[i].style.background = "darkorchid";
          }
        }

        if (typeDown === true) {
          //@ darkorchid Down v
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i += size) {
            // console.log(cell.id)
            if (nodes[i].style.background === "black") {
              break;
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "darkorchid";
              }
              continue;
            }
            nodes[i].style.background = "darkorchid";
          }

          //@ darkorchid Up ^
          for (let i = cell.id - 1; i < nodes.length && i >= 0; i -= size) {
            if (nodes[i].style.background === "black") {
              break;
            }
            if (nodes[i].style.background === "yellow") {
              if (nodes[i] !== cell) {
                nodes[i].style.background = "darkorchid";
              }
              continue;
            }
            nodes[i].style.background = "darkorchid";
          }
        }

        if (selectedCell != undefined && selectedCell !== cell && selectedCell.style.background !== "darkorchid") {
          if (selectedCell.style.background === "yellow") {
            selectedCell.style.background = "darkorchid";
          }
          selectedCell.style.background = "white";
        }
        selectedCell = cell;
      } else if (clickMode.textContent === "Activate Typing") {
        cell.style.background = "black";
        cell.textContent = "";
      }
    });
    crossGrid.append(cell);
  }
}

const touchKeyboard = document.querySelector(".kbd");
const sizeButtons = document.getElementsByClassName("sizeButtons")[0].children;
for (let i = 0; i < sizeButtons.length; i++) {
  const child = sizeButtons[i];
  child.addEventListener("click", event => {
    document.getElementById("chooseH1").style.setProperty("display", "none", "important");
    touchKeyboard.classList.remove("d-none");
    touchKeyboard.classList.add("d-keyboard");
    // removeAllChildNodes(crossGrid)
    if (child.textContent === "5x5") {
      size = 5;
    }
    if (child.textContent === "10x10") {
      size = 10;
    }
    if (child.textContent === "15x15") {
      size = 15;
    }
    document.getElementById("thesaurus").classList.remove("d-none");
    // document.getElementById("thesaurus").className = "d-block"
    document.getElementById("boxAndFinish").className = "d-flex flex-column";
    // crossGrid.style.display = "grid"

    drawGrid();
  });
}

//* This changed the color
clickMode.addEventListener("click", event => {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].style.background === "darkorchid") {
      nodes[i].style.background = "white";
    }
  }
  // changing modes
  if (clickMode.textContent === "Blackout Cells") {
    clickMode.textContent = "Activate Typing";
    clickMode.className = "button-50 btn50-white mb-2";
    // unselecting the cell
    if (selectedCell) {
      selectedCell.style.background = "white";
    }
  } else if (clickMode.textContent === "Activate Typing") {
    clickMode.textContent = "Blackout Cells";
    clickMode.className = "button-50 btn50-black mb-2";
  }
  selectedCell = undefined;
});

window.addEventListener("keydown", event => {
  const wordInput = document.getElementById("word");
  if (selectedCell === undefined) {
    return;
  }

  //^ Helper Function
  const pLetterText = selectedCell.querySelector(`.pLetter${size}`);

  if (wordInput !== document.activeElement) {
    if (event.key.match(alphabet) && event.key.length === 1) {
      //@ Prevents overflow of darkorchid boxes unto next row
      if (typeDown === false && selectedCell.id % size === 0) {
        create_pLetter(pLetterText);
        return;
      }
      create_pLetter(pLetterText);

      //* This for loop selects the next cell across
      if (typeDown === false) {
        for (let i = parseInt(selectedCell.id) + 1; i <= size * size; i++) {
          let nextCell = document.getElementById(`${i}`);
          if (nextCell.style.background === "black") {
            break;
          }
          if (nextCell.style.background === "white" || nextCell.style.background === "darkorchid" || nextCell.style.background === "") {
            selectedCell.style.background = "darkorchid";
            selectedCell = nextCell;
            selectedCell.style.background = "yellow";
            break;
          }
        }
      }

      //* This for loop selects the next cell down
      if (typeDown === true) {
        for (let i = parseInt(selectedCell.id) + size; i <= nodes.length; i += size) {
          let nextCell = document.getElementById(`${i}`);
          if (nextCell.style.background === "black") {
            break;
          }
          if (nextCell.style.background === "white" || nextCell.style.background === "darkorchid" || nextCell.style.background === "") {
            selectedCell.style.background = "darkorchid";
            selectedCell = nextCell;
            selectedCell.style.background = "yellow";
            break;
          }
        }
      }
    } else if (event.key === "Backspace" || event.key === "{backspace}") {
      if (typeDown === false) {
        let foundPrev = false;
        for (let i = parseInt(selectedCell.id) - 1; i >= 1; i--) {
          let prevCell = document.getElementById(`${i}`);
          if (selectedCell.id % size === 1) {
            selectedCell.querySelector(`.pLetter${size}`).textContent = "";
            break;
          }

          if (prevCell.style.background === "black") {
            selectedCell.querySelector(`.pLetter${size}`).textContent = "";
            break;
          }

          if (prevCell.style.background !== "black") {
            //@ Prevents overflow of darkorchid boxes unto previous row
            if (selectedCell.id % size === 1) {
              selectedCell.querySelector(`.pLetter${size}`).textContent = "";
              return;
            }
            selectedCell.style.background = "darkorchid";

            selectedCell.querySelector(`.pLetter${size}`).textContent = "";
            selectedCell = prevCell;
            selectedCell.style.background = "yellow";
            foundPrev = true;
            break;
          }
        }
        if (!foundPrev && selectedCell.querySelector(`.pLetter${size}`)) {
          selectedCell.querySelector(`.pLetter${size}`).textContent = "";
        }
      }
      if (typeDown === true) {
        let foundPrev = false;
        for (let i = parseInt(selectedCell.id) - 1; i >= 1; i -= size) {
          let prevCell = document.getElementById(`${i + 1 - size}`);
          if (prevCell && prevCell.style.background === "black") {
            selectedCell.querySelector(`.pLetter${size}`).textContent = "";
            break;
          }
          if (prevCell && prevCell.style.background !== "black") {
            selectedCell.style.background = "darkorchid";

            selectedCell.querySelector(`.pLetter${size}`).textContent = "";
            selectedCell = prevCell;
            selectedCell.style.background = "yellow";
            foundPrev = true;
            break;
          }
        }
        if (!foundPrev && selectedCell.querySelector(`.pLetter${size}`)) {
          selectedCell.querySelector(`.pLetter${size}`).textContent = "";
        }
      }
    }
  }
});

dictionary();

// let hintButton = document.getElementById("hintBtn")
hintButton.addEventListener("click", event => {
  if (selectedCell !== undefined) {
    selectedCell.style.background = "white";
    selectedCell = undefined;
  }
  // let blackCells = 0
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].style.background === "darkorchid") {
      nodes[i].style.background = "white";
    }

    // if (nodes[i].style.background === "black") {
    //   blackCells++
    // }
    // if (blackCells === size * size) {
    //   console.log(blackCells)
    //   GrowlNotification.notify({
    //     title: "Whoops!",
    //     description: "That doesn't look like a functional crossword!",
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

    if (nodes[i].textContent === "" && nodes[i].style.background !== "black") {
      forgotToFill();
      return;
    }
  }

  const hintsAcross = document.getElementById("hints-input-across");
  const hintsDown = document.getElementById("hints-input-down");

  const toggleBtn = document.querySelectorAll(".hg-button-toggleVert");
  toggleBtn.forEach(btn => {
    btn.addEventListener("click", () => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].style.background === "yellow") {
          nodes[i].click();
        }
      }
    });
  });

  handleHints();
  isEditMode = false;
  // hide unnecessary buttons
  clickMode.style.display = "none";
  // document.querySelector(".sizeButtons").style.display = "none"
  document.querySelector(".sizeButtons").style.setProperty("display", "none", "important");
  document.querySelector(".wrapper").style.marginTop = "3.5vh";
  hintButton.style.display = "none";
  // document.getElementById("boxAndFinish").className = "d-none"
  document.querySelector(".creaDir").style.setProperty("display", "none", "important");
  touchKeyboard.style.setProperty("display", "none", "important");
  //* iterating over each hint and updating page
  for (let i = 1; i <= totalHints; i++) {
    let hintObj = hintMapper[i];
    //* update cell with hint Number
    let cell = document.getElementById(`${hintObj.cellId}`);
    let pElement = document.createElement("p");
    pElement.style.position = "absolute";
    pElement.className = `pNumber${size} pCell`;
    pElement.textContent = `${i}`;
    cell.appendChild(pElement);
    //* add a hint for submission
    if (hintObj.isWordAcross) {
      let hintInput = document.createElement("input");
      hintInput.setAttribute("type", "text");
      hintInput.setAttribute("name", `${i}:across`);
      hintInput.setAttribute("placeholder", `${i} Across`);
      hintsAcross.appendChild(hintInput);
    }
    if (hintObj.isWordDown) {
      let hintInput = document.createElement("input");
      hintInput.setAttribute("type", "text");
      hintInput.setAttribute("name", `${i}:down`);
      hintInput.setAttribute("placeholder", `${i} Down`);
      hintsDown.appendChild(hintInput);
    }
  }
  const hintsForm = document.getElementById("hints");
  hintsForm.classList.remove("d-none");

  let submitBtn = document.getElementById("hintSubmit");
  submitBtn.addEventListener("click", async () => {
    // nameEnforcer()
    let hintValuesAcross = hintsAcross.children;
    for (let i = 1; i < hintValuesAcross.length; i++) {
      let hintValue = hintValuesAcross[i];
      let hintInfo = hintValue.name.split(":");
      let hintNumber = parseInt(hintInfo[0]);
      if (hintInfo[1] === "across") {
        hintMapper[hintNumber].acrossHint = hintValue.value;
      }
    }

    let hintValuesDown = hintsDown.children;
    for (let i = 1; i < hintValuesDown.length; i++) {
      let hintValue = hintValuesDown[i];
      let hintInfo = hintValue.name.split(":");
      let hintNumber = parseInt(hintInfo[0]);
      if (hintInfo[1] === "down") {
        hintMapper[hintNumber].downHint = hintValue.value;
      }
    }
    // const name = document.getElementById("name")
    // nameEnforcer()

    if (name.value === "") {
      console.log("Forgot to name!");
      return GrowlNotification.notify({
        title: "Whoops!",
        description: "You forgot to name the crossword!",
        image: {
          visible: true,
          customImage: "../img/warning-outline.svg"
        },
        type: "warning",
        position: "top-center",
        closeTimeout: 3000
      });
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
        });
        return;
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
    });

    let solutionStr = "";
    for (let i = 1; i <= size * size; i++) {
      let tempCell = document.getElementById(`${i}`);
      if (tempCell.style.background === "black") {
        solutionStr += "!";
      } else {
        solutionStr += tempCell.textContent.charAt(0);
      }
    }
    const example = {
      name: name.value,
      size: size,
      solution: solutionStr,
      hints: hintMapper
    };
    const test = await fetch("/crossword", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(example)
    })
      .then(res => {
        theUrl = res.url;
      })
      .catch(err => {
        console.error(err);
      });
    document.location = `${theUrl}`;
  });
  if (size === 15) {
    document.querySelector(".onlyHints").classList.add("d-flex");
    hintsForm.classList.remove("justify-content-around");
  }
  hintsForm.appendChild(submitBtn);
});

function handleHints() {
  for (let i = 1; i <= size * size; i++) {
    let cell = document.getElementById(`${i}`);
    // skipping black cells since they are not part of a word
    if (cell.style.background === "black") {
      continue;
    }
    let cellAbove = i >= 1 && i <= size ? undefined : document.getElementById(`${i - size}`);
    let cellBelow = i >= size * (size - 1) && i <= size * size ? undefined : document.getElementById(`${i + size}`); //this is bottom row bec 20 - 25
    let cellRight = i % size == 0 ? undefined : document.getElementById(`${i + 1}`);
    let cellLeft = i % size == 1 ? undefined : document.getElementById(`${i - 1}`);
    // checking if new hint found
    let newHint = {};
    let isNewHint = false;
    // checking if word is down: must not have cell above, but must have cell below
    if ((cellAbove === undefined || cellAbove.style.background === "black") && cellBelow !== undefined && cellBelow.style.background !== "black") {
      isNewHint = true;
      newHint.cellId = i;
      newHint.isWordDown = true;
    }
    // checking if word exists across: must not have cell to left, but must have cell to right
    if ((cellLeft === undefined || cellLeft.style.background === "black") && cellRight !== undefined && cellRight.style.background !== "black") {
      isNewHint = true;
      newHint.cellId = i;
      newHint.isWordAcross = true;
    }
    // checking if current cell is a hint or not
    if (isNewHint) {
      totalHints++;
      hintMapper[totalHints] = newHint;
    }
  }
}
