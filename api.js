import express from 'express';
import axios from 'axios';
import fs from 'fs';
import cors from 'cors';

// Create express app
const app = express();
app.use(cors()); // Enable CORS for browser requests
app.use(express.json());

// Define the search endpoint
app.get('/search', async (req, res) => {
  const searchTerm = req.query.q || 'default';
  
  try {
    const options = {
      method: 'GET',
      url: 'http://www.omdbapi.com/',
      params: {
        apikey: '1706919e', 
        s: searchTerm, 
        plot: 'full'
      }
    };

    // Make the API request
    const response = await axios.request(options);
    const data = response.data;
    
    // Write to JSON file
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log(`Data saved to data.json for search: "${searchTerm}" ✅`);
    
    // Send back the data to the client
    res.json({ success: true, data });
  } catch (error) {
    console.error("API error ❌:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server - try multiple ports in case some are in use
const ports = [3001, 3002, 3003, 8080, 8081];
let server;

// Try each port until one works
function tryPort(index) {
  if (index >= ports.length) {
    console.error("❌ Could not start server. All ports are in use.");
    process.exit(1);
    return;
  }

  const PORT = ports[index];
  
  server = app.listen(PORT)
    .on('listening', () => {
      console.log(`✅ Server running successfully on port ${PORT}`);
      console.log(`🔍 Search endpoint: http://localhost:${PORT}/search?q=your-search-term`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying next port...`);
        tryPort(index + 1);
      } else {
        console.error('Server error:', err);
      }
    });
}

// Start trying ports
tryPort(0);