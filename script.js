// Workouts Database
const workouts = [
    {
        id: 1,
        name: "Akash on Fire",
        type: "cardio",
        difficulty: "intermediate",
        duration: 30,
        calories: 350,
        description: "High-energy cardio session to kickstart your day",
        icon: "fa-running"
    },
    {
        id: 2,
        name: "Full Body Strength",
        type: "strength",
        difficulty: "advanced",
        duration: 45,
        calories: 400,
        description: "Complete strength training for all major muscle groups",
        icon: "fa-dumbbell"
    },
    {
        id: 3,
        name: "HIIT Power Session",
        type: "hiit",
        difficulty: "advanced",
        duration: 20,
        calories: 300,
        description: "Intense interval training for maximum calorie burn",
        icon: "fa-fire"
    },
    {
        id: 4,
        name: "Yoga Flow for Beginners",
        type: "yoga",
        difficulty: "beginner",
        duration: 30,
        calories: 150,
        description: "Gentle yoga flow to improve flexibility and mindfulness",
        icon: "fa-spa"
    },
    {
        id: 5,
        name: "Upper Body Pump",
        type: "strength",
        difficulty: "intermediate",
        duration: 35,
        calories: 320,
        description: "Target your chest, back, shoulders, and arms",
        icon: "fa-dumbbell"
    },
    {
        id: 6,
        name: "Evening Cardio Walk",
        type: "cardio",
        difficulty: "beginner",
        duration: 45,
        calories: 250,
        description: "Low-impact cardio perfect for recovery days",
        icon: "fa-walking"
    },
    {
        id: 7,
        name: "Core Crusher",
        type: "fullbody",
        difficulty: "intermediate",
        duration: 25,
        calories: 200,
        description: "Strengthen and tone your core muscles",
        icon: "fa-user-ninja"
    },
    {
        id: 8,
        name: "Power Yoga",
        type: "yoga",
        difficulty: "intermediate",
        duration: 40,
        calories: 220,
        description: "Dynamic yoga session combining strength and flexibility",
        icon: "fa-spa"
    },
    {
        id: 9,
        name: "Leg Day Destroyer",
        type: "strength",
        difficulty: "advanced",
        duration: 50,
        calories: 450,
        description: "Intense lower body workout for serious gains",
        icon: "fa-dumbbell"
    },
    {
        id: 10,
        name: "Tabata HIIT",
        type: "hiit",
        difficulty: "intermediate",
        duration: 15,
        calories: 250,
        description: "Quick and effective Tabata-style intervals",
        icon: "fa-fire"
    },
    {
        id: 11,
        name: "Full Body Circuit",
        type: "fullbody",
        difficulty: "beginner",
        duration: 30,
        calories: 280,
        description: "Complete circuit training for beginners",
        icon: "fa-user-ninja"
    },
    {
        id: 12,
        name: "Sprint Intervals",
        type: "cardio",
        difficulty: "advanced",
        duration: 25,
        calories: 380,
        description: "High-intensity sprint training for speed and power",
        icon: "fa-running"
    }
];

// Achievements Database
const achievements = [
    { id: 1, name: "First Workout", description: "Complete your first workout", icon: "fa-star", unlocked: false },
    { id: 2, name: "Week Warrior", description: "7-day workout streak", icon: "fa-fire", unlocked: false },
    { id: 3, name: "Calorie Crusher", description: "Burn 1000 calories", icon: "fa-burn", unlocked: false },
    { id: 4, name: "Time Master", description: "100 minutes exercised", icon: "fa-clock", unlocked: false },
    { id: 5, name: "Variety King", description: "Try all workout types", icon: "fa-crown", unlocked: false },
    { id: 6, name: "Month Champion", description: "30-day streak", icon: "fa-trophy", unlocked: false }
];

// User Stats (stored in localStorage)
let userStats = {
    totalCalories: 0,
    totalTime: 0,
    totalWorkouts: 0,
    currentStreak: 0,
    lastWorkoutDate: null,
    workoutHistory: [],
    plannedWorkouts: {}
};

// Load user stats from localStorage
function loadUserStats() {
    const saved = localStorage.getItem('bunsofsteelStats');
    if (saved) {
        userStats = JSON.parse(saved);
    }
}

// Save user stats to localStorage
function saveUserStats() {
    localStorage.setItem('bunsofsteelStats', JSON.stringify(userStats));
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadUserStats();
    initializeApp();
});

function initializeApp() {
    // Tab navigation
    setupTabNavigation();
    
    // Home tab
    renderWorkouts();
    setupCarousel();
    setupFilters();
    setupQuickStart();
    
    // Planner tab
    setupCalendar();
    setupCategories();
    
    // Stats tab
    updateStatsDisplay();
    renderCharts();
    renderAchievements();
    
    // Modal
    setupModal();
}

// Tab Navigation
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked
            btn.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Refresh charts if stats tab
            if (tabName === 'stats') {
                renderCharts();
            }
        });
    });
}

// Render Workouts
function renderWorkouts(filteredWorkouts = workouts) {
    const carousel = document.getElementById('workoutCarousel');
    const grid = document.getElementById('workoutsGrid');
    
    // Clear existing
    carousel.innerHTML = '';
    grid.innerHTML = '';
    
    // Render carousel (featured workouts - first 6)
    filteredWorkouts.slice(0, 6).forEach(workout => {
        carousel.appendChild(createWorkoutCard(workout));
    });
    
    // Render grid (all workouts)
    filteredWorkouts.forEach(workout => {
        grid.appendChild(createWorkoutCard(workout));
    });
}

function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.dataset.workoutId = workout.id;
    
    card.innerHTML = `
        <div class="workout-card-header ${workout.type}">
            <i class="fas ${workout.icon}"></i>
        </div>
        <div class="workout-card-body">
            <h3>${workout.name}</h3>
            <p>${workout.description}</p>
            <div class="workout-stats">
                <div class="stat">
                    <i class="fas fa-fire"></i>
                    <span>${workout.calories} cal</span>
                </div>
                <div class="stat">
                    <i class="fas fa-clock"></i>
                    <span>${workout.duration} min</span>
                </div>
            </div>
            <span class="difficulty-badge ${workout.difficulty}">${workout.difficulty}</span>
        </div>
    `;
    
    card.addEventListener('click', () => openWorkoutModal(workout));
    
    return card;
}

// Carousel Controls
function setupCarousel() {
    const carousel = document.getElementById('workoutCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -400, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 400, behavior: 'smooth' });
    });
}

// Filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const durationFilter = document.getElementById('durationFilter');
    
    function applyFilters() {
        let filtered = workouts;
        
        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(w => 
                w.name.toLowerCase().includes(searchTerm) ||
                w.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Type filter
        if (typeFilter.value !== 'all') {
            filtered = filtered.filter(w => w.type === typeFilter.value);
        }
        
        // Difficulty filter
        if (difficultyFilter.value !== 'all') {
            filtered = filtered.filter(w => w.difficulty === difficultyFilter.value);
        }
        
        // Duration filter
        if (durationFilter.value !== 'all') {
            const duration = parseInt(durationFilter.value);
            filtered = filtered.filter(w => w.duration <= duration);
        }
        
        renderWorkouts(filtered);
    }
    
    searchInput.addEventListener('input', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    difficultyFilter.addEventListener('change', applyFilters);
    durationFilter.addEventListener('change', applyFilters);
}

// Quick Start
function setupQuickStart() {
    const quickStartBtn = document.getElementById('quickStartBtn');
    
    quickStartBtn.addEventListener('click', () => {
        const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
        startWorkout(randomWorkout);
    });
}

// Workout Modal
function setupModal() {
    const modal = document.getElementById('workoutModal');
    const closeBtn = document.getElementById('closeModal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openWorkoutModal(workout) {
    const modal = document.getElementById('workoutModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">
                <i class="fas ${workout.icon}"></i>
            </div>
            <h2>${workout.name}</h2>
            <p>${workout.description}</p>
        </div>
        <div class="modal-stats">
            <div class="modal-stat">
                <i class="fas fa-fire"></i>
                <h4>${workout.calories}</h4>
                <p>Calories</p>
            </div>
            <div class="modal-stat">
                <i class="fas fa-clock"></i>
                <h4>${workout.duration}</h4>
                <p>Minutes</p>
            </div>
            <div class="modal-stat">
                <i class="fas fa-signal"></i>
                <h4>${workout.difficulty}</h4>
                <p>Level</p>
            </div>
        </div>
        <button class="start-workout-btn" onclick="startWorkout(${JSON.stringify(workout).replace(/"/g, '&quot;')})">
            <i class="fas fa-play"></i> Start Workout
        </button>
    `;
    
    modal.classList.add('active');
}

function startWorkout(workout) {
    // Update stats
    userStats.totalCalories += workout.calories;
    userStats.totalTime += workout.duration;
    userStats.totalWorkouts += 1;
    
    // Update streak
    const today = new Date().toDateString();
    if (userStats.lastWorkoutDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userStats.lastWorkoutDate === yesterday.toDateString()) {
            userStats.currentStreak += 1;
        } else {
            userStats.currentStreak = 1;
        }
        
        userStats.lastWorkoutDate = today;
    }
    
    // Add to history
    userStats.workoutHistory.push({
        workout: workout,
        date: new Date().toISOString(),
        completed: true
    });
    
    // Check achievements
    checkAchievements();
    
    // Save and update
    saveUserStats();
    updateStatsDisplay();
    renderCharts();
    
    // Close modal and show success
    document.getElementById('workoutModal').classList.remove('active');
    alert(`Great job! You completed ${workout.name}!\n\n+${workout.calories} calories\n+${workout.duration} minutes`);
}

// Calendar
function setupCalendar() {
    const calendarEl = document.getElementById('weeklyCalendar');
    const today = new Date();
    
    calendarEl.innerHTML = '';
    
    // Get current week
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        const dateStr = date.toDateString();
        const hasWorkout = userStats.plannedWorkouts[dateStr];
        
        if (hasWorkout) {
            dayEl.classList.add('has-workout');
        }
        
        if (i === 0) {
            dayEl.classList.add('active');
        }
        
        dayEl.innerHTML = `
            <div class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="day-number">${date.getDate()}</div>
            ${hasWorkout ? `<div class="workout-count">${hasWorkout.length} workout(s)</div>` : ''}
        `;
        
        dayEl.addEventListener('click', () => showPlannedWorkouts(dateStr));
        
        calendarEl.appendChild(dayEl);
    }
}

// Add these variables at the top with other variables
let timerInterval = null;
let timerSeconds = 0;
let currentWorkout = null;
let workoutExercises = [];
let currentExerciseIndex = 0;
let caloriesPerSecond = 0;
let workoutPaused = false;

// Workout exercises database (extend this as needed)
const exercises = {
    cardio: [
        { name: "Warm-up Jog", duration: 300, calories: 50 },
        { name: "Jumping Jacks", duration: 180, calories: 30 },
        { name: "High Knees", duration: 180, calories: 35 },
        { name: "Burpees", duration: 240, calories: 40 },
        { name: "Cool Down", duration: 300, calories: 25 }
    ],
    strength: [
        { name: "Warm-up", duration: 180, calories: 20 },
        { name: "Push-ups", duration: 240, calories: 40 },
        { name: "Squats", duration: 240, calories: 35 },
        { name: "Lunges", duration: 240, calories: 30 },
        { name: "Plank", duration: 180, calories: 25 },
        { name: "Cool Down", duration: 180, calories: 20 }
    ],
    hiit: [
        { name: "Warm-up", duration: 180, calories: 25 },
        { name: "Sprint", duration: 60, calories: 20 },
        { name: "Rest", duration: 30, calories: 5 },
        { name: "Jump Squats", duration: 60, calories: 25 },
        { name: "Rest", duration: 30, calories: 5 },
        { name: "Mountain Climbers", duration: 60, calories: 30 },
        { name: "Cool Down", duration: 180, calories: 20 }
    ],
    yoga: [
        { name: "Breathing", duration: 180, calories: 15 },
        { name: "Sun Salutations", duration: 300, calories: 40 },
        { name: "Warrior Poses", duration: 240, calories: 30 },
        { name: "Balance Poses", duration: 240, calories: 25 },
        { name: "Cool Down", duration: 180, calories: 15 }
    ],
    fullbody: [
        { name: "Warm-up", duration: 180, calories: 25 },
        { name: "Squat to Press", duration: 180, calories: 35 },
        { name: "Push-up Row", duration: 180, calories: 30 },
        { name: "Lunge with Twist", duration: 180, calories: 25 },
        { name: "Burpee", duration: 180, calories: 40 },
        { name: "Cool Down", duration: 180, calories: 20 }
    ]
};

// Instructions for exercises
const exerciseInstructions = {
    "Warm-up Jog": "Jog in place for 5 minutes. Focus on breathing and getting your heart rate up.",
    "Jumping Jacks": "Stand with feet together, arms at sides. Jump while spreading legs and raising arms. Return to start.",
    "High Knees": "Run in place while bringing knees up to hip level. Keep core engaged.",
    "Burpees": "Squat down, place hands on floor. Kick feet back into plank. Do a push-up. Return to squat and jump up.",
    "Push-ups": "Keep body straight from head to heels. Lower chest to floor, then push back up.",
    "Squats": "Feet shoulder-width apart. Lower hips back and down as if sitting. Keep chest up.",
    "Lunges": "Step forward with one leg. Lower until both knees are at 90 degrees. Return and alternate.",
    "Plank": "Hold push-up position on forearms. Keep body straight. Engage core.",
    "Sprint": "Run as fast as you can for the duration. Focus on speed and power.",
    "Jump Squats": "Perform a regular squat, then explosively jump up. Land softly and immediately go into next squat.",
    "Mountain Climbers": "In plank position, alternate bringing knees to chest quickly.",
    "Sun Salutations": "Flow through a series of yoga poses: mountain, forward fold, plank, cobra, downward dog.",
    "Warrior Poses": "Hold Warrior I, II, and III poses on each side. Focus on balance and strength.",
    "Balance Poses": "Practice tree pose and eagle pose. Focus on stability and breathing.",
    "Squat to Press": "Hold weights at shoulders. Squat down, then stand and press weights overhead.",
    "Push-up Row": "In plank with dumbbells, do a push-up, then row one weight to side. Alternate sides.",
    "Lunge with Twist": "Hold weight at chest. Lunge forward, then twist torso toward front leg.",
    "Breathing": "Focus on deep, controlled breathing. Inhale for 4 counts, exhale for 6 counts.",
    "Rest": "Take this time to recover. Walk slowly and hydrate.",
    "Cool Down": "Walk slowly and stretch major muscle groups. Focus on deep breathing.",
    "Warm-up": "Perform light cardio and dynamic stretches for the duration."
};

// Update the startWorkout function
function startWorkout(workout) {
    // Store current workout
    currentWorkout = workout;
    
    // Calculate calories per second based on workout calories and duration
    caloriesPerSecond = workout.calories / (workout.duration * 60);
    
    // Get exercises for this workout type
    workoutExercises = getExercisesForWorkout(workout);
    currentExerciseIndex = 0;
    timerSeconds = 0;
    
    // Setup timer modal
    setupTimerModal(workout);
    
    // Close the workout detail modal
    document.getElementById('workoutModal').classList.remove('active');
    
    // Show timer modal
    document.getElementById('workoutTimerModal').classList.add('active');
}

function getExercisesForWorkout(workout) {
    // Get base exercises for the workout type
    const baseExercises = exercises[workout.type] || exercises.cardio;
    
    // Adjust durations to match workout duration
    const totalBaseDuration = baseExercises.reduce((sum, ex) => sum + ex.duration, 0);
    const durationRatio = (workout.duration * 60) / totalBaseDuration;
    
    return baseExercises.map(exercise => ({
        ...exercise,
        duration: Math.round(exercise.duration * durationRatio)
    }));
}

function setupTimerModal(workout) {
    document.getElementById('timerWorkoutName').textContent = workout.name;
    document.getElementById('timerWorkoutType').textContent = workout.type.charAt(0).toUpperCase() + workout.type.slice(1);
    
    // Setup timer controls
    document.getElementById('startTimer').onclick = startTimer;
    document.getElementById('pauseTimer').onclick = pauseTimer;
    document.getElementById('skipExercise').onclick = skipExercise;
    document.getElementById('completeWorkout').onclick = completeWorkout;
    
    // Setup close button
    document.getElementById('closeTimerModal').onclick = () => {
        document.getElementById('workoutTimerModal').classList.remove('active');
        resetTimer();
    };
    
    // Update display
    updateTimerDisplay();
    updateInstructions();
    updateProgress();
}

function startTimer() {
    if (workoutPaused) {
        workoutPaused = false;
        document.getElementById('startTimer').innerHTML = '<i class="fas fa-pause"></i> Pause';
        document.getElementById('startTimer').classList.remove('start-btn');
        document.getElementById('startTimer').classList.add('pause-btn');
    } else {
        timerInterval = setInterval(updateTimer, 1000);
        workoutPaused = false;
        document.getElementById('startTimer').innerHTML = '<i class="fas fa-pause"></i> Pause';
        document.getElementById('startTimer').classList.remove('start-btn');
        document.getElementById('startTimer').classList.add('pause-btn');
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    workoutPaused = true;
    document.getElementById('startTimer').innerHTML = '<i class="fas fa-play"></i> Resume';
    document.getElementById('startTimer').classList.remove('pause-btn');
    document.getElementById('startTimer').classList.add('start-btn');
}

function skipExercise() {
    if (currentExerciseIndex < workoutExercises.length - 1) {
        currentExerciseIndex++;
        updateInstructions();
        updateProgress();
    }
}

function updateTimer() {
    timerSeconds++;
    
    // Check if current exercise is complete
    const currentExercise = workoutExercises[currentExerciseIndex];
    const exerciseStartTime = workoutExercises.slice(0, currentExerciseIndex)
        .reduce((sum, ex) => sum + ex.duration, 0);
    
    if (timerSeconds >= exerciseStartTime + currentExercise.duration) {
        if (currentExerciseIndex < workoutExercises.length - 1) {
            currentExerciseIndex++;
            updateInstructions();
            updateProgress();
            
            // Play a sound or show notification (optional)
            if (Notification.permission === 'granted') {
                new Notification('Next Exercise!', {
                    body: `Time for: ${workoutExercises[currentExerciseIndex].name}`
                });
            }
        } else {
            completeWorkout();
        }
    }
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const seconds = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    
    // Update calories burned
    const caloriesBurned = Math.round(timerSeconds * caloriesPerSecond);
    document.getElementById('caloriesBurned').textContent = caloriesBurned;
}

function updateInstructions() {
    const instructionsList = document.getElementById('instructionsList');
    instructionsList.innerHTML = '';
    
    workoutExercises.forEach((exercise, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = `instruction-step ${index === currentExerciseIndex ? 'active' : ''}`;
        
        const instructionText = exerciseInstructions[exercise.name] || 
                               `Perform ${exercise.name} for ${Math.floor(exercise.duration / 60)} minutes.`;
        
        stepDiv.innerHTML = `
            <div class="instruction-number">${index + 1}</div>
            <div class="instruction-text">
                <strong>${exercise.name}</strong> - ${Math.floor(exercise.duration / 60)}:${(exercise.duration % 60).toString().padStart(2, '0')}
                <p>${instructionText}</p>
            </div>
        `;
        
        instructionsList.appendChild(stepDiv);
    });
}

function updateProgress() {
    const currentExercise = workoutExercises[currentExerciseIndex];
    document.getElementById('currentExercise').textContent = currentExerciseIndex + 1;
    document.getElementById('totalExercises').textContent = workoutExercises.length;
    document.getElementById('exerciseName').textContent = currentExercise.name;
    
    // Calculate progress percentage
    const totalDuration = workoutExercises.reduce((sum, ex) => sum + ex.duration, 0);
    const elapsedDuration = workoutExercises.slice(0, currentExerciseIndex)
        .reduce((sum, ex) => sum + ex.duration, 0);
    const progressPercent = (elapsedDuration / totalDuration) * 100;
    
    document.getElementById('workoutProgress').style.width = `${progressPercent}%`;
}

function completeWorkout() {
    clearInterval(timerInterval);
    
    // Calculate actual calories burned based on time
    const actualCalories = Math.round(timerSeconds * caloriesPerSecond);
    const actualMinutes = Math.floor(timerSeconds / 60);
    
    // Update stats with actual values
    userStats.totalCalories += actualCalories;
    userStats.totalTime += actualMinutes;
    userStats.totalWorkouts += 1;
    
    // Update streak
    const today = new Date().toDateString();
    if (userStats.lastWorkoutDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (userStats.lastWorkoutDate === yesterday.toDateString()) {
            userStats.currentStreak += 1;
        } else {
            userStats.currentStreak = 1;
        }
        
        userStats.lastWorkoutDate = today;
    }
    
    // Add to history
    userStats.workoutHistory.push({
        workout: currentWorkout,
        date: new Date().toISOString(),
        completed: true,
        duration: actualMinutes,
        calories: actualCalories
    });
    
    // Check achievements
    checkAchievements();
    
    // Save and update
    saveUserStats();
    updateStatsDisplay();
    renderCharts();
    
    // Close timer modal
    document.getElementById('workoutTimerModal').classList.remove('active');
    
    // Show completion message
    alert(`🎉 Workout Complete!\n\n${currentWorkout.name}\nDuration: ${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')}\nCalories Burned: ${actualCalories}`);
    
    // Reset timer
    resetTimer();
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    workoutPaused = false;
    currentWorkout = null;
    workoutExercises = [];
    currentExerciseIndex = 0;
    caloriesPerSecond = 0;
}

// Add notification permission request at app initialization
function initializeApp() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Rest of existing initialization code...
    setupTabNavigation();
    renderWorkouts();
    setupCarousel();
    setupFilters();
    setupQuickStart();
    setupCalendar();
    setupCategories();
    updateStatsDisplay();
    renderCharts();
    renderAchievements();
    setupModal();
    setupTimerModalHandlers();
}

// Add timer modal handlers
function setupTimerModalHandlers() {
    const timerModal = document.getElementById('workoutTimerModal');
    
    timerModal.addEventListener('click', (e) => {
        if (e.target === timerModal) {
            timerModal.classList.remove('active');
            resetTimer();
        }
    });
}

function showPlannedWorkouts(dateStr) {
    const listEl = document.getElementById('plannedWorkoutsList');
    const planned = userStats.plannedWorkouts[dateStr];
    
    if (!planned || planned.length === 0) {
        listEl.innerHTML = '<p class="empty-state">No workouts scheduled for this day.</p>';
        return;
    }
    
    listEl.innerHTML = planned.map(workoutId => {
        const workout = workouts.find(w => w.id === workoutId);
        return `
            <div class="workout-card" style="margin-bottom: 1rem;">
                <div class="workout-card-header ${workout.type}">
                    <i class="fas ${workout.icon}"></i>
                </div>
                <div class="workout-card-body">
                    <h3>${workout.name}</h3>
                    <p>${workout.description}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Categories
function setupCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Switch to home tab and filter by category
            document.querySelector('[data-tab="home"]').click();
            document.getElementById('typeFilter').value = category;
            document.getElementById('typeFilter').dispatchEvent(new Event('change'));
        });
    });
}

// Stats Display
function updateStatsDisplay() {
    document.getElementById('totalCalories').textContent = userStats.totalCalories.toLocaleString();
    document.getElementById('totalTime').textContent = userStats.totalTime.toLocaleString();
    document.getElementById('totalWorkouts').textContent = userStats.totalWorkouts;
    document.getElementById('currentStreak').textContent = userStats.currentStreak;
}

// Charts
let weeklyChart = null;
let distributionChart = null;

function renderCharts() {
    renderWeeklyChart();
    renderDistributionChart();
}

function renderWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;
    
    // Get last 7 days of data
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Calculate calories for this day
        const dayCalories = userStats.workoutHistory
            .filter(h => {
                const historyDate = new Date(h.date);
                return historyDate.toDateString() === date.toDateString();
            })
            .reduce((sum, h) => sum + h.workout.calories, 0);
        
        data.push(dayCalories);
    }
    
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calories Burned',
                data: data,
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#b8b8d1'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#b8b8d1'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function renderDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    
    // Count workouts by type
    const typeCounts = {
        cardio: 0,
        strength: 0,
        hiit: 0,
        yoga: 0,
        fullbody: 0
    };
    
    userStats.workoutHistory.forEach(h => {
        typeCounts[h.workout.type]++;
    });
    
    if (distributionChart) {
        distributionChart.destroy();
    }
    
    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cardio', 'Strength', 'HIIT', 'Yoga', 'Full Body'],
            datasets: [{
                data: [
                    typeCounts.cardio,
                    typeCounts.strength,
                    typeCounts.hiit,
                    typeCounts.yoga,
                    typeCounts.fullbody
                ],
                backgroundColor: [
                    '#4facfe',
                    '#f5576c',
                    '#fee140',
                    '#38f9d7',
                    '#764ba2'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

// Achievements
function checkAchievements() {
    // First Workout
    if (userStats.totalWorkouts >= 1 && !achievements[0].unlocked) {
        achievements[0].unlocked = true;
        showAchievementNotification(achievements[0]);
    }
    
    // Week Warrior
    if (userStats.currentStreak >= 7 && !achievements[1].unlocked) {
        achievements[1].unlocked = true;
        showAchievementNotification(achievements[1]);
    }
    
    // Calorie Crusher
    if (userStats.totalCalories >= 1000 && !achievements[2].unlocked) {
        achievements[2].unlocked = true;
        showAchievementNotification(achievements[2]);
    }
    
    // Time Master
    if (userStats.totalTime >= 100 && !achievements[3].unlocked) {
        achievements[3].unlocked = true;
        showAchievementNotification(achievements[3]);
    }
    
    // Variety King
    const types = new Set(userStats.workoutHistory.map(h => h.workout.type));
    if (types.size >= 5 && !achievements[4].unlocked) {
        achievements[4].unlocked = true;
        showAchievementNotification(achievements[4]);
    }
    
    // Month Champion
    if (userStats.currentStreak >= 30 && !achievements[5].unlocked) {
        achievements[5].unlocked = true;
        showAchievementNotification(achievements[5]);
    }
    
    renderAchievements();
}

function showAchievementNotification(achievement) {
    alert(`🏆 Achievement Unlocked!\n\n${achievement.name}\n${achievement.description}`);
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    
    grid.innerHTML = achievements.map(achievement => `
        <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : ''}">
            <i class="fas ${achievement.icon}"></i>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        </div>
    `).join('');
}

// Profile and Settings (placeholder functions)
document.getElementById('profileBtn').addEventListener('click', () => {
    alert('Profile feature coming soon!');
});

document.getElementById('settingsBtn').addEventListener('click', () => {
    const reset = confirm('Settings\n\nWould you like to reset all your progress?');
    if (reset) {
        localStorage.removeItem('bunsofsteelStats');
        userStats = {
            totalCalories: 0,
            totalTime: 0,
            totalWorkouts: 0,
            currentStreak: 0,
            lastWorkoutDate: null,
            workoutHistory: [],
            plannedWorkouts: {}
        };
        achievements.forEach(a => a.unlocked = false);
        updateStatsDisplay();
        renderCharts();
        renderAchievements();
        alert('All progress has been reset!');
    }
});