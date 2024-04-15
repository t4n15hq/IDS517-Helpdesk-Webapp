document.addEventListener('DOMContentLoaded', () => {
    // Fetch service requests from the server and populate the table
    fetchServiceRequests();
  

    function updateStatus(requestId, newStatus) {
        fetch(`/api/requests/${requestId}/status`, { // The endpoint might be different in your actual application
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // Refresh your table or give some visual cue of success
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
    }
    

    // Event listener for "Mark as Resolved" button
    document.getElementById('mark-resolved').addEventListener('click', function() {
        const selectedRequest = getSelectedRequest();
        if (selectedRequest) {
            updateStatus(selectedRequest, 'Resolved');
        } else {
            alert('Please select a request to mark as resolved.');
        }
    });
  
    // Event listener for "Return for Review" button
    document.getElementById('return-review').addEventListener('click', function() {
        const selectedRequest = getSelectedRequest();
        if (selectedRequest) {
            updateStatus(selectedRequest, 'Under Review');
        } else {
            alert('Please select a request to return for review.');
        }
    });
  
    // Event listener for "Adjust Priority" button
    document.getElementById('adjust-priority').addEventListener('click', async () => {
      const selectedRequestId = getSelectedRequestId();
      const prioritySelect = document.getElementById('priority-select');
      const newPriority = prioritySelect.value;
      if (selectedRequestId) {
        await updateRequestPriority(selectedRequestId, newPriority);
        fetchServiceRequests();
      }
    });
  });
  
  // Function to fetch service requests from the server
  async function fetchServiceRequests() {
    try {
      const response = await fetch('/api/requests');
      const requests = await response.json();
      populateRequestsTable(requests);
    } catch (error) {
      console.error('Failed to fetch service requests:', error);
    }
  }
  
  // Function to update the status of a service request
  async function updateRequestStatus(requestId, newStatus) {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
  }
  
  // Function to update the priority of a service request
  async function updateRequestPriority(requestId, newPriority) {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update request priority:', error);
    }
  }
  
  // Function to get the ID of the selected service request
  function getSelectedRequestId() {
    // Implement logic to get the selected request ID from the table
    // For example, you could add a checkbox or radio button to each row
    // and retrieve the ID of the checked row
    const selectedRow = document.querySelector('.supervisor-requests-table tbody tr.selected');
    if (selectedRow) {
      const requestIdCell = selectedRow.querySelector('td:first-child');
      return requestIdCell.textContent;
    }
    return null;
  }
  
  // Function to populate the service requests table
  function populateRequestsTable(requests) {
    const tableBody = document.querySelector('.supervisor-requests-table tbody');
    tableBody.innerHTML = '';
  
    requests.forEach((request) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.RequestID}</td>
        <td>${request.Problem}</td>
        <td>${request.Severity}</td>
        <td>${request.Priority}</td>
        <td>${request.SubmittedBy}</td>
        <td>${request.Description}</td>
        <td>${request.Status}</td>
        <td>${request.Timestamp}</td>
        <td>${request.ResolutionDate || '-'}</td>
      `;
  
      // Add event listener for row click
      row.addEventListener('click', () => {
        // Remove the 'selected' class from all rows
        const rows = document.querySelectorAll('.supervisor-requests-table tbody tr');
        rows.forEach((row) => row.classList.remove('selected'));
  
        // Add the 'selected' class to the clicked row
        row.classList.add('selected');
      });
  
      tableBody.appendChild(row);
    });
  }

  function populateTable(requests) {
    const tableBody = document.querySelector('.supervisor-requests-table tbody');
    tableBody.innerHTML = '';

    requests.forEach(request => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${request.RequestID}</td>
            <td>${request.Problem}</td>
            <td>${request.Severity}</td>
            <td>${request.Priority}</td>
            <td>${request.SubmittedBy}</td>
            <td>${request.Description}</td>
            <td>${request.Status}</td>
            <td>${new Date(request.Timestamp).toLocaleString()}</td>
            <td>${request.ResolutionDate ? new Date(request.ResolutionDate).toLocaleDateString() : 'Pending'}</td>
        `;
        tr.addEventListener('click', function() {
            // Deselect all other rows
            document.querySelectorAll('.supervisor-requests-table tr').forEach(row => {
                row.classList.remove('selected');
            });
            // Select this row
            tr.classList.add('selected');
        });
        tableBody.appendChild(tr);
    });
}

function getSelectedRequest() {
    const selectedRow = document.querySelector('.supervisor-requests-table tr.selected');
    if (selectedRow) {
        return selectedRow.cells[0].textContent; // assuming the ID is in the first cell
    }
    return null;
}
