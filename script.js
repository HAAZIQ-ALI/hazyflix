// Initialize search term
import data from './data.json' assert { type: 'json' };
let searchTerm = "default";

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.querySelector('#search-bar');
  let timer;
  
  // Add event listener to search bar
  searchBar.addEventListener("input", s => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const value = s.target.value.trim();
      console.log("Searching for:", value);
      
      if (value) {
        // Save search term
        searchTerm = value;
        
        // Send to Node.js server to search and save to JSON file
        searchMovies(value);
      }
    }, 2000);
  });
});

// Function to send search request to our local Node.js server
async function searchMovies(query) {
  try {
    console.log("Sending search request to server:", query);
    
    // Try different ports that our server might be running on
    const ports = [3001, 3002, 3003, 8080, 8081];
    let response;
    let connected = false;
    
    // Try each port until we find the server
    for (const port of ports) {
      try {
        response = await fetch(`http://localhost:${port}/search?q=${encodeURIComponent(query)}`, {
          signal: AbortSignal.timeout(500) // Quick timeout to try next port
        });
        connected = true;
        console.log(`✅ Connected to server on port ${port}`);
        break;
      } catch (err) {
        console.log(`Port ${port} not available, trying next...`);
      }
    }
    
    if (!connected) {
      throw new Error("Could not connect to server. Make sure the Node.js server is running (npm start)");
    }
    
    const result = await response.json();
    
    if (result.success) {
      console.log("Search successful! Data saved to data.json ✅");
      console.log("API Response:", result.data);
      
      // Display results on the page
      displayResults(result.data);
    } else {
      console.error("Search failed:", result.error);
    }
    
  } catch (error) {
    console.error("Server error ❌:", error.message);
    alert("Error connecting to server. Make sure the Node.js server is running (node api.js)");
  }
}// Function to display results on the page
function displayResults(data) {
  // For now, just log it
  console.log("Ready to display:", data.Search?.length || 0, "results");
  
  // Here you would update the UI with the search results
  // This is where you'd add code to show the movies in your page
}


const moviePlace = document.getElementById('movie-place');
