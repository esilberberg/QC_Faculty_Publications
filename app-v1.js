const display = document.getElementById('display')
const summary = document.getElementById('summary')
const institutionId = 'i111455621'; // Queens College OpenAlex I

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

fetchData(institutionId)
  .then(data => {
    let topicsSummary = '';
    const allTopicsList = data.results.reduce((acc, item) => {
      return acc.concat(item.topics.map(({ display_name }) => display_name));
    }, []);
    const randomTopics = allTopicsList.slice(0).sort(() => 0.5 - Math.random()).slice(0, 4);
    
    randomTopics.forEach((topic) => {
      topicsSummary += `<li class="topic">${topic}.</li>`
    })

    const summaryOutput = `Queens College faculty actively research and publish in wide variety of disciplines. Recent published work looks at:
    <ul>${topicsSummary}</ul>
    `
    summary.innerHTML = summaryOutput

    data.results.reverse().forEach((e, index) => {
      const title = e.title || 'No title available';
      const doi = e.doi || '#';
      const topics = e.topics || [];
      const location = (e.locations[0] && e.locations[0].source.display_name) || 'Location unknown';
      const authors = e.authorships || [];

      let topicsList = '';
      topics.forEach((topic, index) => {
        topicsList += `<span class="topic">${topic.display_name}</span>`;
        if (index < topics.length - 1) {
          topicsList += '; ';
        };
      });

      let authorList = '';
      authors.forEach(author => {
        const authorName = author.raw_author_name || 'Unknown author';
        const authorAffiliation = (author.institutions[0] && author.institutions[0].display_name) || 'Affiliation unknown';
        authorList += `<p class="author"><span class="author-name">${authorName},</span><span class="author-affiliation">${authorAffiliation}</span></p>`;
      });
      
      const citationOutput = `
        
        <div class="citation">
          <div class="title">${index + 1}. ${title}</div>
          <div class="description">
            <div class="author-list">${authorList}</div>
            <div class="label">Publication:</div>
            <div class="location">${location}</div>
            <div class="label">Topics:</div>
            <div class="topics-list">${topicsList}</div>
              <div class="access">
                  <p class="access-option"><a class="access-link" href="https://cuny-qc.primo.exlibrisgroup.com/discovery/search?query=any,contains,${doi}&tab=Everything&search_scope=IZ_CI_AW&vid=01CUNY_QC:CUNY_QC&offset=0&pcAvailability=true" target="_blank" rel="noopener noreferrer">Look for this publication in OneSearch <i class="fa-solid fa-arrow-up-right-from-square"></i></a></p>
                  <p class="access-option"><a class="access-link" href="https://qc.illiad.oclc.org/illiad/logon.html" target="_blank" rel="noopener noreferrer">If not available, make an InterLibrary Loan request <i class="fa-solid fa-arrow-up-right-from-square"></i></a></p>
              </div>
            </div>
        </div>
      `;
      
      display.insertAdjacentHTML('beforeend', citationOutput);
    });
  });