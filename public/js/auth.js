// auth.js – BunsOfSteel (SQL-backed)

// ---------------------------------------------------------------------------
// Form switcher
// ---------------------------------------------------------------------------
document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
});

// ---------------------------------------------------------------------------
// Password visibility toggle
// ---------------------------------------------------------------------------
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            button.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// ---------------------------------------------------------------------------
// Password strength indicator (signup only)
// ---------------------------------------------------------------------------
const signupPassword = document.getElementById('signupPassword');
const strengthFill    = document.getElementById('strengthFill');
const strengthText    = document.getElementById('strengthText');

signupPassword.addEventListener('input', () => {
    const strength = calculatePasswordStrength(signupPassword.value);
    strengthFill.className = 'strength-fill';

    if (strength < 3) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength < 5) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium password';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
});

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8)            score++;
    if (password.length >= 12)           score++;
    if (/[a-z]/.test(password))          score++;
    if (/[A-Z]/.test(password))          score++;
    if (/[0-9]/.test(password))          score++;
    if (/[^a-zA-Z0-9]/.test(password))   score++;
    return score;
}

// ---------------------------------------------------------------------------
// Toast notification
// ---------------------------------------------------------------------------
function showToast(message, type = 'success') {
    const toast        = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---------------------------------------------------------------------------
// Login form → POST /src/api/login.php
// ---------------------------------------------------------------------------
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn  = e.target.querySelector('.auth-btn');
    btn.classList.add('loading');

    try {
        const res  = await fetch('src/api/login.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                email:    document.getElementById('loginEmail').value.trim(),
                password: document.getElementById('loginPassword').value
            })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Login successful! Redirecting…', 'success');
            setTimeout(() => { window.location.href = 'index.php'; }, 1200);
        } else {
            showToast(data.message, 'error');
        }
    } catch {
        showToast('Network error. Please try again.', 'error');
    } finally {
        btn.classList.remove('loading');
    }
});

// ---------------------------------------------------------------------------
// Signup form → POST /src/api/signup.php
// ---------------------------------------------------------------------------
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password        = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-side guards (server validates again independently)
    if (password !== confirmPassword) { showToast('Passwords do not match!', 'error'); return; }
    if (password.length < 8)          { showToast('Password must be at least 8 characters!', 'error'); return; }
    if (!document.getElementById('agreeTerms').checked) { showToast('Please agree to the terms and conditions!', 'error'); return; }

    const btn = e.target.querySelector('.auth-btn');
    btn.classList.add('loading');

    try {
        const res  = await fetch('src/api/signup.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                name:     document.getElementById('signupName').value.trim(),
                email:    document.getElementById('signupEmail').value.trim(),
                password: password
            })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Account created! Redirecting…', 'success');
            setTimeout(() => { window.location.href = 'index.php'; }, 1200);
        } else {
            showToast(data.message, 'error');
        }
    } catch {
        showToast('Network error. Please try again.', 'error');
    } finally {
        btn.classList.remove('loading');
    }
});

// ---------------------------------------------------------------------------
// Social login & forgot password – placeholders
// ---------------------------------------------------------------------------
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => showToast('Social login coming soon!', 'error'));
});

document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset feature coming soon!', 'error');
});
