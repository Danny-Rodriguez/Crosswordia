// This file will run on every single webpage

var userUrl
// var profileName = document.getElementById("profileName")

fetch("/profile")
  .then(response => response.json())
  .then(profileObj => {
    console.log("Main.js profileObj: " + profileObj.firstName)
    // let profileName = document.getElementById("profileName")
    let profileName = document.getElementsByClassName("profileName")
    Array.from(profileName).forEach(element => {
      element.innerText = "Danny"
    })
    // profileName.innerText = profileObj.firstName
    let profilePic = document.getElementById("profilePic")
    profilePic.src = `${profileObj.image}`
    // let image = document.createElement("img")
    // localStorage.setItem("profilePic", `${profileObj.image}`)
    // localStorage.setItem("profileName", `${profileObj.firstName}`)
    // profilePic.src = profileObj.image
    // if (profilePic.src === "") {
    // }
    // profilePic.src = localStorage.getItem("profilePic")
    // console.log(profilePic.src)

    // profileName.innerText = `${profileObj.firstName}`

    // profileName.innerText = localStorage.getItem("profileName")
    console.log("profileName: " + profileName)
    // profilePic.appendChild(image)
  })

// Adds user's profile page
var userPageBtn = document.getElementById("userPageBtn")
userPageBtn.addEventListener("click", async () => {
  let googleId
  const example = {
    // googleId: req.user.googleId
    googleId: googleId
  }
  const test = await fetch("/user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(example)
  })
    .then(res => {
      // console.log(res)
      // console.log(res.url)
      // theRes = res
      userUrl = res.url
      let copyUrl = document.getElementById("copyUrl")
      copyUrl.innerText = `${userUrl}`
    })
    .catch(err => {
      console.error(err)
    })
  document.location = `${userUrl}`
})
