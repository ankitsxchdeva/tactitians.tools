// Helper function to fetch data from the backend and update the table
function updateTable() {
    const region = document.getElementById('region').value;
    const rank = document.getElementById('rank').value;

    // Fetch data from the backend API
    fetch(`/api/tacticians?region=${region}&rank=${rank}`)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#tactician-table tbody');
    tableBody.innerHTML = '';

    data.forEach(tactician => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tactician.name}</td>
            <td>${tactician.gamesPlayed}</td>
            <td>${tactician.averagePlace}</td>
            <td>${tactician.top4Percentage}</td>
            <td>${tactician.winPercentage}</td>
        `;
        tableBody.appendChild(row);
    });
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

// Attach event listeners for filtering and sorting
document.getElementById('region').addEventListener('change', updateTable);
document.getElementById('rank').addEventListener('change', updateTable);

// Attach click event listeners to table headers for sorting
document.querySelectorAll('#tactician-table th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
});

// Initial table population on page load
document.addEventListener('DOMContentLoaded', updateTable);
