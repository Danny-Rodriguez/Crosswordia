let userUrl

//if not cache or localStorage, fetch

fetch("/profile")
  .then(response => response.json())
  .then(profileObj => {
    let profileName = document.getElementsByClassName("profileName")
    Array.from(profileName).forEach(element => {
      // element.innerText = "Danny"
      // if (sessionStorage.length === 0) {
      //   sessionStorage.setItem("firstName", `${profileObj.firstName}`)
      // }
      element.innerText = `${profileObj.firstName}`
      // element.innerText = sessionStorage.getItem("firstName")
    })
    // profileName.innerText = profileObj.firstName
    let profilePic = document.getElementById("profilePic")
    profilePic.src = `${profileObj.image}`
  })

// Adds user's profile page
let userPageBtn = document.getElementById("userPageBtn")
userPageBtn.addEventListener("click", async () => {
  let user
  const example = {
    user
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
      userUrl = res.url
      // let copyUrl = document.getElementById("copyUrl")
      // copyUrl.innerText = `${userUrl}`
    })
    .catch(err => {
      console.error(err)
    })
  document.location = `${userUrl}`
})
