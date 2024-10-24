import express from "express";
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Store incoming emergency requests
let emergencyRequests = [];

// Handle the POST request from the frontend
app.post('/emergency', (req, res) => {
    const { locationName, emergencyType, lat, lng, radius } = req.body;

    // Log the received request
    console.log(`Emergency Type: ${emergencyType}, Location: (${lat}, ${lng}), Radius: ${radius}`);

    // Save request for admin approval (you could forward this to admin via different means)
    emergencyRequests.push({ locationName, emergencyType, lat, lng, radius, status: 'pending' });

    // Determine circle color based on emergency type
    let color;
    if (emergencyType.toLowerCase() === 'fire') {
        color = 'red';
    } else if (emergencyType.toLowerCase() === 'flood') {
        color = 'blue';
    } else if (emergencyType.toLowerCase() === 'earthquake') {
        color = 'yellow';
    } else if (emergencyType.toLowerCase() === 'storm') {
        color = 'green';
    } else {
        color = 'gray';  // Default color for unknown emergencies
    }

    // Build custom URL with query parameters
    const customEndpoint = `/admin?locationName=${encodeURIComponent(locationName)}&emergencyType=${encodeURIComponent(emergencyType)}&lat=${lat}&lng=${lng}&radius=${radius}`;

    // Redirect to the custom endpoint
    res.redirect(customEndpoint);
});

// Endpoint for admin to fetch all pending requests
app.get('/admin/emergency-requests', (req, res) => {
    res.json(emergencyRequests.filter(req => req.status === 'pending'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
