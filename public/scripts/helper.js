//@ Helper Functions and other reusable code blocks

function create_pLetter(pLetterText, button) {
  pLetterText.textContent = `${event.key.toUpperCase()}` || button.toUpperCase();
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
  });
  return;
}

//* Helper Function
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
const word = document.getElementById("word");

function dictionary() {
  const dictSubmit = document.getElementById("dictSubmit");
  dictSubmit.addEventListener("click", async e => {
    e.preventDefault();
    const listDict = document.getElementById("listDict");
    listDict.style.setProperty("background", "aliceblue");
    listDict.style.setProperty("border", "1px solid");
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
          return response.json();
        }
        return Promise.reject(response);
      })
      .then(function (data) {
        let dataArr = data[0].meta.syns.flat().slice(0, 10);
        // console.log(dataArr)

        //* Helper Function
        function createDictionaryList(entry) {
          const li = document.createElement("li");
          li.textContent = entry;
          return li;
        }

        removeAllChildNodes(listDict);

        for (let i = 0; i < dataArr.length; i++) {
          listDict.appendChild(createDictionaryList(`${dataArr[i]}`));
        }
      })
      .catch(function (error) {
        console.warn("Something went wrong.", error);
      });
  });
}

word.addEventListener("keydown", async e => {
  if (event.key === "Enter") {
    e.preventDefault();
    dictSubmit.click();
  }
});
