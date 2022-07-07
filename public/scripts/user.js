console.log("user.js is running!")
// var userUrl

fetch(document.location.origin + document.location.pathname + "/fetch")
  .then(response => response.json())
  .then(userIdArr => {
    console.log(userIdArr)
    var userPage = document.getElementById("userPage")

    for (let i = 0; i < userIdArr.length; i++) {
      let userCrossword = document.createElement("div")
      userCrossword.className = "userCrossword"
      userCrossword.id = `${"userCrossword" + i + 1}`
      userCrossword.innerText = document.location.origin + "/solve/" + userIdArr[i]
      userPage.append(userCrossword)
    }
  })

// await fetch(document.location.origin + document.location.pathname + "/fetch")
// .then(crossword => {})
// var userPageBtn = document.getElementById("userPageBtn")
// userPageBtn.addEventListener("click", async () => {
// let googleId
// const example = {
//   // googleId: req.user.googleId
//   googleId: googleId
// }
// const test = await fetch("/user", {
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify(example)
// })
//   .then(res => {
//     // console.log(res)
//     // console.log(res.url)
//     // theRes = res
//     userUrl = res.url
//     console.log(res)
//   })
//   .catch(err => {
//     console.error(err)
//   })
//   document.location = `${userUrl}`
// })
