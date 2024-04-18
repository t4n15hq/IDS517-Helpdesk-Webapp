require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const upload = multer();

const app = express();
const port = process.env.PORT || 3000;

// Create a pool for MySQL connections
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser to parse JSON bodies and urlencoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure express-session for session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' } // for HTTPS use 'true', for HTTP 'false'
}));

// Root route that serves the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// User login route
app.post('api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);

        // const [users] = await pool.execute('SELECT * FROM Users WHERE email = ? and password = ?', [email, password])

        // Check if user exists
        if (users.length === 0) {
            // If no user is found, respond with an error
            return res.status(401).json({ message: 'Incorrect email or password' }); // 404 if no users
        }


        // else{
        //     req.session.userId = user.id;
        //     res.json({message: 'Login successful'});
        // }

        const user = users[0];
        // Use bcrypt to compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // If the password matches, set the session variable and respond with success
            req.session.userId = user.id; // Adjust according to your session logic
            res.json({ message: 'Login successful' });
        } else {
            // If the password does not match, respond with an error
            res.status(401).json({ message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

// API route to fetch all service requests
app.get('/api/requests', async (req, res) => {
    try {
        const [requests] = await pool.query('SELECT * FROM ServiceRequests');
        res.json(requests);
    } catch (error) {
        console.error('Failed to fetch service requests:', error);
        res.status(500).json({ message: 'Failed to fetch service requests' });
    }
});

app.get('/api/requests/search', async (req, res) => {
    const { id } = req.query; // Assuming the search is by 'id' query parameter
    try {
        const [results] = await pool.query('SELECT * FROM ServiceRequests WHERE RequestID = ?', [id]);
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching for ticket' });
    }
});

// API route to create a new service request
app.post('/api/requests/create',upload.none(), async (req, res) => {
    console.log(req.body);
    const problem = req.body.problem ?? null;
    const severity = req.body.severity ?? null;
    const submittedBy = req.body.submittedBy ?? null;
    const description = req.body.description ?? null;
    const priority = req.body.priority ?? null;
    const assignedTo = 'IT Helpdesk';
    const status = 'Open';
    const comment = 'In Progress';

    try {
        const [result] = await pool.execute(
            'INSERT INTO ServiceRequests (Problem, Severity, SubmittedBy, Description, Priority, AssignedTo, Status, Comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [problem, severity, submittedBy, description, priority, assignedTo, status, comment]
        );
        res.status(201).json({ message: 'New service request created successfully', requestID: result.insertId });
    } catch (error) {
        console.error('Failed to create service request:', error);
        res.status(500).json({ message: 'Failed to create service request' });
    }
});

// API route to mark a service request as resolved
app.patch('/api/requests/:requestId/resolve', async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const [result] = await pool.execute(
            'UPDATE ServiceRequests SET Status = ? WHERE RequestID = ?',
            ['Resolved', requestId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.json({ message: 'Service request marked as resolved.' });
    } catch (error) {
        console.error('Failed to mark as resolved:', error);
        res.status(500).json({ message: 'Failed to mark as resolved.' });
    }
});

// API route to return a service request for review
app.patch('/api/requests/:requestId/review', async (req, res) => {
    const requestId = req.params.requestId;
    try {
        const [result] = await pool.execute(
            'UPDATE ServiceRequests SET Status = ? WHERE RequestID = ?',
            ['Under Review', requestId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.json({ message: 'Service request returned for review.' });
    } catch (error) {
        console.error('Failed to return for review:', error);
        res.status(500).json({ message: 'Failed to return for review.' });
    }
});

// API route to adjust the priority of a service request
app.patch('/api/requests/:requestId/priority', async (req, res) => { // <-- Opening brace for app.patch
    const requestId = req.params.requestId;
    const { priority } = req.body;

    try { // <-- Opening brace for try block
        const [result] = await pool.execute(
            'UPDATE ServiceRequests SET Priority = ? WHERE RequestID = ?',
            [priority, requestId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service request not found' });
        }
        res.json({ message: 'Service request priority updated successfully' });
    } catch (error) { // <-- Opening brace for catch block
        console.error('Failed to update service request priority:', error);
        res.status(500).json({ message: 'Failed to update service request priority' });
    } // <-- Closing brace for catch block
    // There may be a missing closing brace here if the error is occurring.
}); // <-- Closing brace for app.patch
// Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM Users');
        res.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Fetch all service requests
app.get('/api/service-requests', async (req, res) => {
    try {
        const [requests] = await pool.query('SELECT * FROM ServiceRequests');
        res.json(requests);
    } catch (error) {
        console.error('Failed to fetch service requests:', error);
        res.status(500).json({ message: 'Failed to fetch service requests' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});