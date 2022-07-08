console.log("user.js is running!")
// var userUrl

fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(userIdArr => {
    console.log(userIdArr)
    // var userPage = document.getElementById("userPage")
    var tBodyUser = document.getElementById("tBodyUser")
    // var trUserCrossword = document.createElement("tr")
    // var tdUserCrossword = document.createElement("td")

    // for (let i = 0; i < userIdArr.length; i++) {
    for (let i = userIdArr.length - 1; i >= 0; i--) {
      var userCrossword = document.createElement("a")
      userCrossword.className = "userCrossword"
      userCrossword.id = "userCrossword" + `${i + 1}`
      userCrossword.style.display = "block"
      userCrossword.style.margin = "1em"
      userCrossword.href = `${document.location.origin + "/solve/" + userIdArr[i]._id}`
      userCrossword.innerText = document.location.origin + "/solve/" + userIdArr[i]._id
      // userCrossword.innerText = userIdArr[i].solution
      userPage.append(userCrossword)
    }

    for (let i = userIdArr.length - 1; i >= 0; i--) {
      var trUserCrossword = document.createElement("tr")
      trUserCrossword.className = "trUserCrossword"
      // trUserCrossword.id = "trUserCrossword" + `${i + 1}`
      trUserCrossword.id = `${i + 1}`
      var trId = trUserCrossword.id
      // for (var key in userIdArr[i]) {
      //   if (userIdArr[i][key] === "size") {
      //     tdUserCrossword.className = "tdUserCrossword"
      //     // tdUserCrossword.id = "tdUserCrossword" + `${key + 1}`
      //     tdUserCrossword.innerText = "hello"
      //   }
      // }
      // var tdUserCrossword = document.createElement("td")

      function DateF() {
        let tdUserCrossword = document.createElement("td")
        // for (var key in userIdArr[i]) {
        // }
        // tdUserCrossword.innerText = Date(userIdArr[i].createdAt)
        let dateC = new Date(userIdArr[i].createdAt)
        let options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }
        tdUserCrossword.innerText = new Intl.DateTimeFormat("en-US", options).format(dateC)
        tdUserCrossword.className = "tdDate"
        trUserCrossword.appendChild(tdUserCrossword)
      }
      DateF()

      function SolutionF() {
        let tdUserCrossword = document.createElement("td")
        tdUserCrossword.innerText = userIdArr[i].solution
        tdUserCrossword.className = "tdSolution"
        trUserCrossword.appendChild(tdUserCrossword)
      }
      SolutionF()

      function LinkF() {
        let tdUserCrossword = document.createElement("td")
        let tdAnchor = document.createElement("a")
        tdAnchor.href = `${document.location.origin + "/solve/" + userIdArr[i]._id}`
        tdAnchor.innerText = "link"
        tdUserCrossword.appendChild(tdAnchor)
        trUserCrossword.appendChild(tdUserCrossword)
      }
      LinkF()

      tBodyUser.append(trUserCrossword)
    }

    // querySelectorAll test
    // var tds = document.querySelectorAll("#tBodyUser tr"),
    //   i
    // var trCount = tds.length
    // console.log(tds)
    // for (let i = tds.length - 1; i >= 0; i--) {
    //   trCount -= 1
    //   for (let e = 1; e < tds.length + 1; e++) {
    //     console.log("tds[i].id: " + tds[i].id)
    //     console.log("e: " + e)
    //   }
    //   // console.log("trCount: " + trCount)
    //   // for (let i = 0; i < tds.length; ++i) {
    //   // if (i === tds[i]) {
    //   //   console.log("Great this will work!")
    //   // }
    //   // console.log("testing")
    //   // console.log(i)
    //   // console.log(tds[i])
    //   // console.log("tds[i].id: " + tds[i].id)
    // }

    // for (let i = userIdArr.length - 1; i >= 0; i--) {
    //   var tdUserCrossword = document.createElement("td")
    //   var trGet = document.getElementById(`${trUserCrossword.id}`)
    //   for (var key in userIdArr[i]) {
    //     // tdUserCrossword.id = "tdUserCrossword" + `${key + 1}`
    //     if (userIdArr[i][key] === ("size" || "solution")) {
    //       tdUserCrossword.className = "tdUserCrossword"
    //       // tdUserCrossword.id = "tdUserCrossword" + `${key + 1}`
    //       // tdUserCrossword.innerText = "hello"
    //     }
    //     // console.log(tdUserCrossword)
    //   }
    //   tdUserCrossword.innerText = userIdArr[i].size
    //   trGet.appendChild(tdUserCrossword)
    // }
    // console.log(tBodyUser)
    // console.log(userCrossword)
  })
