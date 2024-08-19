// Helper function to fetch data from the backend and update the table
function updateTable() {
    const region = document.getElementById('region').value;
    const rank = document.getElementById('rank').value;

    // Fetch data from the backend API
    fetch(`/api/tacticians?region=${region}&rank=${rank}`)
        .then(response => response.json())
        .then(data => {
            populateTable(data.tacticians);
            updateMetrics(data.metrics);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch the companion statistics data from the API and populate the table
fetch('https://tactitions-tools.onrender.com/api/companion_stats')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#tactician-table tbody');
        tableBody.innerHTML = '';

        data.forEach(companion => {
            const row = document.createElement('tr');

            // Companion name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = companion.companion_name;

            // Games played cell
            const gamesPlayedCell = document.createElement('td');
            gamesPlayedCell.textContent = companion.games_played;

            // Top 4 percentage cell
            const top4Cell = document.createElement('td');
            top4Cell.textContent = companion.top_4_percentage.toFixed(2) + '%';

            // Win percentage cell
            const winPercentageCell = document.createElement('td');
            winPercentageCell.textContent = companion.win_percentage.toFixed(2) + '%';

            // Append all cells to the row
            row.appendChild(nameCell);
            row.appendChild(gamesPlayedCell);
            row.appendChild(top4Cell);
            row.appendChild(winPercentageCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching companion statistics:', error));

    
// Function to update the metrics at the top of the page
function updateMetrics(metrics) {
    document.getElementById('games-analyzed').innerText = `Games Analyzed: ${metrics.gamesAnalyzed}`;
    document.getElementById('last-updated').innerText = `Last Updated: ${metrics.lastUpdated}`;
}

// Function to sort the table based on a column index
function sortTable(columnIndex) {
    const table = document.getElementById("tactician-table");
    const rows = Array.from(table.rows).slice(1); // Exclude the header row
    let sortedRows;

    // Determine if the column is numeric or text-based
    const isNumericColumn = !isNaN(rows[0].cells[columnIndex].innerText);

    sortedRows = rows.sort((a, b) => {
        const aText = a.cells[columnIndex].innerText;
        const bText = b.cells[columnIndex].innerText;

        if (isNumericColumn) {
            return parseFloat(aText) - parseFloat(bText);
        } else {
            return aText.localeCompare(bText);
        }
    });

    // Toggle sorting order if already sorted in ascending order
    if (table.getAttribute('data-sorted') === columnIndex.toString()) {
        sortedRows.reverse();
        table.removeAttribute('data-sorted');
    } else {
        table.setAttribute('data-sorted', columnIndex.toString());
    }

    // Remove existing rows and append sorted rows
    table.tBodies[0].innerHTML = '';
    sortedRows.forEach(row => table.tBodies[0].appendChild(row));
}


// Fetch the companion data from the API and populate the table
fetch('https://tactitions-tools.onrender.com/api/companions')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#tactician-table tbody');
        tableBody.innerHTML = '';

        data.forEach(companion => {
            // Create a new row for each Tactician
            const row = document.createElement('tr');

            // Tactician name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = companion.name;

            // Tactician image cell
            const imageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = companion.icon_path;
            img.alt = companion.name;
            img.style.width = '50px'; // Adjust the size as needed
            imageCell.appendChild(img);

            // Add additional cells for the rest of the data (mock data in this case)
            const gamesPlayedCell = document.createElement('td');
            gamesPlayedCell.textContent = companion.gamesPlayed || 'N/A'; // Replace 'N/A' with actual data

            const avgPlaceCell = document.createElement('td');
            avgPlaceCell.textContent = companion.averagePlace || 'N/A';

            const top4Cell = document.createElement('td');
            top4Cell.textContent = companion.top4Percentage || 'N/A';

            const winPercentageCell = document.createElement('td');
            winPercentageCell.textContent = companion.winPercentage || 'N/A';

            // Append all cells to the row
            row.appendChild(nameCell);
            row.appendChild(imageCell);
            row.appendChild(gamesPlayedCell);
            row.appendChild(avgPlaceCell);
            row.appendChild(top4Cell);
            row.appendChild(winPercentageCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching companions:', error));

// Attach event listeners for filtering and sorting
document.getElementById('region').addEventListener('change', updateTable);
document.getElementById('rank').addEventListener('change', updateTable);

// Attach click event listeners to table headers for sorting
document.querySelectorAll('#tactician-table th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});

// Initial table population on page load
document.addEventListener('DOMContentLoaded', updateTable);
