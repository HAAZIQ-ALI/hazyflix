import axios from 'axios';
import fs from 'fs';

const apiKey = '1706919e';
const baseURL = 'http://www.omdbapi.com/';

// List of titles to fetch
const titles = [
  'Vinland Saga',
  'Bungou Stray Dogs',
  'The Heike Story', // "Fragrant Flowers Bloom with Dignity" alternate title
  'Black Clover',
  'Hunter x Hunter',
  'Bleach',
  'Demon Slayer',
  'My Hero Academia',
  'Mashle',
  'Kaiju No. 8',
  'Solo Leveling',
  'Jujutsu Kaisen',
  'Harry Potter and the Sorcerer\'s Stone',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Moriarty the Patriot'
];

async function fetchMovies() {
  const oldData = JSON.parse(fs.readFileSync('oldData.json', 'utf8'));
  
  console.log('Fetching new movies...\n');
  
  for (const title of titles) {
    try {
      const response = await axios.get(baseURL, {
        params: {
          apikey: apiKey,
          t: title,
          type: title.includes('Harry Potter') || title.includes('Lord of the Rings') ? 'movie' : ''
        }
      });
      
      if (response.data.Response === 'True') {
        const movie = {
          Title: response.data.Title,
          Year: response.data.Year,
          imdbID: response.data.imdbID,
          Type: response.data.Type,
          Poster: response.data.Poster,
          myRating: "9.0" // Default rating, you can change this
        };
        
        // Check if already exists
        const exists = oldData.some(m => m.imdbID === movie.imdbID);
        if (!exists) {
          oldData.push(movie);
          console.log(`✅ Added: ${movie.Title} (${movie.Year})`);
        } else {
          console.log(`⏭️  Already exists: ${movie.Title}`);
        }
      } else {
        console.log(`❌ Not found: ${title}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Error fetching ${title}:`, error.message);
    }
  }
  
  // Save updated data
  fs.writeFileSync('oldData.json', JSON.stringify(oldData, null, 2));
  console.log('\n✅ Updated oldData.json');
}

fetchMovies();
