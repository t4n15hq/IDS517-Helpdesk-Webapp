document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    // This element is for displaying error messages related to signup
    const errorMessageDiv = document.createElement('div');
    errorMessageDiv.id = 'error-message';
    signupForm.parentNode.insertBefore(errorMessageDiv, signupForm.nextSibling); // Insert the error message div right after the signup form
    
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Clear previous error messages every time the form is submitted
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.color = 'red'; // Set the color for error messages
        errorMessageDiv.style.marginTop = '10px'; // Some spacing for better readability
        
        const formData = new FormData(signupForm);
        
        // The fetch API is used to post the form data to the server-side '/signup' endpoint
        fetch('/signup', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                // If the server responds with a client or server error status code,
                // attempt to parse the error message and throw it as a JavaScript error
                return response.json().then(errorResponse => {
                    throw new Error(errorResponse.message || 'Something went wrong, please try again.');
                });
            }
            // Assuming the server responds with JSON containing the status of the operation
            return response.json();
        })
        .then(data => {
            // Upon successful signup, log the server's response for debugging and redirect the user
            console.log('Signup successful:', data);
            window.location.href = 'index.html'; // Redirect to the login page or a confirmation page
        })
        .catch(error => {
            // If there's an error during signup (either from the server or network issues),
            // display it to the user in the errorMessageDiv
            console.error('Signup failed:', error);
            errorMessageDiv.textContent = error.message;
        });
    });
});
