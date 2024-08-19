// Helper function to fetch and display companion data (names and images)
function fetchAndDisplayCompanions() {
    fetch('https://tactitions-tools.onrender.com/api/companions')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#tactician-table tbody');
            tableBody.innerHTML = '';

            data.forEach(companion => {
                const row = document.createElement('tr');

                // Companion name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = companion.name;

                // Companion image cell
                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = companion.icon_path;
                img.alt = companion.name;
                img.style.width = '50px'; // Adjust the size as needed
                imageCell.appendChild(img);

                // Append these cells to the row
                row.appendChild(nameCell);
                row.appendChild(imageCell);

                // Placeholder cells for statistics (will be filled by fetchAndDisplayCompanionStats)
                const gamesPlayedCell = document.createElement('td');
                const avgPlaceCell = document.createElement('td');
                const top4Cell = document.createElement('td');
                const winPercentageCell = document.createElement('td');

                row.appendChild(gamesPlayedCell);
                row.appendChild(avgPlaceCell);
                row.appendChild(top4Cell);
                row.appendChild(winPercentageCell);

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching companions:', error));
}

// Helper function to fetch and display companion statistics
function fetchAndDisplayCompanionStats() {
    fetch('https://tactitions-tools.onrender.com/api/companion_stats')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#tactician-table tbody');

            data.forEach(companionStat => {
                // Find the corresponding row by companion name
                const row = Array.from(tableBody.rows).find(row => 
                    row.cells[0].textContent === companionStat.companion_name);

                if (row) {
                    // Fill in the statistics cells
                    row.cells[2].textContent = companionStat.games_played;
                    row.cells[3].textContent = companionStat.top_4_percentage.toFixed(2) + '%';
                    row.cells[4].textContent = companionStat.win_percentage.toFixed(2) + '%';
                }
            });
        })
        .catch(error => console.error('Error fetching companion statistics:', error));
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

// Initialize table on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayCompanions();
    fetchAndDisplayCompanionStats();
});

// Attach click event listeners to table headers for sorting
document.querySelectorAll('#tactician-table th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});
