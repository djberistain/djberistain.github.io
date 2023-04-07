const myImage = document.querySelector("img");

myImage.onclick = () => 
{
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/soundwaves.jpg") {
    myImage.setAttribute("src", "images/skull.jpg");
  } else {
    myImage.setAttribute("src", "images/soundwaves.jpg");
  }
};

function openLogin() {
  document.getElementById("login-popup").style.display = "block";
}

function closeLogin() {
  document.getElementById("login-popup").style.display = "none";
}

function openProfileCreate() {
  document.getElementById("profileCreate-popup").style.display = "block";
}

function closeProfileCreate() {
  document.getElementById("profileCreate-popup").style.display = "none";
}
