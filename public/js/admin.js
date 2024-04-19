document.addEventListener('DOMContentLoaded', function() {
  // Fetch initial data
  fetchUsers();
  fetchServiceRequests();

  // Event listeners for modal actions
  setupModalListeners();

  // Event listener for adding a user
  document.getElementById('addUserForm').addEventListener('submit', function(event) {
      event.preventDefault();
      addNewUser(event.target);
  });
});

function setupModalListeners() {
  // Close modals when clicking outside of them
  window.onclick = function(event) {
      if (event.target.className.includes("modal")) {
          event.target.style.display = "none";
      }
  };

  // Close modal when clicking the 'x' button
  var closeButtons = document.getElementsByClassName("close");
  for (var i = 0; i < closeButtons.length; i++) {
      closeButtons[i].onclick = function() {
          var modal = this.closest('.modal');
          modal.style.display = "none";
      }
  }
}

function openTab(event, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  event.currentTarget.className += " active";
}

function showModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

async function addNewUser(formElement) {
  const formData = new FormData(formElement);
  
  try {
      const response = await fetch('/api/users', {
          method: 'POST',
          body: formData
      });
      if (response.ok) {
          console.log('User added successfully');
          closeModal('addUserModal');
          fetchUsers(); // Refresh the user list
      } else {
          console.error('Failed to add user');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

function fetchAllRequests() {
    fetch('/api/requests')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function fetchUsers() {
  // Existing fetchUsers implementation...
}

function fetchServiceRequests() {
  // Existing fetchServiceRequests implementation...
}

// Assume these functions will be triggered by buttons with data-user-id and data-request-id attributes
async function deleteUser(userId) {
  try {
      const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
      });
      if (response.ok) {
          console.log('User deleted successfully');
          fetchUsers(); // Refresh the user list
      } else {
          console.error('Failed to delete user');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

async function deleteServiceRequest(requestId) {
  try {
      const response = await fetch(`/api/requests/${requestId}`, {
          method: 'DELETE'
      });
      if (response.ok) {
          console.log('Service request deleted successfully');
          fetchServiceRequests(); // Refresh the requests list
      } else {
          console.error('Failed to delete service request');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

// Event delegation for handling delete actions from dynamically created buttons
document.addEventListener('click', function(event) {
  if (event.target.matches('.delete-user-btn')) {
      const userId = event.target.getAttribute('data-user-id');
      deleteUser(userId);
  } else if (event.target.matches('.delete-request-btn')) {
      const requestId = event.target.getAttribute('data-request-id');
      deleteServiceRequest(requestId);
  }
});

// Assuming the first tab should be open by default
openTab(new Event('click'), 'Users');




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
  
  document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
    fetchServiceRequests();
});

function fetchUsers() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const usersTableBody = document.getElementById('usersTable').querySelector('tbody');
        usersTableBody.innerHTML = ''; // Clear existing entries
        users.forEach(user => {
            const row = `<tr>
                            <td>${user.UserID}</td>
                            <td>${user.Name}</td>
                            <td>${user.Email}</td>
                            <td>${user.Role}</td>
                         </tr>`;
            usersTableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
}

fetch('/api/requests')
 .then(response => response.json())
 .then(data => {
   const tbody = document.getElementById('requestsTable');

   // Loop through data and create table rows
   data.forEach(request => {
     const tr = document.createElement('tr');

     // Populate table cells with request data
     tr.innerHTML = `
       <td>${request.RequestID}</td>
       <td>${request.Problem}</td>
       <td>${request.Priority}</td>
       <td>${request.Severity}</td>
       <td>${request.SubmittedBy}</td>
       <td>${request.Description}</td>
       <td>${request.Status}</td>
     `;

     tbody.appendChild(tr); // Append row to table body
   });
 })
 .catch(error => {
   console.error('Error fetching data:', error);
 });

function populateTable(requests) {
    const tbody = document.getElementById('requests-table-body');
    tbody.innerHTML = ''; // Clear existing rows

    requests.forEach(request => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${request.RequestID}</td>
            <td>${request.Problem}</td>
            <td>${request.Priority}</td>
            <td>${request.Severity}</td>
            <td>${request.SubmittedBy}</td>
            <td>${request.Description}</td>
            <td>${request.Status}</td>

        `;
        tbody.appendChild(tr);
    });
}
