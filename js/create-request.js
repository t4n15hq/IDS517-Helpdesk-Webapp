document.getElementById('newRequestForm').onsubmit = function(e) {
    e.preventDefault(); // Prevents the default form submission action
    alert('Form submitted. ');
    // Here you would typically handle the form data,
    // possibly sending it to a server or processing it as needed.
};
