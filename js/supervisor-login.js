// Data for dropdowns
const problems = [
    "Network Connectivity Issue", "Software Installation Problem", "Hardware Malfunction",
    "Password Reset Request", "Printer not Working", "Email Configuration Issue",
    "File Access Permission Problem", "Slow System Performance", "Website Access Problem",
    "Application Crashing", "Data Backup Request", "System Update Request", "Account Lockout Issue"
];

const severities = [
    "Severity 1 - Critical: System Down",
    "Severity 2 - High: Major Functionality Impaired",
    "Severity 3 - Medium: Minor Functionality Impaired",
    "Severity 4 - Low: Cosmetic Issues"
];

const priorities = [
    "Priority 1 - Immediate", "Priority 2 - High", "Priority 3 - Medium", "Priority 4 - Low"
];

// Function to populate a select element with options
function populateSelect(elementId, options) {
    const select = document.getElementById(elementId);
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerHTML = option;
        select.appendChild(opt);
    });
}

// Populate the dropdowns when the window loads
document.addEventListener('DOMContentLoaded', function() {
    populateSelect('problem-select', problems);
    populateSelect('severity-select', severities);
    populateSelect('priority-select', priorities);
});

// Add event listeners to your buttons for their respective functionalities
document.getElementById('mark-resolved').addEventListener('click', function() {
    // Add logic to mark as resolved
});

document.getElementById('return-review').addEventListener('click', function() {
    // Add logic to return for review
});

document.getElementById('adjust-priority').addEventListener('click', function() {
    // Add logic to adjust priority
});
