// Simple database simulation using localStorage
const db = {
    judges: [
        { name: "judge1", password: "judge123" },
        { name: "judge2", password: "judge123" }
    ],
    admin: { username: "admin", password: "admin123" },
    grades: []
};

// DOM Elements
let currentJudge = null;

// Initialize the app based on current page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('judgeLogin')) {
        initLoginPage();
    } else if (document.getElementById('gradingForm')) {
        initJudgePage();
    } else if (document.getElementById('gradesTable')) {
        initAdminPage();
    }
});

// Login Page Functions
function initLoginPage() {
    // Judge Login
    document.getElementById('judgeLogin').addEventListener('submit', function(e) {
        e.preventDefault();
        const judgeName = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        const judge = db.judges.find(j => j.name === judgeName && j.password === password);
        if (judge) {
            localStorage.setItem('currentJudge', judgeName);
            window.location.href = 'judge.html';
        } else {
            alert('Invalid judge credentials');
        }
    });
    
    // Admin Login
    document.getElementById('adminLogin').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = this.querySelector('input[type="text"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        if (username === db.admin.username && password === db.admin.password) {
            window.location.href = 'admin.html';
        } else {
            alert('Invalid admin credentials');
        }
    });
}

// Judge Page Functions
function initJudgePage() {
    currentJudge = localStorage.getItem('currentJudge');
    if (!currentJudge) {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('judgeName').textContent = currentJudge;
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentJudge');
        window.location.href = 'index.html';
    });
    
    // Calculate totals when grades change
    const developingInputs = document.querySelectorAll('.developing');
    const accomplishedInputs = document.querySelectorAll('.accomplished');
    
    const updateTotals = () => {
        let devTotal = 0;
        let accTotal = 0;
        
        developingInputs.forEach(input => {
            devTotal += Number(input.value) || 0;
        });
        
        accomplishedInputs.forEach(input => {
            accTotal += Number(input.value) || 0;
        });
        
        document.getElementById('totalDeveloping').textContent = devTotal;
        document.getElementById('totalAccomplished').textContent = accTotal;
    };
    
    developingInputs.forEach(input => {
        input.addEventListener('change', updateTotals);
    });
    
    accomplishedInputs.forEach(input => {
        input.addEventListener('change', updateTotals);
    });
    
    // Form submission
    document.getElementById('gradingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const groupNumber = document.getElementById('groupNumber').value;
        const groupMembers = document.getElementById('groupMembers').value;
        const projectTitle = document.getElementById('projectTitle').value;
        const comments = document.getElementById('comments').value;
        
        const grades = {
            groupNumber,
            groupMembers,
            projectTitle,
            developing: document.getElementById('totalDeveloping').textContent,
            accomplished: document.getElementById('totalAccomplished').textContent,
            judge: currentJudge,
            comments
        };
        
        // Save to "database"
        const storedGrades = JSON.parse(localStorage.getItem('grades')) || [];
        storedGrades.push(grades);
        localStorage.setItem('grades', JSON.stringify(storedGrades));
        
        alert('Grades submitted successfully!');
        this.reset();
        updateTotals();
    });
}

// Admin Page Functions
function initAdminPage() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const rows = document.querySelectorAll('#gradesTable tbody tr');
        
        rows.forEach(row => {
            const groupNumber = row.cells[0].textContent.toLowerCase();
            if (groupNumber.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Load all grades
    loadGrades();
}

function loadGrades() {
    const storedGrades = JSON.parse(localStorage.getItem('grades')) || [];
    const tbody = document.querySelector('#gradesTable tbody');
    tbody.innerHTML = '';
    
    storedGrades.forEach(grade => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${grade.groupNumber}</td>
            <td>${grade.groupMembers}</td>
            <td>${grade.projectTitle}</td>
            <td>${grade.developing}</td>
            <td>${grade.accomplished}</td>
            <td>${Number(grade.developing) + Number(grade.accomplished)}</td>
            <td>${grade.judge}</td>
            <td>${grade.comments}</td>
        `;
        
        tbody.appendChild(row);
    });
}