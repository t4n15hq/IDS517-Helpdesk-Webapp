document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newRequestForm');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const severity = formData.get('severity');

        try {
            const response = await fetch('/api/requests/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const responseTime = getResponseTimeBySeverity(severity);
            const slaMessage = `Helpdesk team will reach out to you within ${responseTime}.`;
            showModal(`Your request has been submitted successfully. ${slaMessage}`);

            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create service request.');
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function getResponseTimeBySeverity(severity) {
        const responseTimes = {
            "Severity 1 - Critical: System Down": "1 hour",
            "Severity 2 - High: Major Functionality Impaired": "2 hours",
            "Severity 3 - Medium: Minor Functionality Impaired": "3 hours",
            "Severity 4 - Low: Cosmetic Issues": "4 hours",
        };
        return responseTimes[severity] || "N/A";
    }

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = "block";
    }
});