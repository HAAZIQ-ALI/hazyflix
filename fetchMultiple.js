import axios from 'axios';
import fs from 'fs';

const searchTerms = [
  'One piece',
  'Erased',
  'Monster',
  'interstellar',
  'dr stone',
  'naruto'
];

const allResults = [];

async function fetchMovies() {
  console.log('Starting to fetch multiple searches...\n');
  
  for (const term of searchTerms) {
    try {
      console.log(`🔍 Searching for: "${term}"...`);
      
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: '1706919e',
          s: term,
          plot: 'full'
        }
      });
      
      const data = response.data;
      
      // Add the search term to the result for reference
      const resultWithTerm = {
        searchTerm: term,
        ...data
      };
      
      allResults.push(resultWithTerm);
      
      if (data.Response === 'True') {
        console.log(`✅ Found ${data.Search?.length || 0} results for "${term}"`);
      } else {
        console.log(`❌ No results for "${term}": ${data.Error}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`❌ Error fetching "${term}":`, error.message);
      allResults.push({
        searchTerm: term,
        Response: 'False',
        Error: error.message
      });
    }
  }
  
  // Save all results to oldData.json
  try {
    fs.writeFileSync('oldData.json', JSON.stringify(allResults, null, 2));
    console.log('\n✅ All data saved to oldData.json successfully!');
    console.log(`📊 Total searches: ${allResults.length}`);
  } catch (error) {
    console.error('❌ Error saving file:', error.message);
  }
}

// Run the function
fetchMovies();
