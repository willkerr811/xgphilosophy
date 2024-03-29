document.addEventListener('DOMContentLoaded', function () {

    const shuffleButton = document.getElementById('shuffleButton');
    const controls = document.getElementById('controls');
    const date = document.getElementById('date');

    shuffleButton.addEventListener('click', function () {
        // Refresh the page
        location.reload();
    });

    date.addEventListener('click', function () {
        // Refresh the page
        openModal();
    });


    document.addEventListener('keydown', hideui);
    function hideui(event) {
        
        switch (event.key) {
            case 'h':
                // Move the logo left
                console.log('hideui')
                shuffleButton.style.display = "none";
                controls.style.display = "none";
                break;
            case 's':
                // Move the logo left
                console.log('hideui')
                shuffleButton.style.display = "block";
                controls.style.display = "block";
                break;

            case 'd':
                // Move the logo left
                console.log('changedate')
                date.innerHTML = "9th June 2024";
                break;
        }
    }
    




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
        console.log(stepSize)
    
        for (let i = 0; i < steps; i++) {
            const gradient = i * stepSize;
            console.log(gradient)
            if (i <= middleIndex) {
                const color = interpolateColor(startColor, middleColor, gradient);
                colors.push(color);
            } else {
                const color = interpolateColor(middleColor, endColor, gradient - 100);
                colors.push(color);
            }
        }
        
        return colors.reverse();
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
    function populateTable2(premierLeagueTeams, uniquePoints) {
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

 

    function populateTable1(premierLeagueTeams, uniquePoints) {
        const tableBody = document.querySelector('#premierLeagueTable tbody');
    
        const maxPoint = Math.max(...uniquePoints);
        const minPoint = Math.min(...uniquePoints);
    
        for (let point = maxPoint; point >= minPoint; point--) {
            const teamsWithExpectedPoint = premierLeagueTeams.filter((team) => team.expectedPoints === point);
            const teamsWithActualPoint = premierLeagueTeams.filter((team) => team.actualPoints === point);
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="background-color: ${getGradientColor(point, minPoint, maxPoint, '#FEE483')}; color: #fff; font-weight: bold;">${point}</td>
                <td class="expected-column"><span class="logo-container">${createLogosHTML(teamsWithExpectedPoint)}</span></td>
                <td class="actual-column"><span class="logo-container">${createLogosHTML(teamsWithActualPoint)}</span></td>
            `;
            tableBody.appendChild(row);
        }
    }

    function populateTable(premierLeagueTeams, uniquePoints) {
        const tableBody = document.querySelector('#premierLeagueTable tbody');
    
        // Calculate the number of steps for the gradient based on the range of unique points
        const range = Math.max(...uniquePoints) - Math.min(...uniquePoints);
        const gradientSteps = range + 1;
        console.log(range,gradientSteps)
    
        // Generate stepped gradient colors for the first column
        const gradientColors = generateGradientColors(gradientSteps, '#63BF7A', '#FEE483', '#F66B68');
    
        // Create a mapping of points to rows
        const pointToRowMap = {};
    
        // Create rows for all integers between max and min unique points
        for (let point = Math.max(...uniquePoints); point >= Math.min(...uniquePoints); point--) {
            const row = document.createElement('tr');
            const colorIndex = point - Math.min(...uniquePoints);
            console.log(colorIndex, row)
            const backgroundColor = gradientColors[colorIndex];
            row.innerHTML = `
                <td style="background-color: ${backgroundColor}; color: #fff; font-weight: bold;">${point}</td>
                <td class="expected-column">
                    <div class="logo-container" id="expected-${point}"></div>
                </td>
                <td class="actual-column">
                    <div class="logo-container" id="actual-${point}"></div>
                </td>
            `;
            pointToRowMap[point] = row;
            tableBody.appendChild(row);
        }
    
        // Iterate through unique points and insert logos in the correct rows
        uniquePoints.forEach((point, index) => {
            // Filter teams with the given expected or actual points
            const teamsWithExpectedPoint = premierLeagueTeams.filter(team => team.expectedPoints === point);
            const teamsWithActualPoint = premierLeagueTeams.filter(team => team.actualPoints === point);
    
            // Get the corresponding row for the point
            const row = pointToRowMap[point];
    
            // Update the inner HTML of the row with logos
            row.querySelector('.expected-column .logo-container').innerHTML = createLogosHTML(teamsWithExpectedPoint);
            row.querySelector('.actual-column .logo-container').innerHTML = createLogosHTML(teamsWithActualPoint);
        });
    }
    
    
    

    function getGradientColor(point, minPoint, maxPoint, midColor) {
        const midPercentage = 50; // You can customize this value for the midpoint
        const percentage = ((point - minPoint) / (maxPoint - minPoint)) * 100;
    
        if (percentage <= midPercentage) {
            return interpolateColor('#F66B68', midColor, (percentage / midPercentage) * 100);
        } else {
            return interpolateColor(midColor, '#63BF7A', ((percentage - midPercentage) / (100 - midPercentage)) * 100);
        }
    }
    
    // Function to create HTML for logos
    function createLogosHTML(teams) {
        const horizontalOffsetRangeMultiple = 0.3;
        const horizontalOffsetRangeSingle = 0.5;
    
        return teams.map((team, index) => {
            let randomHorizontalOffset;
    
            if (teams.length > 1) {
                randomHorizontalOffset = (Math.random() * 2 - 1) * horizontalOffsetRangeMultiple;
            } else {
                randomHorizontalOffset = (Math.random() * 2 - 1) * horizontalOffsetRangeSingle;
            }
    
            const logoHTML = `<img src="${team.logo}" alt="${team.team} Logo" class="logo" style="margin-left: ${randomHorizontalOffset * 100}%;" onclick="adjustLogoOffset(this)">`;
            return logoHTML;
        }).join(' ');
    }
});


function adjustLogoOffset(clickedLogo) {
    let selectedLogo = null;

    // Remove the red border from the previously selected logo (if any)
    if (selectedLogo) {
        selectedLogo.style.border = 'none';
    }

    // Set the new selected logo and add a red border
    selectedLogo = clickedLogo;
    selectedLogo.style.border = '2px solid red';

    // Set the initial horizontal offset value
    let horizontalOffset = parseFloat(clickedLogo.style.marginLeft) || 0;
    let verticalOffset = parseFloat(clickedLogo.style.marginTop) || 0;

    // Listen for arrow key events
    function handleArrowKey(event) {
        if (!selectedLogo) {
            document.removeEventListener('keydown', handleArrowKey);
            return;
        }
        
        switch (event.key) {
            case 'ArrowLeft':
                // Move the logo left
                horizontalOffset -= 5;
                break;
            case 'ArrowUp':
                // Move the logo left
                verticalOffset -= 5;
                break;
            case 'ArrowDown':
                // Move the logo left
                verticalOffset += 5;
                break;
            case 'ArrowRight':
                // Move the logo right
                horizontalOffset += 5;
                break;
            case 'Enter':
                // Remove the arrow key event listener
                removeArrowKeyListener();
                break;
        }
        clickedLogo.style.marginLeft = `${horizontalOffset}%`;
        clickedLogo.style.marginTop = `${verticalOffset}%`;
    }

    // Add the event listener for arrow keys
    document.addEventListener('keydown', handleArrowKey);

    // Function to remove the arrow key event listener
    function removeArrowKeyListener() {
        // Remove the red border
        selectedLogo.style.border = 'none';

        // Remove the event listener
        document.removeEventListener('keydown', handleArrowKey);

        // Clear the selected logo
        selectedLogo = null;
        // clickedLogo = null;
    }
}

function openModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'flex';

    // Get the current text of the element
    const currentText = date.textContent;

    // Set the input field value to the current text
    document.getElementById('newStringInput').value = currentText;
}

function updateDate() {
    // When the 'Update' button is clicked, update the element with the input value
    const updatedText = document.getElementById('newStringInput').value;
    date.textContent = updatedText;

    // Close the modal
    closeModal();
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        closeModal();
    }
};
