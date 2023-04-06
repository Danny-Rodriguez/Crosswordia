let beginner = document.querySelectorAll(".beginner");
let intermediate = document.querySelectorAll(".intermediate");
let advanced = document.querySelectorAll(".advanced ");

document.querySelector(".bg-success").addEventListener("click", () => {
  // alert("Hi");
  for (let i = 0; i < beginner.length; i++) {
    beginner[i].style.setProperty("display", "", "important");
  }

  for (let i = 0; i < intermediate.length; i++) {
    intermediate[i].style.setProperty("display", "none", "important");
  }

  for (let i = 0; i < advanced.length; i++) {
    advanced[i].style.setProperty("display", "none", "important");
  }
});

document.querySelector(".bg-warning").addEventListener("click", () => {
  // alert("Hi");

  for (let i = 0; i < beginner.length; i++) {
    beginner[i].style.setProperty("display", "none", "important");
  }

  for (let i = 0; i < intermediate.length; i++) {
    intermediate[i].style.setProperty("display", "", "important");
  }

  for (let i = 0; i < advanced.length; i++) {
    advanced[i].style.setProperty("display", "none", "important");
  }
});

document.querySelector(".bg-danger").addEventListener("click", () => {
  // alert("Hi");
  for (let i = 0; i < beginner.length; i++) {
    beginner[i].style.setProperty("display", "none", "important");
  }

  for (let i = 0; i < intermediate.length; i++) {
    intermediate[i].style.setProperty("display", "none", "important");
  }

  for (let i = 0; i < advanced.length; i++) {
    advanced[i].style.setProperty("display", "", "important");
  }
});
