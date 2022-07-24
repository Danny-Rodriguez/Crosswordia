// This file will run on every single webpage

fetch("/profile")
  .then(response => response.json())
  .then(profileObj => {
    console.log(profileObj)
    let profilePic = document.getElementById("profilePic")
    // let image = document.createElement("img")
    profilePic.src = profileObj.image
    let profileName = document.getElementById("profileName")
    profileName.innerText = profileObj.firstName
    // profilePic.appendChild(image)
  })
