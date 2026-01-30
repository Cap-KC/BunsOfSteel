<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoversOdessy - Online Fitness Tracker</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Top Navigation Bar -->
    <nav class="top-nav">
        <div class="nav-container">
            <div class="logo">
                <i class="fa-solid fa-dumbbell"></i>
                <span>MoversOdessy</span>
            </div>
                <button class="icon-btn" id="profileBtn">
                    <i class="fas fa-user-circle"></i>
                </button>
                <button class="icon-btn" id="settingsBtn">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Main Navigation Tabs -->
        <button class="tab-btn" data-tab="about">
            <i class="fas fa-info-circle"></i>
            <span>About</span>
        </button>
    </div>

    <!-- Main Content Container -->
    <main class="main-content">
        <!-- HOME TAB -->
        <div class="tab-content active" id="home-tab">
            <!-- Search and Filters -->
            <div class="filters-section">
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search workouts...">
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

            <!-- Quick Start Button -->
            <button class="quick-start-btn" id="quickStartBtn">
                <i class="fas fa-play"></i>
                Start Random Workout
            </button>

            <!-- Featured Workouts Carousel -->
            <section class="featured-section">
                <h2>Featured Workouts</h2>
                <div class="carousel-container">
                    <button class="carousel-btn prev" id="prevBtn">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="carousel" id="workoutCarousel">
                        <!-- Workout cards will be injected here by JavaScript -->
                    </div>
                    <button class="carousel-btn next" id="nextBtn">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </section>

            <!-- All Workouts Grid -->
            <section class="workouts-grid-section">
                <h2>All Workouts</h2>
                <div class="workouts-grid" id="workoutsGrid">
                    <!-- Workout cards will be injected here -->
                </div>
            </section>
        </div>

        <!-- PLANNER TAB -->
        <div class="tab-content" id="planner-tab">
            <h2>Workout Planner</h2>
            
            <!-- Workout Categories -->
            <section class="categories-section">
                <h3>Browse by Category</h3>
                <div class="categories-grid">
                    <div class="category-card" data-category="cardio">
                        <i class="fas fa-running"></i>
                        <h4>Cardio</h4>
                    </div>
                    <div class="category-card" data-category="strength">
                        <i class="fas fa-dumbbell"></i>
                        <h4>Strength</h4>
                    </div>
                    <div class="category-card" data-category="yoga">
                        <i class="fas fa-spa"></i>
                        <h4>Yoga</h4>
                    </div>
                    <div class="category-card" data-category="hiit">
                        <i class="fas fa-fire"></i>
                        <h4>HIIT</h4>
                    </div>
                    <div class="category-card" data-category="fullbody">
                        <i class="fas fa-user-ninja"></i>
                        <h4>Full Body</h4>
                    </div>
                </div>
            </section>

            <!-- Weekly Calendar -->
            <section class="calendar-section">
                <h3>Your Week</h3>
                <div class="weekly-calendar" id="weeklyCalendar">
                    <!-- Calendar will be generated by JavaScript -->
                </div>
            </section>

            <!-- Planned Workouts -->
            <section class="planned-workouts">
                <h3>Scheduled Workouts</h3>
                <div id="plannedWorkoutsList">
                    <p class="empty-state">No workouts scheduled yet. Click on a day to add workouts!</p>
                </div>
            </section>
        </div>

        <!-- STATS TAB -->
        <div class="tab-content" id="stats-tab">
            <h2>Your Progress</h2>
            
            <!-- Progress Overview Cards -->
            <div class="stats-overview">
                <div class="stat-card">
                    <i class="fas fa-fire"></i>
                    <div class="stat-info">
                        <h3 id="totalCalories">0</h3>
                        <p>Total Calories Burned</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-info">
                        <h3 id="totalTime">0</h3>
                        <p>Total Minutes Exercised</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-trophy"></i>
                    <div class="stat-info">
                        <h3 id="totalWorkouts">0</h3>
                        <p>Workouts Completed</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-medal"></i>
                    <div class="stat-info">
                        <h3 id="currentStreak">0</h3>
                        <p>Day Streak</p>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="charts-container">
                <div class="chart-card">
                    <h3>Weekly Activity</h3>
                    <canvas id="weeklyChart"></canvas>
                </div>
                <div class="chart-card">
                    <h3>Workout Distribution</h3>
                    <canvas id="distributionChart"></canvas>
                </div>
            </div>

            <!-- Achievements -->
            <section class="achievements-section">
                <h3>Achievements & Milestones</h3>
                <div class="achievements-grid" id="achievementsGrid">
                    <!-- Achievements will be generated by JavaScript -->
                </div>
            </section>
        </div>

        <!-- ABOUT TAB -->
        <div class="tab-content" id="about-tab">
            <h2>About MoversOdessy</h2>
            
            <section class="about-section">
                <div class="about-card">
                    <i class="fas fa-bullseye"></i>
                    <h3>Our Mission</h3>
                    <p>MoversOdessy is dedicated to making fitness accessible and enjoyable for everyone. We provide comprehensive workout tracking, personalized plans, and motivational tools to help you achieve your fitness goals.</p>
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
                    <p>
                        <a href="#privacy">Privacy Policy</a> | 
                        <a href="#terms">Terms of Service</a>
                    </p>
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
            <button class="modal-close" id="closeModal">
                <i class="fas fa-times"></i>
            </button>
            <div id="modalBody">
                <!-- Modal content will be injected by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Workout Timer Modal -->
    <div class="modal" id="workoutTimerModal">
        <div class="modal-content timer-modal">
            <button class="modal-close" id="closeTimerModal">
                <i class="fas fa-times"></i>
            </button>
            <div class="timer-header">
                <h2 id="timerWorkoutName">Workout Name</h2>
                <div class="workout-type-badge" id="timerWorkoutType">Cardio</div>
            </div>
            
            <div class="timer-container">
                <div class="time-display">
                    <div id="timer">00:00</div>
                    <div class="timer-label">Time Elapsed</div>
                </div>
                <div class="calories-display">
                    <div id="caloriesBurned">0</div>
                    <div class="timer-label">Calories</div>
                </div>
            </div>
            
            <div class="timer-controls">
                <button class="timer-btn start-btn" id="startTimer">
                    <i class="fas fa-play"></i> Start
                </button>
                <button class="timer-btn pause-btn" id="pauseTimer">
                    <i class="fas fa-pause"></i> Pause
                </button>
                <button class="timer-btn skip-btn" id="skipExercise">
                    <i class="fas fa-forward"></i> Skip
                </button>
                <button class="timer-btn complete-btn" id="completeWorkout">
                    <i class="fas fa-check"></i> Complete
                </button>
            </div>
            
            <div class="instructions-section">
                <h3>Instructions</h3>
                <div id="instructionsList">
                    <!-- Instructions will be added here -->
                </div>
            </div>
            
            <div class="progress-section">
                <div class="progress-info">
                    <span>Exercise <span id="currentExercise">1</span> of <span id="totalExercises">10</span></span>
                    <span id="exerciseName">Warm-up</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="workoutProgress"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script.js"></script>
</body>
</html>