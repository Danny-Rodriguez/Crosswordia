const table = document.getElementById("table")
const userArea = document.getElementById("userArea")

window.onload = () => {
  document.getElementById("bodyId").style.background = "#f1f1f1"
  fetch(document.location.origin + document.location.pathname + "/fetch")
    .then(response => response.json())
    .then(userArr => {
      if (userArr.length === 0) {
        document.getElementById("userAreaEmpty").style.display = "block"
        return
      }
      userArea.style.display = "block"
      table.style.display = "block"
      let tBodyUser = document.getElementById("tBodyUser")
      console.log(userArr)
      for (let i = userArr.length - 1; i >= 0; i--) {
        var trUserCrossword = document.createElement("tr")
        trUserCrossword.className = "trUserCrossword"
        // trUserCrossword.id = `${i + 1}`

        function DateF() {
          let tdUserCrossword = document.createElement("td")
          let dateC = new Date(userArr[i].createdAt)
          let options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          }
          tdUserCrossword.innerText = new Intl.DateTimeFormat("en-US", options).format(dateC)
          tdUserCrossword.className = "tdDate"
          trUserCrossword.appendChild(tdUserCrossword)
        }
        DateF()

        function SizeF() {
          let tdUserCrossword = document.createElement("td")
          tdUserCrossword.innerText = `${userArr[i].size}x${userArr[i].size}`
          tdUserCrossword.className = "tdSize"
          trUserCrossword.appendChild(tdUserCrossword)
        }
        SizeF()

        function SolutionF() {
          let tdUserCrossword = document.createElement("td")
          tdUserCrossword.innerText = userArr[i].solution
          tdUserCrossword.className = "tdSolution"
          trUserCrossword.appendChild(tdUserCrossword)
        }
        SolutionF()

        function LinkF() {
          let tdUserCrossword = document.createElement("td")
          tdUserCrossword.className = "tdLink"
          let tdAnchor = document.createElement("a")
          let linkIcon = document.createElement("i")
          linkIcon.className = "bi bi-link-45deg tdLinkIcon"
          tdAnchor.href = `${document.location.origin + "/solve/" + userArr[i]._id}`
          tdAnchor.innerText = "Go to Crossword"
          tdAnchor.appendChild(linkIcon)
          tdUserCrossword.appendChild(tdAnchor)
          trUserCrossword.appendChild(tdUserCrossword)
        }
        LinkF()

        function DeleteF() {
          let tdUserCrossword = document.createElement("td")
          tdUserCrossword.className = "tdDelete"
          let tdDeleteAnchor = document.createElement("a")
          let deleteIcon = document.createElement("i")
          deleteIcon.className = "bi bi-trash deleteIcon"
          tdDeleteAnchor.className = "btn btn-outline-danger tdDeleteAnchor"
          tdDeleteAnchor.href = `${document.location.origin + "/delete/" + userArr[i]._id}`
          tdDeleteAnchor.onclick = function () {
            growl()
          }
          tdDeleteAnchor.appendChild(deleteIcon)
          tdUserCrossword.appendChild(tdDeleteAnchor)
          trUserCrossword.appendChild(tdUserCrossword)
        }
        DeleteF()

        tBodyUser.append(trUserCrossword)
      }
    })
}

function growl() {
  GrowlNotification.notify({
    title: "Deleted Sucessfully!",
    image: {
      visible: true,
      customImage: "../img/info-outline.svg"
    },
    type: "info",
    position: "top-center",
    closeTimeout: 3000
  })
}
