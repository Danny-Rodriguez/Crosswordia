//@ Helper Functions and other reusable code blocks

function create_pLetter(pLetterText) {
  pLetterText.textContent = `${event.key.toUpperCase()}`
}

function forgotToFill() {
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

//* Helper Function
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function dictionary() {
  const dictSubmit = document.getElementById("dictSubmit")
  dictSubmit.addEventListener("click", async event => {
    event.preventDefault()
    const word = document.getElementById("word")
    const listDict = document.getElementById("listDict")
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
        // console.log(dataArr)

        //* Helper Function
        function createDictionaryList(entry) {
          const li = document.createElement("li")
          li.textContent = entry
          return li
        }

        if (listDict.childElementCount >= 10) {
          removeAllChildNodes(listDict)
        }

        for (let i = 0; i < dataArr.length; i++) {
          listDict.appendChild(createDictionaryList(`${dataArr[i]}`))
        }
      })
      .catch(function (error) {
        console.warn("Something went wrong.", error)
      })
  })
}
