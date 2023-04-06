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

let myButton = document.querySelector("#user_change");
let myHeading = document.querySelector("h1");

myButton.onclick = () =>
{
    setUserName();
}

function setUserName() 
{
    const myName = prompt("Please enter your name.");
    localStorage.setItem("name", myName);
    myHeading.textContent = `Welcome to Jamspace, ${myName}`;
}
  
if (!localStorage.getItem("name")) 
  {
    setUserName();
  } else {
    const storedName = localStorage.getItem("name");
    myHeading.textContent = `Welcome to Jamspace, ${storedName}`;
  }


