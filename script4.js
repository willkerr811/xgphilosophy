document.addEventListener('DOMContentLoaded', function () {


    fetch('df.csv') // Replace with the actual path to your CSV file
        .then(response => response.text())
        .then(csvData => {
            const premierLeagueTeams = parseCsvData(csvData);
            const allPoints = premierLeagueTeams.reduce((acc, team) => {
                acc.push(team.expectedPoints, team.actualPoints);
                return acc;
            }, []);
        
            const uniquePoints = Array.from(new Set(allPoints)).sort((a, b) => b - a);
            populateTable(premierLeagueTeams,uniquePoints);
        })
        .catch(error => console.error('Error fetching CSV:', error));

        function parseCsvData(csvData) {
            const teams = [];
            const rows = csvData.split('\n');
        
            // Assume the first row contains headers
            const headers = rows[0].replace('\r', '').split(',').map(header => header.trim());
            console.log('Headers:', headers);

        
            // Find the index of each column
            const teamIndex = headers.indexOf('Team');
            const expectedPointsIndex = headers.indexOf('ExpectedPoints');
            const actualPointsIndex = headers.indexOf('ActualPoints');
            const logoIndex = headers.indexOf('LogoUrl');

            console.log(logoIndex);
            
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(',');
            
                console.log('Row:', rows[i]);
                console.log('Columns:', columns);
            }

            // Iterate over rows, starting from 1 to skip the header row
            for (let i = 1; i < rows.length; i++) {
                const columns = rows[i].split(',');
        
                // Ensure the expected number of columns are present
                if (
                    columns.length > teamIndex &&
                    columns.length > expectedPointsIndex &&
                    columns.length > actualPointsIndex &&
                    columns.length > logoIndex
                ) {
                    const team = columns[teamIndex]?.trim();
                    const expectedPoints = columns[expectedPointsIndex]?.trim();
                    const actualPoints = columns[actualPointsIndex]?.trim();
                    const logoURL = columns[logoIndex]?.trim();

                    console.log(team, expectedPoints, actualPoints, logoURL);
                    if (team !== undefined && expectedPoints !== undefined && actualPoints !== undefined && logoURL !== undefined) {
                        teams.push({
                            team: team,
                            expectedPoints: expectedPoints,
                            actualPoints: actualPoints,
                            logo: logoURL
                        });
                    } else {
                        console.error(`Skipping row ${i + 1} due to undefined values.`);
                    }
                } else {
                    console.error(`Skipping row ${i + 1} due to insufficient columns.`);
                }
            }
            console.log('Headerdsdfs:');
            console.log('Headers:',teams);
            return teams;
            
        }
        
    // Array of Premier League teams with expected and actual points
    // const premierLeagueTeams = [
    //     { team: 'Arsenal', expectedPoints: 80, actualPoints: 81, logo: 'https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png' },
    //     { team: 'Chelsea', expectedPoints: 85, actualPoints: 82, logo: 'https://assets.stickpng.com/images/580b57fcd9996e24bc43c4e1.png' },
    //     { team: 'Manchester United', expectedPoints: 78, actualPoints: 80, logo: 'https://upload.wikimedia.org/wikipedia/hif/f/ff/Manchester_United_FC_crest.png' },
    //     // Add more teams as needed
    //     { team: 'Liverpool', expectedPoints: 90, actualPoints: 88, logo: 'https://upload.wikimedia.org/wikipedia/hif/b/bd/Liverpool_FC.png' }
    // ];

    // Extract unique values of expected and actual points
    
    

    // Function to generate stepped gradient colors programmatically
    function generateGradientColors(steps, startColor, middleColor, endColor) {
        const colors = [];
        const middleIndex = Math.floor(steps / 2);
        const stepSize = 100 / (middleIndex);
    
        for (let i = 0; i < steps; i++) {
            const gradient = i * stepSize;
    
            if (i <= middleIndex) {
                const color = interpolateColor(startColor, middleColor, gradient);
                colors.push(color);
            } else {
                const color = interpolateColor(middleColor, endColor, gradient - 50);
                colors.push(color);
            }
        }
    
        return colors;
    }
    
    // Function to interpolate color between two hex values
    function interpolateColor(startColor, endColor, percentage) {
        const start = hexToRgb(startColor);
        const end = hexToRgb(endColor);
    
        const r = interpolate(start.r, end.r, percentage);
        const g = interpolate(start.g, end.g, percentage);
        const b = interpolate(start.b, end.b, percentage);
    
        return rgbToHex(r, g, b);
    }
    
    // Function to interpolate between two values
    function interpolate(start, end, percentage) {
        return start + (end - start) * (percentage / 100);
    }

    // Function to convert hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Function to convert RGB to hex
    function rgbToHex(r, g, b) {
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    // Function to dynamically populate the table
    function populateTable(premierLeagueTeams, uniquePoints) {
        const tableBody = document.querySelector('#premierLeagueTable tbody');
    
        // Generate stepped gradient colors for the first column
        const gradientColors = generateGradientColors(uniquePoints.length, '#63BF7A', '#FEE483', '#F66B68');
    
        // Iterate through unique points
        uniquePoints.forEach((point, index) => {
            // Filter teams with the given expected or actual points
            const teamsWithExpectedPoint = premierLeagueTeams.filter(team => team.expectedPoints === point);
            const teamsWithActualPoint = premierLeagueTeams.filter(team => team.actualPoints === point);
    
            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="background-color: ${gradientColors[index]}; color: #fff; font-weight: bold;">${point}</td>
                <td class="expected-column">
                    <div class="logo-container" id="expected-${index}">
                        ${createLogosHTML(teamsWithExpectedPoint)}
                    </div>
                </td>
                <td class="actual-column">
                    <div class="logo-container" id="actual-${index}">
                        ${createLogosHTML(teamsWithActualPoint)}
                    </div>
                </td>
            `;
    
            // Append the row to the table body
            tableBody.appendChild(row);
        });
    }

    
    // Function to create HTML for logos
    function createLogosHTML(teams, column) {
        return teams.map((team, teamIndex) => `<img src="${team.logo}" alt="${team.team} Logo" class="logo ${column}-${team.team}-${teamIndex}" 
            id="${team.team}-${teamIndex}">`).join(' ');
    }
    
});

