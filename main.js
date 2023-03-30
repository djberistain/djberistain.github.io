// Define a function that will be called when the "Create User" button is clicked
function createUser() {
    // Prompt the user to enter their username
    var username = prompt("Enter your username:");
  
    // If the user entered a username, display a message with their username
    if (username) {
      alert("Welcome to Jamspace, " + username + "!");
    }
  }
  
  // Add a click event listener to the "Create User" button when the page is loaded
  window.onload = function() {
    document.getElementById("create-user-btn").addEventListener("click", createUser);
  }
  