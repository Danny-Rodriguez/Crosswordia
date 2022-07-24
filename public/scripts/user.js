// console.log("user.js is running!")

fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(userIdArr => {
    // console.log(userIdArr)
    var tBodyUser = document.getElementById("tBodyUser")

    // function UserInfo() {
    //   let userArea = document.getElementById("userArea")
    //   let userImage = document.createElement("img")
    //   userImage.src = `${userIdArr[2]}`
    //   userArea.innerText = `Hello ${userIdArr[1]}`
    //   userArea.appendChild(userImage)
    // }
    // UserInfo()

    for (let i = userIdArr.length - 1; i >= 0; i--) {
      // for (let i = userIdArr[0].length - 1; i >= 0; i--) {
      var trUserCrossword = document.createElement("tr")
      trUserCrossword.className = "trUserCrossword"
      trUserCrossword.id = `${i + 1}`

      function DateF() {
        let tdUserCrossword = document.createElement("td")
        let dateC = new Date(userIdArr[i].createdAt)
        // let dateC = new Date(userIdArr[0][i].createdAt)
        let options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }
        tdUserCrossword.innerText = new Intl.DateTimeFormat("en-US", options).format(dateC)
        tdUserCrossword.className = "tdDate"
        trUserCrossword.appendChild(tdUserCrossword)
      }
      DateF()

      function SizeF() {
        let tdUserCrossword = document.createElement("td")
        tdUserCrossword.innerText = `${userIdArr[i].size}x${userIdArr[i].size}`
        // tdUserCrossword.innerText = `${userIdArr[0][i].size}x${userIdArr[0][i].size}`
        tdUserCrossword.className = "tdSize"
        trUserCrossword.appendChild(tdUserCrossword)
      }
      SizeF()

      function SolutionF() {
        let tdUserCrossword = document.createElement("td")
        tdUserCrossword.innerText = userIdArr[i].solution
        // tdUserCrossword.innerText = userIdArr[0][i].solution
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
        // tdAnchor.href = `${document.location.origin + "/solve/" + userIdArr[0][i]._id}`
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
        // tdDeleteAnchor.style.display: "inline"
        // tdDeleteAnchor.href = `${document.location.origin + "/delete/" + userIdArr[0][i]._id}`
        tdDeleteAnchor.href = `${document.location.origin + "/delete/" + userIdArr[i]._id}`
        // tdDeleteAnchor.innerText = "Delete"
        tdDeleteAnchor.appendChild(deleteIcon)
        tdUserCrossword.appendChild(tdDeleteAnchor)
        trUserCrossword.appendChild(tdUserCrossword)
      }
      DeleteF()

      tBodyUser.append(trUserCrossword)
    }
  })
