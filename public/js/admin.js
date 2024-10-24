const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

let emergencyRequests = []; // Store emergency requests
let requestIdCounter = 1; // Counter to assign IDs to requests

// Route to submit an emergency request
app.post('/emergency', (req, res) => {
    const { lat, lng, emergencyType, radius } = req.body;
    let color;

    if (emergencyType.toLowerCase() === 'fire') {
        color = 'red';
    } else if (emergencyType.toLowerCase() === 'flood') {
        color = 'blue';
    } else {
        color = 'yellow';
    }

    // Create a new emergency request object
    const newRequest = {
        id: requestIdCounter++, // Assign an ID to the request
        lat,
        lng,
        radius,
        color,
        approved: false, // Initially set approved to false
    };

    emergencyRequests.push(newRequest);
    res.json({ color });
});

// Route to get all emergency requests
app.get('/emergencies', (req, res) => {
    res.json(emergencyRequests);
});

// Approve a request by ID
app.post('/emergency/approve/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const request = emergencyRequests.find(req => req.id === id);

    if (request) {
        request.approved = true; // Set the request as approved
        res.status(200).json({ message: 'Request approved', request });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// Deny a request by ID
app.post('/emergency/deny/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = emergencyRequests.findIndex(req => req.id === id);

    if (index !== -1) {
        emergencyRequests.splice(index, 1); // Remove the request from the array
        res.status(200).json({ message: 'Request denied and removed' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// Serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
