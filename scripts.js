// Function to clear all sort arrows
function clearSortArrows() {
    document.querySelectorAll('.sort-arrow').forEach(arrow => {
        arrow.classList.remove('asc', 'desc');
        arrow.classList.add('inactive');
    });
}

// Function to set the correct sort arrow
function setSortArrow(columnIndex, direction) {
    clearSortArrows();
    const header = document.querySelectorAll('#tactician-table th')[columnIndex];
    const arrow = header.querySelector('.sort-arrow');
    arrow.classList.remove('inactive');
    arrow.classList.add(direction === 'asc' ? 'asc' : 'desc');
}

// Helper function to fetch and display companion data (names and images)
function fetchAndDisplayCompanions() {
    return fetch('https://tactitions-tools.onrender.com/api/companions')
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('Error fetching companions:', error);
            return [];
        });
}

// Helper function to fetch and display companion statistics
function fetchAndDisplayCompanionStats() {
    return fetch('https://tactitions-tools.onrender.com/api/companion_stats')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => data)
        .catch(error => {
            console.error('Error fetching companion statistics:', error);
            return [];
        });
}

// Function to merge and sort companion data and statistics
function mergeCompanionData(companions, stats) {
    return companions.map(companion => {
        const stat = stats.find(stat => stat.companion_name === companion.name) || {};
        return {
            ...companion,
            games_played: stat.games_played || 0,
            average_placement: stat.average_placement || 0,
            top_4_percentage: stat.top_4_percentage || 0,
            win_percentage: stat.win_percentage || 0
        };
    });
}

// Function to render the table
function renderTable(data) {
    const tableBody = document.querySelector('#tactician-table tbody');
    tableBody.innerHTML = ''; // Clear the table body

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
        img.style.width = '50px';
        imageCell.appendChild(img);

        // Statistics cells
        const gamesPlayedCell = document.createElement('td');
        gamesPlayedCell.textContent = companion.games_played;

        const avgPlaceCell = document.createElement('td');
        avgPlaceCell.textContent = companion.average_placement.toFixed(2);

        const top4Cell = document.createElement('td');
        top4Cell.textContent = companion.top_4_percentage.toFixed(2) + '%';

        const winPercentageCell = document.createElement('td');
        winPercentageCell.textContent = companion.win_percentage.toFixed(2) + '%';

        // Append cells to row
        row.appendChild(nameCell);
        row.appendChild(imageCell);
        row.appendChild(gamesPlayedCell);
        row.appendChild(avgPlaceCell);
        row.appendChild(top4Cell);
        row.appendChild(winPercentageCell);

        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Function to sort the table based on a column index
function sortTable(columnIndex) {
    const table = document.getElementById("tactician-table");
    const rows = Array.from(table.tBodies[0].rows);

    const isNumericColumn = !isNaN(rows[0].cells[columnIndex].textContent.replace('%', '').trim());

    let direction = table.getAttribute('data-sorted-direction') === 'asc' ? 'desc' : 'asc';
    rows.sort((a, b) => {
        const aGamesPlayed = parseFloat(a.cells[2].textContent.trim());
        const bGamesPlayed = parseFloat(b.cells[2].textContent.trim());

        // Handle sorting of companions with 0 games played
        if (aGamesPlayed === 0 || bGamesPlayed === 0) {
            if (aGamesPlayed === 0 && bGamesPlayed === 0) return 0;
            return direction === 'asc' && columnIndex === 2 ? aGamesPlayed - bGamesPlayed : bGamesPlayed - aGamesPlayed;
        }

        const aValue = isNumericColumn ? parseFloat(a.cells[columnIndex].textContent.replace('%', '').trim()) : a.cells[columnIndex].textContent.trim();
        const bValue = isNumericColumn ? parseFloat(b.cells[columnIndex].textContent.replace('%', '').trim()) : b.cells[columnIndex].textContent.trim();

        if (aValue === bValue) {
            // Secondary sort by games played if the values are identical and columnIndex isn't 2 (Games Played)
            if (columnIndex !== 2) {
                return direction === 'asc' ? aGamesPlayed - bGamesPlayed : bGamesPlayed - aGamesPlayed;
            }
            return 0;
        }

        return direction === 'asc' ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
    });

    table.setAttribute('data-sorted-direction', direction);
    table.setAttribute('data-sorted-column', columnIndex);

    // Clear and re-append sorted rows
    table.tBodies[0].innerHTML = '';
    rows.forEach(row => table.tBodies[0].appendChild(row));

    // Set the correct sort arrow
    setSortArrow(columnIndex, direction);
}

// Initialize table on page load
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([fetchAndDisplayCompanions(), fetchAndDisplayCompanionStats()])
        .then(([companions, stats]) => {
            const mergedData = mergeCompanionData(companions, stats);
            mergedData.sort((a, b) => b.games_played - a.games_played); // Default sort by games played
            renderTable(mergedData);
            setSortArrow(2, 'desc'); // Set the default sort arrow to the Games Played column
        });
});

// Attach click event listeners to table headers for sorting
document.querySelectorAll('#tactician-table th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});

// Function to perform fuzzy search
function fuzzySearch(query, items) {
    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
        return item.name.toLowerCase().includes(lowerQuery);
    });
}

// Event listener for the search input
document.getElementById('champion-search').addEventListener('input', function () {
    const query = this.value;
    Promise.all([fetchAndDisplayCompanions(), fetchAndDisplayCompanionStats()])
        .then(([companions, stats]) => {
            let mergedData = mergeCompanionData(companions, stats);
            if (query) {
                mergedData = fuzzySearch(query, mergedData);
            }
            renderTable(mergedData);
        });
});


