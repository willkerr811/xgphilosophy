document.addEventListener('DOMContentLoaded', function () {
    // Array of Premier League teams with expected and actual points
    const premierLeagueTeams = [
        { team: 'Arsenal', expectedPoints: 80, actualPoints: 80, logo: 'https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png' },
        { team: 'Chelsea', expectedPoints: 85, actualPoints: 82, logo: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c4e1.png' },
        { team: 'Manchester United', expectedPoints: 78, actualPoints: 80, logo: 'https://upload.wikimedia.org/wikipedia/hif/f/ff/Manchester_United_FC_crest.png' },
        // Add more teams as needed
        { team: 'Liverpool', expectedPoints: 90, actualPoints: 88, logo: 'https://upload.wikimedia.org/wikipedia/hif/b/bd/Liverpool_FC.png' }
    ];

    // Extract unique values of expected and actual points
    const allPoints = premierLeagueTeams.reduce((acc, team) => {
        acc.push(team.expectedPoints, team.actualPoints);
        return acc;
    }, []);

    const uniquePoints = Array.from(new Set(allPoints)).sort((a, b) => b - a);

    // Function to dynamically populate the table
    function populateTable() {
        const tableBody = document.querySelector('#premierLeagueTable tbody');

        uniquePoints.forEach(point => {
            // Find teams with the given expected or actual points
            const teamsWithExpectedPoint = premierLeagueTeams.filter(team =>
                team.expectedPoints === point
            );

            const teamsWithActualPoint = premierLeagueTeams.filter(team =>
                team.actualPoints === point
            );

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="points-column">${point}</td>
                <td class="expected-column"><span class="logo-container">${createLogosHTML(teamsWithExpectedPoint)}</span></td>
                <td class="actual-column"><span class="logo-container">${createLogosHTML(teamsWithActualPoint)}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Function to create HTML for logos
    function createLogosHTML(teams) {
        return teams.map(team => `<img src="${team.logo}" alt="${team.team} Logo" class="logo">`).join(' ');
    }

    // Call the function to populate the table on page load
    populateTable();
});
