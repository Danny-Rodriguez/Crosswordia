let Keyboard = window.SimpleKeyboard.default
// let layoutPage =
// console.log(pie)
let layoutDef
function layoutChooser(page) {
  if (page === "solve") {
    layoutDef = "solve"
  } else {
    layoutDef = "create"
  }
}

let keyboard = new Keyboard({
  // onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  mergeDisplay: true,
  layoutName: "default", //@"solve" and "create"
  // layoutName: layoutDef, //@"solve" and "create"
  layout: {
    // default: ["q w e r t y u i o p", "a s d f g h j k l", "{shift} z x c v b n m {backspace}", "{numbers} {space} {ent}"],
    // default: ["q w e r t y u i o p", "a s d f g h j k l", "{shift} z x c v b n m {backspace}", "{reveal} {space} {check}"],
    default: ["q w e r t y u i o p", "a s d f g h j k l", "{toggleVert} z x c v b n m {backspace}", "{reveal} {space} {check}"]
    // solve: ["q w e r t y u i o p", "a s d f g h j k l", "{toggleVert} z x c v b n m {backspace}", "{reveal} {space} {check}"]
    // create: ["q w e r t y u i o p", "a s d f g h j k l", "{toggleVert} z x c v b n m {backspace}", "{black} {space} {finish}"]
    // toggleHor: ["q w e r t y u i o p", "a s d f g h j k l", "{toggleHor} z x c v b n m {backspace}", "{reveal} {space} {check}"]
    // shift: ["Q W E R T Y U I O P", "A S D F G H J K L", "{shift} Z X C V B N M {backspace}", "{reveal} {space} {check}"]
    // numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
  },
  display: {
    // "{numbers}": "123",
    "{reveal}": "reveal",
    "{black}": "black",
    "{finish}": "finish",
    // "{ent}": "return",
    // "{ent}": "Check",
    "{check}": "check",
    "{escape}": "esc ⎋",
    "{tab}": "tab ⇥",
    "{backspace}": "⌫",
    "{capslock}": "caps lock ⇪",
    // "{shift}": "⇧",
    // "{toggleVert}": "⇅",
    "{toggleVert}": "↺",
    "{toggleHor}": "⇄",
    "{controlleft}": "ctrl ⌃",
    "{controlright}": "ctrl ⌃",
    "{altleft}": "alt ⌥",
    "{altright}": "alt ⌥",
    "{metaleft}": "cmd ⌘",
    "{metaright}": "cmd ⌘",
    "{abc}": "ABC"
  }
  // buttonAttributes: [
  //   {
  //     attribute: "aria-label",
  //     value: "bee",
  //     buttons: "b B"
  //   }
  //   //   // {
  //   //   //   class: "revealBtn",
  //   //   //   buttons: "{reveal}"
  //   //   // }
  // ]
})

/**
 * Update simple-keyboard when input is changed directly
 */
// document.querySelector(".input").addEventListener("input", event => {
//   keyboard.setInput(event.target.value)
// })
// selectedCell.querySelector(`.pLetter${size}`).addEventListener("input", event => {
//   // keyboard.setInput(event.target.value)
//   create_pLetter(selectedCell)
// })

console.log(keyboard)

// function onChange(input) {
//   document.querySelector(".input").value = input
//   console.log("Input changed", input)
// }

// function onKeyPress(button, keyDown) {
function onKeyPress(button) {
  // if (button !== "{toggleVert}" || button !== "{toggleHor}") {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: button
    })
  )
  // }
  console.log(button)
  //   if (button === "{toggleVert}") {
  //     console.log("this func works")
  //     toggler()
  //     up = up === "⇅" ? "⇄" : "⇅"
  //     if (up == "⇅") {
  //       up = "⇄"
  //     } else {
  //       up = "⇅"
  //     }
  //     console.log(up)
  //   }
  // }
  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shift}" || button === "{lock}") handleShift()
  if (button === "{numbers}" || button === "{abc}") handleNumbers()
  //   if (button === "{toggleVert}" || button === "{toggleHor}") {
  //     toggle()
  //     handleDirToggle()
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName
  let shiftToggle = currentLayout === "default" ? "shift" : "default"

  keyboard.setOptions({
    layoutName: shiftToggle
  })
}

function handleNumbers() {
  let currentLayout = keyboard.options.layoutName
  let numbersToggle = currentLayout !== "numbers" ? "numbers" : "default"

  keyboard.setOptions({
    layoutName: numbersToggle
  })
}

// function handleDirToggle() {
//   let currentLayout = keyboard.options.layoutName
//   let dirToggle = currentLayout !== "toggleHor" ? "toggleHor" : "default"

//   keyboard.setOptions({
//     layoutName: dirToggle
//   })
// }
