document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndRenderCharts();
});

async function fetchDataAndRenderCharts() {
    try {
        const response = await fetch('/api/requests');
        const data = await response.json();
        const severityData = countBy(data, 'Severity');
        const statusData = countBy(data, 'Status');
        const priorityData = countBy(data, 'Priority');
        renderChart('severityChart', 'Service Requests by Severity', 'pie', Object.keys(severityData), Object.values(severityData));
        renderChart('statusChart', 'Service Requests by Status', 'doughnut', Object.keys(statusData), Object.values(statusData));
        renderChart('priorityChart', 'Service Requests by Priority', 'doughnut', Object.keys(priorityData), Object.values(priorityData));
    } catch (error) {
        console.error('Error:', error);
    }
}

function countBy(items, key) {
    const count = {};
    items.forEach(item => {
        count[item[key]] = (count[item[key]] || 0) + 1;
    });
    return count;
}

function renderChart(elementId, title, type, labels, data) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}
