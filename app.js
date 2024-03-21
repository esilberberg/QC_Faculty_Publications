const display = document.getElementById('display')

async function fetchData(institutionId) {
    try {
      const apiUrl = `https://api.openalex.org/works?filter=institutions.id:https://openalex.org/${institutionId},publication_year:2024&sort=publication_year:desc`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Sorry! Error fetching data:', error);
      return null;
    }
  }

// Queens College ID
const institutionId = 'i111455621'; 

fetchData(institutionId)
  .then(data => {
    // Do something with the data
    console.log(data['results']);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Fetch error:', error);
  });