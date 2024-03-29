let Keyboard = window.SimpleKeyboard.default

let keyboard = new Keyboard({
  // onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  mergeDisplay: true,
  layoutName: "default",
  layout: {
    // default: ["q w e r t y u i o p", "a s d f g h j k l", "{toggleVert} z x c v b n m {backspace}", "{reveal} {space} {check}"]
    default: ["Q W E R T Y U I O P", "A S D F G H J K L", "{toggleVert} Z X C V B N M {backspace}", "{reveal} {space} {check}"]
    // numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
  },
  display: {
    // "{numbers}": "123",
    "{reveal}": "Reveal",
    "{black}": "Black",
    "{finish}": "Finish",
    // "{ent}": "return",
    // "{ent}": "Check",
    "{check}": "Check",
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
})

// console.log(keyboard)

function onKeyPress(button) {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: button
    })
  )
}

const toggleVert = document.querySelector(".hg-button-toggleVert")
toggleVert.style.setProperty("background", "#45cafc", "important")
toggleVert.style.setProperty("color", "aliceblue", "important")

const checkBtn = document.querySelector(".hg-button-check")
checkBtn.style.setProperty("background", "#0a66c2", "important")
checkBtn.style.setProperty("color", "aliceblue", "important")
