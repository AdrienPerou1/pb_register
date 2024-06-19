// Variables globales
let attemptsData = JSON.parse(localStorage.getItem('attemptsData')) || [];
let darkMode = true;

// Fonction de basculement du mode
function toggleMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    document.getElementById('toggleMode').innerText = darkMode ? 'Light Mode' : 'Dark Mode';
}

// Fonction pour démarrer le jeu
function startGame() {
    const title = document.getElementById('musicTitle').value;

    if (!title) {
        alert('Please enter a music title.');
        return;
    }

    const existingAttempt = attemptsData.find(attempt => attempt.title === title);

    if (existingAttempt) {
        if (confirm('Attempt for this music already exists. Do you want to view the statistics?')) {
            document.getElementById('attemptsInput').value = existingAttempt.attempts;
            document.getElementById('difficulty').value = existingAttempt.difficulty;
            document.getElementById('misses').value = existingAttempt.misses;
            document.getElementById('successRate').value = existingAttempt.successRate;
            document.getElementById('bestAttempt').value = existingAttempt.bestAttempt;
            document.getElementById('progress').value = existingAttempt.progress;
            document.getElementById('succeed').checked = existingAttempt.succeed;
        }
    } else {
        populateFields();
    }

    document.querySelector('.home-screen').style.display = 'none';
    document.querySelector('.gameplay').style.display = 'block';
    document.getElementById('selectedTitle').innerText = title;
}

// Fonction pour revenir à l'écran d'accueil
function goBack() {
    document.querySelector('.home-screen').style.display = 'block';
    document.querySelector('.gameplay').style.display = 'none';
    document.querySelector('.results').style.display = 'none';
    document.querySelector('.attempts').style.display = 'none';
}

// Fonction pour définir les tentatives
function setAttempts() {
    const attempts = document.getElementById('attemptsInput').value;
    document.getElementById('attemptsCount').innerText = attempts;
}

// Fonction pour enregistrer la performance
function savePerformance() {
    const title = document.getElementById('selectedTitle').innerText;
    const attempts = parseInt(document.getElementById('attemptsInput').value);
    const difficulty = document.getElementById('difficulty').value;
    const misses = parseInt(document.getElementById('misses').value);
    const successRate = parseFloat(document.getElementById('successRate').value);
    const progress = parseFloat(document.getElementById('progress').value);
    const bestAttempt = parseInt(document.getElementById('bestAttempt').value);
    const succeed = document.getElementById('succeed').checked;

    if (isNaN(attempts) || isNaN(misses) || isNaN(successRate) || isNaN(bestAttempt)) {
        alert('Please fill in all the fields with valid numbers.');
        return;
    }

    if (bestAttempt > attempts) {
        alert('Best Attempt cannot be greater than Attempts.');
        return;
    }

    if (successRate < 0 || successRate > 100) {
        alert('Success Rate must be between 0 and 100.');
        return;
    }
    if (progress < 0 || progress > 100) {
        alert('Progress must be between 0 and 100.');
        return;
    }

    if (progress == 100 && succeed == false){
        alert('You need to check succeed if you have 100 in progress');
        return;
    }

    if (progress != 100 && succeed == true){
        alert('You cannot check succeed if your progress are less than 100');
        return;
    }

    const existingIndex = attemptsData.findIndex(attempt => attempt.title === title);

    if (existingIndex > -1) {
        attemptsData[existingIndex] = {
            title,
            attempts,
            difficulty,
            misses,
            successRate,
            bestAttempt,
            progress,
            succeed
        };
    } else {
        attemptsData.push({
            title,
            attempts,
            difficulty,
            misses,
            successRate,
            bestAttempt,
            progress,
            succeed
        });
    }

    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
    alert('Performance saved!');
}

// Fonction pour afficher les résultats
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

// Fonction pour inclure un edit
function editAttempt(title) {
    const attempt = attemptsData.find(attempt => attempt.title === title);
    if (attempt) {
        document.getElementById('selectedTitle').innerText = attempt.title;
        document.getElementById('attemptsInput').value = attempt.attempts;
        document.getElementById('difficulty').value = attempt.difficulty;
        document.getElementById('misses').value = attempt.misses;
        document.getElementById('successRate').value = attempt.successRate;
        document.getElementById('bestAttempt').value = attempt.bestAttempt;
        document.getElementById('progress').value = attempt.progress;
        document.getElementById('succeed').checked = attempt.succeed;

        document.querySelector('.home-screen').style.display = 'none';
        document.querySelector('.attempts').style.display = 'none';
        document.querySelector('.results').style.display = 'none';
        document.querySelector('.gameplay').style.display = 'block';
    } else {
        alert('Attempt not found!');
    }
}

// Fonction pour afficher toutes les tentatives
function viewAllAttempts() {
    const attemptsTableBody = document.getElementById('attemptsTableBody');
    attemptsTableBody.innerHTML = '';
  
    attemptsData.forEach(attempt => {
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
  }

// Fonction pour rechercher dans le tableau
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

// Fonction pour trier le tableau
function sortTable(n) {
    const table = document.querySelector(".attempts table");
    let switching = true;
    let shouldSwitch;
    let dir = "asc";
    let switchcount = 0;
    let rows, i, x, y, xValue, yValue;

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (n === 1 || n === 3 || n === 4 || n === 5) {
                // Compare numbers
                xValue = x.getAttribute('data-value') || x.innerHTML.replace('%', '');
                yValue = y.getAttribute('data-value') || y.innerHTML.replace('%', '');
                xValue = parseFloat(xValue);
                yValue = parseFloat(yValue);

                if (isNaN(xValue)) xValue = 0;
                if (isNaN(yValue)) yValue = 0;

                if (dir == "asc") {
                    if (xValue > yValue) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (xValue < yValue) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else {
                // Compare strings
                xValue = x.innerHTML.toLowerCase();
                yValue = y.innerHTML.toLowerCase();

                if (dir == "asc") {
                    if (xValue > yValue) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (xValue < yValue) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    

const headers = table.getElementsByTagName("TH");
for (let j = 0; j < headers.length; j++) {
    headers[j].classList.remove('asc', 'desc');
}
headers[n].classList.add(dir);
}

function getColumnIndex(columnName) {
    switch (columnName) {
        case 'title':
            return 0;
        case 'attempts':
            return 1;
        case 'difficulty':
            return 2;
        case 'misses':
            return 3;
        case 'successRate':
            return 4;
        case 'bestAttempt':
            return 5;
        case 'progress':
            return 6;
        default:
            return 0;
    }
}

// Fonction pour supprimer une tentative
function deleteAttempt(title, attempts) {
    attemptsData = attemptsData.filter(attempt => !(attempt.title === title && attempt.attempts === attempts));
    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
    viewAllAttempts();
}

// Fonction pour supprimer toutes les tentatives
function deleteAll() {
    if (confirm('Are you sure you want to delete all attempts?')) {
        attemptsData = [];
        localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
        viewAllAttempts();
    }
}

// Fonction pour charger un fichier CSV
function loadFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async function(event) {
        const data = event.target.result;

        if (file.type === "text/csv") {
            parseCSV(data);
        } else {
            alert("Unsupported file format. Please upload a CSV file.");
        }
    };

    if (file.type === "application/pdf") {
        reader.readAsArrayBuffer(file);
    } else {
        reader.readAsText(file);
    }
}

function parseCSV(data) {
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    rows.forEach((row, index) => {
        const cols = row.split(",");
        if (index > 0 && cols.length >= 7) {  
            const [title, attempts, difficulty, misses, successRate, bestAttempt, succeed] = cols;
            if (title && title !== "Title") { 
                attemptsData.push({
                    title,
                    attempts: parseInt(attempts) || 0,
                    difficulty,
                    misses: parseInt(misses) || 0,
                    successRate: parseFloat(successRate) || 0,
                    bestAttempt: parseInt(bestAttempt) || 0,
                    progress: parseFloat(progress),
                    succeed: succeed.toLowerCase() === "yes"
                });
            }
        }
    });
    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));
    viewAllAttempts();
}



document.getElementById('fileInput').addEventListener('change', loadFile);

// Fonction pour télécharger les tentatives en CSV
function downloadCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Title,Attempts,Difficulty,Misses,Success Rate,Best Attempt,Succeed\n';

    attemptsData.forEach(attempt => {
        const row = `${attempt.title},${attempt.attempts},${attempt.difficulty},${attempt.misses},${attempt.successRate},${attempt.bestAttempt},${attempt.succeed ? 'Yes' : 'No'}`;
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

// Fonction pour télécharger les tentatives en PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({ html: '.attempts table' });
    doc.save('attempts.pdf');
}

// Fonction pour remplir les champs lors de la sélection d'un titre
function populateFields() {
    document.getElementById('attemptsInput').value = '';
    document.getElementById('difficulty').value = 'Easy';
    document.getElementById('misses').value = '';
    document.getElementById('successRate').value = '';
    document.getElementById('bestAttempt').value = '';
    document.getElementById('progress').value = '';
    document.getElementById('succeed').checked = false;
}

document.addEventListener('DOMContentLoaded', () => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('toggleMode').innerText = 'Light Mode';
    } else {
      document.getElementById('toggleMode').innerText = 'Dark Mode';
    }
  
    document.body.addEventListener('click', function(e) {
      if (e.target.classList.contains('edit')) {
        const title = e.target.getAttribute('data-title');
        editAttempt(title);
      }
    });
  });
