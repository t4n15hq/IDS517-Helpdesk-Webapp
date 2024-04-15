document.addEventListener('DOMContentLoaded', () => {
    fetchAllRequests();

    document.getElementById('search-button').addEventListener('click', searchTickets);
});

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

function searchTickets() {
    const ticketId = document.getElementById('ticket-id').value.trim();

    // Construct the URL based on whether a ticket ID was provided
    const url = ticketId ? `/api/requests/search?id=${encodeURIComponent(ticketId)}` : '/api/requests';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('requests-table-body');
            tbody.innerHTML = ''; // Clear existing table rows

            // Check if data is not an array (for single search result) or is empty
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No results found');
            }

            // Loop through data and create table rows
            data.forEach(request => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${request.RequestID}</td>
                    <td>${request.Problem}</td>
                    <td>${request.Priority}</td>
                    <td>${request.Severity}</td>
                    <td>${request.Description}</td>
                    <td>${request.Status}</td>
                    <td>${request.Comment}</td>
                    <td>${request.SubmittedBy}</td>
                    <td>${new Date(request.Timestamp).toLocaleString()}</td>
                    <td>${request.ResolutionDate ? new Date(request.ResolutionDate).toLocaleDateString() : 'N/A'}</td>
                `;
                tbody.appendChild(tr); // Append row to table body
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const tbody = document.getElementById('requests-table-body');
            tbody.innerHTML = `<tr><td colspan="10">${error.message}</td></tr>`; // Show error message in the table
        });
}

 // Fetch data from backend server
 fetch('/api/requests')
 .then(response => response.json())
 .then(data => {
   const tbody = document.getElementById('requests-table-body');

   // Loop through data and create table rows
   data.forEach(request => {
     const tr = document.createElement('tr');

     // Populate table cells with request data
     tr.innerHTML = `
       <td>${request.RequestID}</td>
       <td>${request.Problem}</td>
       <td>${request.Priority}</td>
       <td>${request.Severity}</td>
       <td>${request.Description}</td>
       <td>${request.Status}</td>
       <td>${request.Comment}</td>
       <td>${request.SubmittedBy}</td>
       <td>${request.Timestamp}</td>
       <td>${request.ResolutionDate}</td>
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
            <td>${request.Description}</td>
            <td>${request.Status}</td>
            <td>${request.Comment}</td>
            <td>${request.SubmittedBy}</td>
            <td>${new Date(request.Timestamp).toLocaleString()}</td>
            <td>${request.ResolutionDate ? new Date(request.ResolutionDate).toLocaleDateString() : 'N/A'}</td>
        `;
        tbody.appendChild(tr);
    });
}
