const bodyId = document.getElementById("bodyId")
bodyId.style.background = "#f1f1f1"
const userPage = document.getElementById("userPage")
// const table = document.querySelector("div.table-responsive")
const table = document.getElementById("table")
const userArea = document.getElementById("userArea")

fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(userIdArr => {
    let tBodyUser = document.getElementById("tBodyUser")
    console.log(userIdArr)
    for (let i = userIdArr.length - 1; i >= 0; i--) {
      var trUserCrossword = document.createElement("tr")
      trUserCrossword.className = "trUserCrossword"
      trUserCrossword.id = `${i + 1}`

      function DateF() {
        let tdUserCrossword = document.createElement("td")
        let dateC = new Date(userIdArr[i].createdAt)
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
        tdUserCrossword.innerText = `${userIdArr[i].size}x${userIdArr[i].size}`
        tdUserCrossword.className = "tdSize"
        trUserCrossword.appendChild(tdUserCrossword)
      }
      SizeF()

      function SolutionF() {
        let tdUserCrossword = document.createElement("td")
        tdUserCrossword.innerText = userIdArr[i].solution
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
        tdAnchor.href = `${document.location.origin + "/solve/" + userIdArr[i]._id}`
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
        tdDeleteAnchor.href = `${document.location.origin + "/delete/" + userIdArr[i]._id}`
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
    if (tBodyUser.childElementCount === 0) {
      table.style.display = "none"
      userArea.style.width = "max-content"
      userArea.innerHTML = `Hello <p class="profileName" id="profileNameUser" referrerpolicy="no-referrer" style="display: inline"></p>! You haven't made any crosswords so far...`
      const profileNameUser = document.getElementById("profileNameUser")
      // profileNameUser.innerText = sessionStorage.getItem("firstName")
    }
  })

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
