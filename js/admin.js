// Function to open a specific tab
function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    // Hide all elements with class="tabcontent" by default
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the specific tab content
    document.getElementById(tabName).style.display = "block";
    // Add the specific color to the button used to open the tab content
    event.currentTarget.className += " active";
  }
  
  // Function to show a modal
  function showModal(modalId) {
    // Display the modal by setting the style to "block"
    document.getElementById(modalId).style.display = "block";
  }
  
  // Function to close a modal
  function closeModal(modalId) {
    // Hide the modal by setting the style to "none"
    document.getElementById(modalId).style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target.className.includes("modal")) {
      // If the modal is open (display property isn't "none"), close it
      event.target.style.display = "none";
    }
  }
  
  // Close modal when clicking the 'x' button
  var closeButtons = document.getElementsByClassName("close");
  for (var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].onclick = function() {
      var modal = this.parentElement.parentElement;
      modal.style.display = "none";
    }
  }
  
  // Open the default tab
  document.getElementsByClassName("tablinks")[0].click();
  