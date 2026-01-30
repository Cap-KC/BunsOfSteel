// Authentication System for BunsOfSteel

// Switch between login and signup forms
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

// Password visibility toggle
const toggleButtons = document.querySelectorAll('.toggle-password');
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const input = button.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            button.classList.remove('fa-eye');
            button.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            button.classList.remove('fa-eye-slash');
            button.classList.add('fa-eye');
        }
    });
});

// Password strength checker
const signupPassword = document.getElementById('signupPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

signupPassword.addEventListener('input', () => {
    const password = signupPassword.value;
    const strength = calculatePasswordStrength(password);
    
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
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// User Database (using localStorage - in production, use a real backend)
class UserDatabase {
    constructor() {
        this.users = this.loadUsers();
    }
    
    loadUsers() {
        const users = localStorage.getItem('bunsofsteel_users');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('bunsofsteel_users', JSON.stringify(this.users));
    }
    
    userExists(email) {
        return this.users.some(user => user.email === email);
    }
    
    createUser(name, email, password) {
        if (this.userExists(email)) {
            return { success: false, message: 'Email already exists' };
        }
        
        const user = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            stats: {
                totalCalories: 0,
                totalTime: 0,
                totalWorkouts: 0,
                currentStreak: 0,
                lastWorkoutDate: null,
                workoutHistory: [],
                plannedWorkouts: {}
            }
        };
        
        this.users.push(user);
        this.saveUsers();
        
        return { success: true, user: user };
    }
    
    authenticateUser(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        
        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Incorrect password' };
        }
        
        return { success: true, user: user };
    }
    
    // Simple hash function (in production, use bcrypt or similar)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
    
    getUserById(id) {
        return this.users.find(u => u.id === id);
    }
    
    updateUserStats(userId, stats) {
        const user = this.getUserById(userId);
        if (user) {
            user.stats = stats;
            this.saveUsers();
            return true;
        }
        return false;
    }
}

const db = new UserDatabase();

// Session Management
class SessionManager {
    static setCurrentUser(user) {
        localStorage.setItem('bunsofsteel_current_user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));
    }
    
    static getCurrentUser() {
        const user = localStorage.getItem('bunsofsteel_current_user');
        return user ? JSON.parse(user) : null;
    }
    
    static logout() {
        localStorage.removeItem('bunsofsteel_current_user');
    }
    
    static isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
}

// Login Form Handler
document.getElementById('loginFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const loginBtn = e.target.querySelector('.auth-btn');
    loginBtn.classList.add('loading');
    
    // Simulate API delay
    setTimeout(() => {
        const result = db.authenticateUser(email, password);
        
        loginBtn.classList.remove('loading');
        
        if (result.success) {
            SessionManager.setCurrentUser(result.user);
            
            if (rememberMe) {
                localStorage.setItem('bunsofsteel_remember', 'true');
            }
            
            showToast('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 1500);
        } else {
            showToast(result.message, 'error');
        }
    }, 1000);
});

// Signup Form Handler
document.getElementById('signupFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Password must be at least 8 characters!', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the terms and conditions!', 'error');
        return;
    }
    
    const signupBtn = e.target.querySelector('.auth-btn');
    signupBtn.classList.add('loading');
    
    // Simulate API delay
    setTimeout(() => {
        const result = db.createUser(name, email, password);
        
        signupBtn.classList.remove('loading');
        
        if (result.success) {
            SessionManager.setCurrentUser(result.user);
            showToast('Account created successfully! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 1500);
        } else {
            showToast(result.message, 'error');
        }
    }, 1000);
});

// Social login placeholders (implement with actual OAuth)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Social login coming soon!', 'error');
    });
});

// Forgot password placeholder
document.querySelector('.forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset feature coming soon!', 'error');
});
