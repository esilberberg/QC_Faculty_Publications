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

// Queens College OpenAlex ID
const institutionId = 'i111455621'; 

fetchData(institutionId)
  .then(data => {
    data['results'].forEach(e => {
      const title = e['title'];
      const publication_year = e['publication_year'];
      const doi = e['doi'];
      let topic = '';
      if (e['primary_topic']?.['display_name']) {
        topic = e['primary_topic']['display_name'];
      }
      let publication = '';
      if (e['primary_location']?.['source']?.['display_name']) {
        publication = e['primary_location']['source']['display_name'];
      }
      
      const htmlOutput = `
        <div class="citation">
          <div class="title"><a href="${doi}" target="_blank" rel="noopener noreferrer">${title}</a></div>
          <div class="publication">${publication}</div>
          <div class="authorship">
            ${e['authorships'].map(a => `
              <div class="author">
                <span class="author-name">${a['raw_author_name']}</span>
                <span class="author-affiliation">${a['institutions']?.[0]?.['display_name'] || ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      display.insertAdjacentHTML('beforeend', htmlOutput);
    });
  });