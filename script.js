// Global variables
let attemptsData = JSON.parse(localStorage.getItem('attemptsData')) || [];
let darkMode =  'false';
let currentPlaylist = 'All Songs';
let playlists = JSON.parse(localStorage.getItem('playlists')) || { 'All Songs': [] };

// Function to toggle dark mode
function toggleMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    document.getElementById('toggleMode').innerText = darkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', darkMode);
}

// Function to start the game
function startGame() {
    const title = document.getElementById('musicTitle').value;

    if (!title) {
        alert('Please enter a music title.');
        return;
    }

    const existingAttempt = attemptsData.find(attempt => attempt.title === title);

    if (existingAttempt) {
        if (confirm('Attempt for this music already exists. Do you want to view the statistics?')) {
            populateFields(existingAttempt);
        }
    } else {
        populateFields();
    }

    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.gameplay').style.display = 'block';
    document.getElementById('selectedTitle').innerText = title;
}

// Function to go back to the home screen
function goBack() {
    document.querySelector('.home-screen').style.display = 'block';
    document.querySelector('.gameplay').style.display = 'none';
    document.querySelector('.results').style.display = 'none';
    document.querySelector('.attempts').style.display = 'none';
}

// Function to set attempts
function setAttempts() {
    const attempts = document.getElementById('attemptsInput').value;
    document.getElementById('attemptsCount').innerText = attempts;
}

// Function to save performance
function savePerformance() {
    const title = document.getElementById('selectedTitle').innerText;
    const attempts = parseInt(document.getElementById('attemptsInput').value);
    const difficulty = document.getElementById('difficulty').value;
    const misses = parseInt(document.getElementById('misses').value);
    const successRate = parseFloat(document.getElementById('successRate').value);
    const progress = parseFloat(document.getElementById('progress').value);
    const bestAttempt = parseInt(document.getElementById('bestAttempt').value);
    const succeed = document.getElementById('succeed').checked;

    if (!validateInputs(attempts, misses, successRate, bestAttempt, progress, succeed)) {
        return;
    }

    const newAttempt = {
        title,
        attempts,
        difficulty,
        misses,
        successRate,
        bestAttempt,
        progress,
        succeed,
        date: new Date().toISOString()
    };

    const existingIndex = attemptsData.findIndex(attempt => attempt.title === title);

    if (existingIndex > -1) {
        attemptsData[existingIndex] = newAttempt;
    } else {
        attemptsData.push(newAttempt);
    }

    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
    updatePlaylists(title);
    alert('Performance saved!');
}

// Function to validate inputs
function validateInputs(attempts, misses, successRate, bestAttempt, progress, succeed) {
    if (isNaN(attempts) || isNaN(misses) || isNaN(successRate) || isNaN(bestAttempt)) {
        alert('Please fill in all the fields with valid numbers.');
        return false;
    }

    if (bestAttempt > attempts) {
        alert('Best Attempt cannot be greater than Attempts.');
        return false;
    }

    if (successRate < 0 || successRate > 100) {
        alert('Success Rate must be between 0 and 100.');
        return false;
    }

    if (progress < 0 || progress > 100) {
        alert('Progress must be between 0 and 100.');
        return false;
    }

    if (progress == 100 && !succeed) {
        alert('You need to check succeed if you have 100 in progress');
        return false;
    }

    if (progress != 100 && succeed) {
        alert('You cannot check succeed if your progress is less than 100');
        return false;
    }

    return true;
}

// Function to view results
function viewResults() {
    const title = document.getElementById('selectedTitle').innerText;
    const results = attemptsData.filter(attempt => attempt.title === title);

    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = '';

    results.forEach(attempt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attempt.difficulty}</td>
            <td>${attempt.misses}</td>
            <td>${attempt.successRate}%</td>
            <td>${attempt.bestAttempt}</td>
            <td>${attempt.progress}%</td>
            <td>${attempt.succeed ? 'Yes' : 'No'}</td>
        `;
        resultsTableBody.appendChild(row);
    });

    document.querySelector('.gameplay').style.display = 'none';
    document.querySelector('.results').style.display = 'block';
}

// Function to edit an attempt
function editAttempt(title) {
    const attempt = attemptsData.find(attempt => attempt.title === title);
    if (attempt) {
        populateFields(attempt);
        document.querySelector('.home-screen').style.display = 'none';
        document.querySelector('.attempts').style.display = 'none';
        document.querySelector('.results').style.display = 'none';
        document.querySelector('.gameplay').style.display = 'block';
    } else {
        alert('Attempt not found!');
    }
}



// Function to search the table
function searchTable() {
    const input = document.getElementById('searchInput').value.toUpperCase();
    const table = document.querySelector('.attempts table');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td')[0];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(input) > -1 ? '' : 'none';
        }
    }
}

// Function to sort the table
function sortTable(n) {
    const table = document.querySelector(".attempts table");
    let switching = true;
    let shouldSwitch, switchcount = 0;
    let dir = "asc";
    while (switching) {
        switching = false;
        const rows = table.rows;
        for (let i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            const x = rows[i].getElementsByTagName("TD")[n];
            const y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Function to delete an attempt
function deleteAttempt(title, attempts) {
    if (confirm(`Are you sure you want to delete the attempt for "${title}"?`)) {
        attemptsData = attemptsData.filter(attempt => !(attempt.title === title && attempt.attempts === attempts));
        localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
        updatePlaylists(title, true);
        viewAllAttempts();
    }
}

// Function to delete all attempts
function deleteAll() {
    if (confirm('Are you sure you want to delete all attempts?')) {
        attemptsData = [];
        localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
        playlists = { 'All Songs': [] };
        localStorage.setItem('playlists', JSON.stringify(playlists));
        viewAllAttempts();
    }
}

// Function to load a file
function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = event.target.result;
        if (file.type === "text/csv") {
            parseCSV(data);
        } else {
            alert("Unsupported file format. Please upload a CSV file.");
        }
    };

    reader.readAsText(file);
}

// Function to parse CSV
function parseCSV(data) {
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    rows.forEach((row, index) => {
        if (index > 0) {
            const cols = row.split(",");
            if (cols.length >= 8) {
                const [title, attempts, difficulty, misses, successRate, bestAttempt, progress, succeed] = cols;
                if (title && title !== "Title") {
                    const newAttempt = {
                        title,
                        attempts: parseInt(attempts) || 0,
                        difficulty,
                        misses: parseInt(misses) || 0,
                        successRate: parseFloat(successRate) || 0,
                        bestAttempt: parseInt(bestAttempt) || 0,
                        progress: parseFloat(progress) || 0,
                        succeed: succeed.toLowerCase() === "yes",
                        date: new Date().toISOString()
                    };
                    const existingIndex = attemptsData.findIndex(attempt => attempt.title === title);
                    if (existingIndex > -1) {
                        attemptsData[existingIndex] = newAttempt;
                    } else {
                        attemptsData.push(newAttempt);
                    }
                    updatePlaylists(title);
                }
            }
        }
    });
    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
    viewAllAttempts();
}

// Function to download CSV
function downloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Title,Attempts,Difficulty,Misses,Success Rate,Best Attempt,Progress,Succeed\n';

    attemptsData.forEach(attempt => {
        const row = `${attempt.title},${attempt.attempts},${attempt.difficulty},${attempt.misses},${attempt.successRate},${attempt.bestAttempt},${attempt.progress},${attempt.succeed ? 'Yes' : 'No'}`;
        csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'attempts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to download PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: '.attempts table' });
    doc.save('attempts.pdf');
}

// Function to populate fields
function populateFields(attempt = null) {
    document.getElementById('attemptsInput').value = attempt ? attempt.attempts : '';
    document.getElementById('difficulty').value = attempt ? attempt.difficulty : 'Easy';
    document.getElementById('misses').value = attempt ? attempt.misses : '';
    document.getElementById('successRate').value = attempt ? attempt.successRate : '';
    document.getElementById('bestAttempt').value = attempt ? attempt.bestAttempt : '';
    document.getElementById('progress').value = attempt ? attempt.progress : '';
    document.getElementById('succeed').checked = attempt ? attempt.succeed : false;
}



// Function to view all attempts
function viewAllAttempts() {
    const attemptsTableBody = document.getElementById('attemptsTableBody');
    attemptsTableBody.innerHTML = '';

    const filteredAttempts = currentPlaylist === 'All Songs' 
        ? attemptsData 
        : attemptsData.filter(attempt => playlists[currentPlaylist].includes(attempt.title));

    filteredAttempts.forEach(attempt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attempt.title}</td>
            <td>${attempt.attempts}</td>
            <td>${attempt.difficulty}</td>
            <td>${attempt.misses}</td>
            <td>${attempt.successRate}%</td>
            <td>${attempt.bestAttempt}</td>
            <td>${attempt.progress}%</td>
            <td>${attempt.succeed ? 'Yes' : 'No'}</td>
            <td>
                <button class="edit" data-title="${attempt.title}">Edit</button>
                <button class="delete" onclick="deleteAttempt('${attempt.title}', ${attempt.attempts})">Delete</button>
            </td>
        `;
        attemptsTableBody.appendChild(row);
    });

    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.attempts').style.display = 'block';
    updatePlaylistDropdown();
}
  

    filteredAttempts.forEach(attempt => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attempt.title}</td>
            <td>${attempt.attempts}</td>
            <td>${attempt.difficulty}</td>
            <td>${attempt.misses}</td>
            <td>${attempt.successRate}%</td>
            <td>${attempt.bestAttempt}</td>
            <td>${attempt.progress}%</td>
            <td>${attempt.succeed ? 'Yes' : 'No'}</td>
            <td>
                <button class="edit" data-title="${attempt.title}">Edit</button>
                <button class="delete" onclick="deleteAttempt('${attempt.title}', ${attempt.attempts})">Delete</button>
            </td>
        `;
        attemptsTableBody.appendChild(row);
    });

