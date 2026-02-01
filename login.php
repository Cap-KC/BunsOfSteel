<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login – BunsOfSteel</title>
    <link rel="stylesheet" href="public/css/auth-styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="logo">
                <i class="fa-solid fa-carrot"></i>
                <span>BunsOfSteel</span>
            </div>

            <!-- Login Form -->
            <div class="form-container active" id="loginForm">
                <h2>Welcome Back!</h2>
                <p class="subtitle">Login to continue your fitness journey</p>

                <form id="loginFormElement">
                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="loginEmail" placeholder="Email" required>
                    </div>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="loginPassword" placeholder="Password" required>
                        <i class="fas fa-eye toggle-password"></i>
                    </div>
                    <div class="form-options">
                        <label class="checkbox">
                            <input type="checkbox" id="rememberMe">
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="forgot-password">Forgot password?</a>
                    </div>
                    <button type="submit" class="auth-btn">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </form>

                <div class="divider"><span>OR</span></div>

                <div class="social-login">
                    <button class="social-btn google"><i class="fab fa-google"></i> Continue with Google</button>
                    <button class="social-btn facebook"><i class="fab fa-facebook"></i> Continue with Facebook</button>
                </div>

                <p class="switch-form">Don't have an account? <a href="#" id="showSignup">Sign up</a></p>
            </div>

            <!-- Signup Form -->
            <div class="form-container" id="signupForm">
                <h2>Create Account</h2>
                <p class="subtitle">Start your fitness transformation today</p>

                <form id="signupFormElement">
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" id="signupName" placeholder="Full Name" required>
                    </div>
                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="signupEmail" placeholder="Email" required>
                    </div>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="signupPassword" placeholder="Password" required>
                        <i class="fas fa-eye toggle-password"></i>
                    </div>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                        <i class="fas fa-eye toggle-password"></i>
                    </div>
                    <div class="password-strength">
                        <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
                        <span id="strengthText">Password strength</span>
                    </div>
                    <label class="checkbox" style="margin-bottom:1.5rem">
                        <input type="checkbox" id="agreeTerms" required>
                        <span>I agree to the <a href="#">Terms & Conditions</a></span>
                    </label>
                    <button type="submit" class="auth-btn">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                </form>

                <div class="divider"><span>OR</span></div>

                <div class="social-login">
                    <button class="social-btn google"><i class="fab fa-google"></i> Sign up with Google</button>
                    <button class="social-btn facebook"><i class="fab fa-facebook"></i> Sign up with Facebook</button>
                </div>

                <p class="switch-form">Already have an account? <a href="#" id="showLogin">Login</a></p>
            </div>
        </div>

        <!-- Background shapes -->
        <div class="bg-shapes">
            <div class="shape shape1"></div>
            <div class="shape shape2"></div>
            <div class="shape shape3"></div>
        </div>
    </div>

    <!-- Toast -->
    <div class="toast" id="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toastMessage"></span>
    </div>

    <script src="public/js/auth.js"></script>
</body>
</html>
