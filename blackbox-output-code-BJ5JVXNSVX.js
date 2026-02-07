let users = JSON.parse(localStorage.getItem('users')) || {};
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let results = JSON.parse(localStorage.getItem('results')) || {};
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
let loginCount = parseInt(localStorage.getItem('loginCount')) || 0;

// Registration
document.getElementById('signupBtn')?.addEventListener('click', function() {
    const username = prompt('Enter your name (username):');
    const password = prompt('Enter a password:');
    const mobile = prompt('Enter your mobile number:');
    if (username && password && mobile) {
        users[username] = { password, mobile };
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! Details sent to owner.');
        // Simulate sending to owner dashboard
        console.log(`New user: ${username}, Mobile: ${mobile}, Password: ${password}`);
    }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'Bhanuchand' && password === 'Prataap') {
        localStorage.setItem('currentUser', 'owner');
        loginCount++;
        localStorage.setItem('loginCount', loginCount);
        window.location.href = 'owner.html';
    } else if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        loginCount++;
        localStorage.setItem('loginCount', loginCount);
        window.location.href = 'welcome.html';
    } else {
        document.getElementById('message').textContent = 'Invalid credentials!';
    }
});

// Forgot Password
document.getElementById('forgotBtn')?.addEventListener('click', function() {
    const username = prompt('Enter your username:');
    if (users[username]) {
        // Owner resets
        const newPass = prompt('Owner: Enter new password for ' + username);
        users[username].password = newPass;
        localStorage.setItem('users', JSON.stringify(users));
        // Simulate 5-minute delay or mobile reset
        setTimeout(() => alert(`New password for ${username}: ${newPass}`), 300000); // 5 min
        // Or mobile reset
        const mobile = users[username].mobile;
        const code = Math.floor(1000 + Math.random() * 9000);
        alert(`4-digit code sent to ${mobile}: ${code}`);
        const enteredCode = prompt('Enter 4-digit code:');
        if (enteredCode == code) {
            const newPass2 = prompt('Enter new password:');
            users[username].password = newPass2;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Password reset successful!');
        }
    } else {
        alert('Username not found.');
    }
});

// Fingerprint Login (Simulated)
document.getElementById('fingerprintBtn')?.addEventListener('click', function() {
    if (navigator.credentials) {
        navigator.credentials.get({ publicKey: { challenge: new Uint8Array(32) } }).then(() => {
            alert('Fingerprint authenticated! Logging in...');
            // Simulate login
        }).catch(() => alert('Fingerprint failed.'));
    } else {
        alert('Fingerprint not supported.');
    }
});

// Appointments
document.getElementById('appointmentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const user = localStorage.getItem('currentUser');
    appointments.push({ user, date, time });
    localStorage.setItem('appointments', JSON.stringify(appointments));
    alert('Appointment booked!');
    loadAppointments();
});

// Results
function searchResult() {
    const serial = document.getElementById('serialNo').value;
    const result = results[serial];
    document.getElementById('resultDisplay').textContent = result ? `Result: ${result}` : 'No result found.';
}

document.getElementById('resultForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const serial = document.getElementById('newSerial').value;
    const text = document.getElementById('resultText').value;
    results[serial] = text;
    localStorage.setItem('results', JSON.stringify(results));
    alert('Result updated!');
    loadResults();
});

// Feedback
document.getElementById('feedbackForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = document.getElementById('feedbackText').value;
    const user = localStorage.getItem('currentUser');
    feedbacks.push({ user, text, date: new Date().toLocaleString() });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    alert('Feedback submitted!');
    loadFeedback();
});

// Load Data Functions
function loadAppointments() {
    const user = localStorage.getItem('currentUser');
    if (user ===