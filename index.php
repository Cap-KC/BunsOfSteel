<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FitForge – Online Fitness Tracker</title>
    <link rel="stylesheet" href="public/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Top Navigation Bar -->
    <nav class="top-nav">
        <div class="nav-container">
            <div class="logo">
                <i class="fa-solid fa-carrot"></i>
                <span>FitForge</span>
            </div>
            <div class="nav-right">
                <span class="user-greeting" id="userGreeting">Welcome!</span>
                <button class="icon-btn" id="profileBtn"><i class="fas fa-user-circle"></i></button>
                <button class="icon-btn" id="settingsBtn"><i class="fas fa-cog"></i></button>
                <button class="icon-btn" id="logoutBtn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        </div>
    </nav>

    <!-- Main Navigation Tabs -->
    <div class="tab-navigation">
        <button class="tab-btn active" data-tab="home"><i class="fas fa-home"></i><span>Home</span></button>
        <button class="tab-btn" data-tab="planner"><i class="fas fa-calendar-alt"></i><span>Planner</span></button>
        <button class="tab-btn" data-tab="stats"><i class="fas fa-chart-line"></i><span>Stats</span></button>
        <button class="tab-btn" data-tab="about"><i class="fas fa-info-circle"></i><span>About</span></button>
    </div>

    <!-- Main Content -->
    <main class="main-content">
        <!-- HOME TAB -->
        <div class="tab-content active" id="home-tab">
            <div class="filters-section">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search workouts…">
                </div>
                <div class="filter-buttons">
                    <select id="typeFilter" class="filter-select">
                        <option value="all">All Types</option>
                        <option value="cardio">Cardio</option>
                        <option value="strength">Strength</option>
                        <option value="hiit">HIIT</option>
                        <option value="yoga">Yoga</option>
                        <option value="fullbody">Full Body</option>
                    </select>
                    <select id="difficultyFilter" class="filter-select">
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    <select id="durationFilter" class="filter-select">
                        <option value="all">Any Duration</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                    </select>
                </div>
            </div>

            <button class="quick-start-btn" id="quickStartBtn">
                <i class="fas fa-play"></i> Start Random Workout
            </button>

            <section class="featured-section">
                <h2>Featured Workouts</h2>
                <div class="carousel-container">
                    <button class="carousel-btn prev" id="prevBtn"><i class="fas fa-chevron-left"></i></button>
                    <div class="carousel" id="workoutCarousel"></div>
                    <button class="carousel-btn next" id="nextBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </section>

            <section class="workouts-grid-section">
                <h2>All Workouts</h2>
                <div class="workouts-grid" id="workoutsGrid"></div>
            </section>
        </div>

        <!-- PLANNER TAB -->
        <div class="tab-content" id="planner-tab">
            <h2>Workout Planner</h2>

            <section class="bmi-section">
                <h3><i class="fas fa-calculator"></i> BMI Calculator & Personalized Plan</h3>
                <div class="bmi-calculator">
                    <div class="bmi-inputs">
                        <div class="bmi-input-group">
                            <label for="heightInput">Height (cm)</label>
                            <input type="number" id="heightInput" placeholder="170" min="0" step="0.1">
                        </div>
                        <div class="bmi-input-group">
                            <label for="weightInput">Weight (kg)</label>
                            <input type="number" id="weightInput" placeholder="70" min="0" step="0.1">
                        </div>
                        <button class="calculate-btn" id="calculateBMI"><i class="fas fa-calculator"></i> Calculate BMI</button>
                    </div>

                    <div class="bmi-result" id="bmiResult" style="display:none">
                        <div class="bmi-value">
                            <div class="bmi-number" id="bmiNumber">0</div>
                            <div class="bmi-label">Your BMI</div>
                        </div><br/>
                        <div class="bmi-category" id="bmiCategory">
                            <span class="category-badge" id="categoryBadge">Normal</span>
                            <p id="categoryDescription">You are within the healthy weight range</p>
                        </div>
                        <div class="bmi-scale">
                            <div class="scale-bar"><div class="scale-indicator" id="bmiIndicator"></div></div>
                            <div class="scale-labels">
                                <span>Underweight<br>&lt;18.5</span>
                                <span>Normal<br>18.5–24.9</span>
                                <span>Overweight<br>25–29.9</span>
                                <span>Obese<br>≥30</span>
                            </div>
                        </div>

                        <div class="recommended-workouts" id="recommendedWorkouts">
                            <h4><i class="fas fa-star"></i> Recommended Workouts for You</h4>
                            <div class="recommended-grid" id="recommendedGrid"></div>
                        </div>

                        <div class="meal-plan-section" id="mealPlanSection" style="display:none">
                            <h4><i class="fas fa-utensils"></i> Recommended Meal Plan</h4>
                            <div class="meal-plan-card">
                                <div class="calorie-target">
                                    <i class="fas fa-fire"></i>
                                    <div><h5>Daily Calorie Target</h5><p id="calorieTarget">1800–1900 calories</p></div>
                                </div>
                                <div class="meal-plan-details">
                                    <p><strong>Focus on:</strong></p>
                                    <ul>
                                        <li>High-protein meals (lean meats, fish, eggs, legumes)</li>
                                        <li>Complex carbohydrates (whole grains, sweet potatoes)</li>
                                        <li>Healthy fats (nuts, avocado, olive oil)</li>
                                        <li>Plenty of fruits and vegetables</li>
                                        <li>Stay hydrated – drink 8–10 glasses of water daily</li>
                                    </ul>
                                    <p class="meal-note"><i class="fas fa-info-circle"></i> Consult with a nutritionist for a personalized meal plan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="categories-section">
                <h3>Browse by Category</h3>
                <div class="categories-grid">
                    <div class="category-card" data-category="cardio"><i class="fas fa-running"></i><h4>Cardio</h4></div>
                    <div class="category-card" data-category="strength"><i class="fas fa-dumbbell"></i><h4>Strength</h4></div>
                    <div class="category-card" data-category="yoga"><i class="fas fa-spa"></i><h4>Yoga</h4></div>
                    <div class="category-card" data-category="hiit"><i class="fas fa-fire"></i><h4>HIIT</h4></div>
                    <div class="category-card" data-category="fullbody"><i class="fas fa-user-ninja"></i><h4>Full Body</h4></div>
                </div>
            </section>

            <section class="calendar-section">
                <h3>Your Week</h3>
                <div class="weekly-calendar" id="weeklyCalendar"></div>
            </section>

            <section class="planned-workouts">
                <div class="planned-workouts-header">
                    <h3>Scheduled Workouts</h3>
                    <button class="add-workout-header-btn" id="addWorkoutHeaderBtn">
                        <i class="fas fa-plus-circle"></i> Add Workout
                    </button>
                </div>
                <div class="selected-date-label" id="selectedDateLabel">
                    <i class="fas fa-calendar-alt"></i> <span id="selectedDateText">Select a day from the calendar above</span>
                </div>
                <div id="plannedWorkoutsList">
                    <p class="empty-state">No workouts scheduled yet. Click on a day to add workouts!</p>
                </div>
            </section>
        </div>

        <!-- STATS TAB -->
        <div class="tab-content" id="stats-tab">
            <h2>Your Progress</h2>
            <div class="stats-overview">
                <div class="stat-card"><i class="fas fa-fire"></i><div class="stat-info"><h3 id="totalCalories">0</h3><p>Total Calories Burned</p></div></div>
                <div class="stat-card"><i class="fas fa-clock"></i><div class="stat-info"><h3 id="totalTime">0</h3><p>Total Minutes Exercised</p></div></div>
                <div class="stat-card"><i class="fas fa-trophy"></i><div class="stat-info"><h3 id="totalWorkouts">0</h3><p>Workouts Completed</p></div></div>
                <div class="stat-card"><i class="fas fa-medal"></i><div class="stat-info"><h3 id="currentStreak">0</h3><p>Day Streak</p></div></div>
            </div>
            <div class="charts-container">
                <div class="chart-card"><h3>Weekly Activity</h3><canvas id="weeklyChart"></canvas></div>
                <div class="chart-card"><h3>Workout Distribution</h3><canvas id="distributionChart"></canvas></div>
            </div>
            <section class="achievements-section">
                <h3>Achievements & Milestones</h3>
                <div class="achievements-grid" id="achievementsGrid"></div>
            </section>
        </div>

        <!-- ABOUT TAB -->
        <div class="tab-content" id="about-tab">
            <h2>About FitForge</h2>
            <section class="about-section">
                <div class="about-card">
                    <i class="fas fa-bullseye"></i>
                    <h3>Our Mission</h3>
                    <p>FitForge is dedicated to making fitness accessible and enjoyable for everyone. We provide comprehensive workout tracking, personalized plans, and motivational tools to help you achieve your fitness goals.</p>
                </div>
                <div class="about-card">
                    <i class="fas fa-star"></i>
                    <h3>Features</h3>
                    <ul>
                        <li>Extensive workout library with video demonstrations</li>
                        <li>Customizable workout plans</li>
                        <li>Detailed progress tracking and analytics</li>
                        <li>Achievement system to keep you motivated</li>
                        <li>Responsive design for mobile and desktop</li>
                    </ul>
                </div>
                <div class="about-card">
                    <i class="fas fa-question-circle"></i>
                    <h3>Help & Support</h3>
                    <p>Need assistance? Check out our <a href="#faq">FAQ section</a> or <a href="#contact">contact our support team</a>.</p>
                </div>
                <div class="about-card">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Legal</h3>
                    <p><a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a></p>
                </div>
                <div class="about-card social-links">
                    <h3>Follow Us</h3>
                    <div class="social-icons">
                        <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Workout Detail Modal -->
    <div class="modal" id="workoutModal">
        <div class="modal-content">
            <button class="modal-close" id="closeModal"><i class="fas fa-times"></i></button>
            <div id="modalBody"></div>
        </div>
    </div>

    <!-- Schedule Workout Modal -->
    <div class="modal" id="scheduleModal">
        <div class="modal-content schedule-modal-content">
            <button class="modal-close" id="closeScheduleModal"><i class="fas fa-times"></i></button>
            <div class="schedule-modal-header">
                <i class="fas fa-calendar-plus"></i>
                <h2>Schedule Workout</h2>
                <p id="scheduleWorkoutName">–</p>
            </div>
            <div class="schedule-form">
                <div class="schedule-form-group">
                    <label>Pick a Day</label>
                    <div class="day-picker" id="dayPicker"></div>
                </div>
                <div class="schedule-form-row">
                    <div class="schedule-form-group">
                        <label for="scheduleTime">Time</label>
                        <input type="time" id="scheduleTime" value="08:00">
                    </div>
                    <div class="schedule-form-group">
                        <label for="scheduleNotes">Notes (optional)</label>
                        <input type="text" id="scheduleNotes" placeholder="e.g. morning session">
                    </div>
                </div>
                <button class="schedule-confirm-btn" id="confirmSchedule"><i class="fas fa-check-circle"></i> Confirm Schedule</button>
            </div>
        </div>
    </div>

    <!-- Workout Timer Modal -->
    <div class="modal" id="workoutTimerModal">
        <div class="modal-content timer-modal">
            <button class="modal-close" id="closeTimerModal"><i class="fas fa-times"></i></button>
            <div class="timer-header">
                <h2 id="timerWorkoutName">Workout Name</h2>
                <div class="workout-type-badge" id="timerWorkoutType">Cardio</div>
            </div>
            <div class="timer-container">
                <div class="time-display"><div id="timer">00:00</div><div class="timer-label">Time Elapsed</div></div>
                <div class="calories-display"><div id="caloriesBurned">0</div><div class="timer-label">Calories</div></div>
            </div>
            <div class="timer-controls">
                <button class="timer-btn start-btn" id="startTimer"><i class="fas fa-play"></i> Start</button>
                <button class="timer-btn skip-btn" id="skipExercise"><i class="fas fa-forward"></i> Skip</button>
                <button class="timer-btn complete-btn" id="completeWorkout"><i class="fas fa-check"></i> Complete</button>
            </div>
            <div class="instructions-section">
                <h3>Instructions</h3>
                <div id="instructionsList"></div>
            </div>
            <div class="progress-section">
                <div class="progress-info">
                    <span>Exercise <span id="currentExercise">1</span> of <span id="totalExercises">10</span></span>
                    <span id="exerciseName">Warm-up</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" id="workoutProgress"></div></div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="public/js/script.js"></script>
</body>
</html>
