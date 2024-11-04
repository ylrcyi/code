const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html as the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to fetch events data
app.get('/api/events', async (req, res) => {
  try {
    const response = await axios.post('https://api.ftcscout.org/graphql', {
      query: `
      {
        teamByNumber(number: 24018) {
          events(season: 2023) {
            event {
              name
            }
            event {
              teams {
                team {
                  quickStats(season: 2023, region: All) {
                    tot { value }
                    auto { value }
                    dc { value }
                    eg { value }
                  }
                }
                teamNumber
              }
            }
          }
        }
      }
      `
    });
    res.json(response.data.data.teamByNumber.events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from FTC Scout API');
  }
});

// Dynamic route for team pages
app.get('/team/:teamNumber', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'team.html'));
});

// Endpoint to fetch team-specific data
// Endpoint to fetch team-specific data
app.get('/api/team/:teamNumber', async (req, res) => {
  const teamNumber = req.params.teamNumber;

  try {
    // Define the GraphQL query exactly as in the cURL request
    const query = `{
      teamByNumber(number: ${teamNumber}) {
        quickStats(season: 2023, region: All) {
          tot { value }
          auto { value }
          dc { value }
          eg { value }
        }
      }
    }`;

    // Make the API request with the correctly formatted data
    const response = await axios.post('https://api.ftcscout.org/graphql', {
      query: query
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const teamData = response.data.data.teamByNumber;

    if (teamData) {
      res.json(teamData);
    } else {
      console.error('Team data not found for team number:', teamNumber);
      res.status(404).json({ error: 'Team data not found' });
    }
  } catch (error) {
    console.error('Error fetching team data from FTC Scout API:', error.message);
    res.status(500).json({ error: 'Error fetching team data from FTC Scout API' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
