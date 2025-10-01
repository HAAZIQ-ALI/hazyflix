import axios from 'axios';
import fs from 'fs';

const items = [
  { search: 'One piece', imdbID: 'tt0388629' },
  { search: 'Erased', imdbID: 'tt5249462' },
  { search: 'Monster', imdbID: 'tt0434706' },
  { search: 'interstellar', imdbID: 'tt0816692' },
  { search: 'dr stone', imdbID: 'tt10616398' },
  { search: 'naruto', imdbID: 'tt0409591' }
];

const updatedData = [];

async function updatePosters() {
  console.log('Fetching fresh poster URLs...\n');
  
  for (const item of items) {
    try {
      // Fetch by IMDb ID to get exact match
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: '1706919e',
          i: item.imdbID,
          plot: 'full'
        }
      });
      
      const data = response.data;
      
      if (data.Response === 'True') {
        updatedData.push({
          Title: data.Title,
          Year: data.Year,
          imdbID: data.imdbID,
          Type: data.Type,
          Poster: data.Poster
        });
        console.log(`✅ Updated: ${data.Title}`);
      } else {
        console.log(`❌ Failed: ${item.search}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`❌ Error fetching ${item.search}:`, error.message);
    }
  }
  
  // Save updated data
  try {
    fs.writeFileSync('oldData.json', JSON.stringify(updatedData, null, 2));
    console.log('\n✅ All posters updated in oldData.json!');
  } catch (error) {
    console.error('❌ Error saving file:', error.message);
  }
}

updatePosters();
