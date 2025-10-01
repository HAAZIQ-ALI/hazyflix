// Initialize search term
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

  // Add event listener to Hazy List button
  const buttons = document.querySelectorAll('button');
  const hazyListBtn = buttons[1]; // Second button is Hazy List
  
  if (hazyListBtn) {
    hazyListBtn.addEventListener('click', () => {
      console.log('Loading Hazy List...');
      loadHazyList();
      
      // Scroll to movie section
      document.getElementById('movie-place').scrollIntoView({ behavior: 'smooth' });
    });
  }
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
}

// Function to display results on the page
function displayResults(data) {
  // For now, just log it
  console.log("Ready to display:", data.Search?.length || 0, "results");
  
  // Here you would update the UI with the search results
  // This is where you'd add code to show the movies in your page
}

const moviePlace = document.getElementById('movie-place');

// Load and display Hazy List from oldData.json
async function loadHazyList() {
  try {
    const response = await fetch('/oldData.json');
    const hazyMovies = await response.json();
    
    displayHazyList(hazyMovies);
  } catch (error) {
    console.error('Error loading Hazy List:', error);
  }
}

// Display Hazy List movies
function displayHazyList(movies) {
  moviePlace.innerHTML = ''; // Clear previous content
  
  movies.forEach(movie => {
    const movieCard = createMovieCard(movie);
    moviePlace.appendChild(movieCard);
  });
}

// Create a movie card element
function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card bg-[#0D0A20]  overflow-hidden hover:scale-110 transition-transform duration-100 cursor-pointer shadow-lg relative';
  
  card.innerHTML = `
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : '/asset/placeholder.png'}" 
         alt="${movie.Title}" 
         class="w-full h-72 sm:h-80 object-cover">
    <div class="p-3 sm:p-4">
      <h3 class="text-white font-semibold text-base sm:text-lg mb-1 line-clamp-1">${movie.Title}</h3>
      <p class="text-gray-400 text-xs sm:text-sm mb-2">${movie.Year}</p>
      <div class="flex items-center justify-between mb-2">
        <span class="inline-block px-2 py-1 bg-[#AC8CFF] text-white text-xs rounded capitalize">${movie.Type}</span>
        ${movie.myRating ? `
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-400">
              <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
            </svg>
            <span class="text-yellow-400 font-semibold text-sm">${movie.myRating}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  return card;
}
