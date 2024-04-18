document.addEventListener('DOMContentLoaded', () => {
  const markResolvedButton = document.getElementById('mark-resolved');
  const returnReviewButton = document.getElementById('return-review');
  const adjustPriorityButton = document.getElementById('adjust-priority');
  const prioritySelect = document.getElementById('priority-select');
  let selectedRequestId = null;

  // Fetch and populate table on page load
  fetchServiceRequests();

  // Fetch service requests from the server
  function fetchServiceRequests() {
      fetch('/api/requests')
          .then(response => response.json())
          .then(data => {
              populateTable(data);
          })
          .catch(error => console.error('Error fetching service requests:', error));
  }

  // Populate the service requests table
  function populateTable(requests) {
      const tableBody = document.querySelector('.supervisor-requests-table tbody');
      tableBody.innerHTML = '';

      requests.forEach(request => {
          const tr = document.createElement('tr');
          tr.dataset.requestId = request.RequestID; // Set the request ID on the dataset for easy access
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
              if (selectedRequestId !== this.dataset.requestId) {
                  selectedRequestId = this.dataset.requestId;
                  document.querySelectorAll('.supervisor-requests-table tr.selected').forEach(row => {
                      row.classList.remove('selected');
                  });
                  this.classList.add('selected');
              } else {
                  selectedRequestId = null;
                  this.classList.remove('selected');
              }
          });
          tableBody.appendChild(tr);
      });
  }

  markResolvedButton.addEventListener('click', () => handleStatusChange('Resolved'));
  returnReviewButton.addEventListener('click', () => handleStatusChange('Under Review'));
  adjustPriorityButton.addEventListener('click', () => handlePriorityChange());

  function handleStatusChange(newStatus) {
      if (selectedRequestId) {
          const endpoint = newStatus === 'Resolved' ? 'resolve' : 'review';
          fetch(`/api/requests/${selectedRequestId}/${endpoint}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' }
          })
          .then(response => response.json())
          .then(data => {
              alert(data.message);
              fetchServiceRequests(); // Re-fetch data to update the table
          })
          .catch(error => console.error('Error:', error));
      } else {
          alert('Please select a request first.');
      }
  }

  function handlePriorityChange() {
      if (selectedRequestId) {
          const newPriority = prioritySelect.value;
          fetch(`/api/requests/${selectedRequestId}/priority`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ priority: newPriority })
          })
          .then(response => response.json())
          .then(data => {
              alert(data.message);
              fetchServiceRequests(); // Re-fetch data to update the table
          })
          .catch(error => console.error('Error:', error));
      } else {
          alert('Please select a request first.');
      }
  }
});
