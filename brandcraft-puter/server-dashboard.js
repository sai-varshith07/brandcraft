const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Serve the dashboard HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-dashboard.html'));
});

// Serve the React app if available
app.get('/react', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Dashboard server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the dashboard`);
});