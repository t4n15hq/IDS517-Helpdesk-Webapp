document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newRequestForm'); // Ensure your form has this ID

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Prepare the form data for sending
        const formData = new FormData(form);

        // If you want to see the form data for debugging:
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        try {
            const response = await fetch('/api/requests/create', { // This should match your Express route
                method: 'POST',
                body: formData, // FormData will take care of setting the correct 'Content-Type' header
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Handle the successful response here
            console.log('Success:', data);
            alert('Service request created successfully!');

            // Optionally, reset the form or redirect the user
            form.reset();
            // window.location.href = '/success-page'; // Redirect if needed
        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
            alert('Failed to create service request.');
        }
    });
});
