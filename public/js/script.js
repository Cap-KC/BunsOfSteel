// script.js – BunsOfSteel

// ---------------------------------------------------------------------------
// Workouts database (static – could later be fetched from an API)
// ---------------------------------------------------------------------------
const workouts = [
    { id: 1,  name: "Rowing Matchine",          type: "cardio",   difficulty: "intermediate", duration: 30, calories: 350, description: "High-energy cardio session to kickstart your day",                     icon: "fa-running" },
    { id: 2,  name: "Full Body Strength",     type: "strength", difficulty: "advanced",     duration: 45, calories: 400, description: "Complete strength training for all major muscle groups",            icon: "fa-dumbbell" },
    { id: 3,  name: "HIIT Power Session",     type: "hiit",     difficulty: "advanced",     duration: 20, calories: 300, description: "Intense interval training for maximum calorie burn",                icon: "fa-fire" },
    { id: 4,  name: "Yoga Flow for Beginners",type: "yoga",     difficulty: "beginner",     duration: 30, calories: 150, description: "Gentle yoga flow to improve flexibility and mindfulness",          icon: "fa-spa" },
    { id: 5,  name: "Upper Body Pump",        type: "strength", difficulty: "intermediate", duration: 35, calories: 320, description: "Target your chest, back, shoulders, and arms",                      icon: "fa-dumbbell" },
    { id: 6,  name: "Evening Cardio Walk",    type: "cardio",   difficulty: "beginner",     duration: 45, calories: 250, description: "Low-impact cardio perfect for recovery days",                       icon: "fa-walking" },
    { id: 7,  name: "Core Crusher",           type: "fullbody", difficulty: "intermediate", duration: 25, calories: 200, description: "Strengthen and tone your core muscles",                             icon: "fa-user-ninja" },
    { id: 8,  name: "Power Yoga",             type: "yoga",     difficulty: "intermediate", duration: 40, calories: 220, description: "Dynamic yoga session combining strength and flexibility",          icon: "fa-spa" },
    { id: 9,  name: "Leg Day Destroyer",      type: "strength", difficulty: "advanced",     duration: 50, calories: 450, description: "Intense lower body workout for serious gains",                     icon: "fa-dumbbell" },
    { id: 10, name: "Tabata HIIT",            type: "hiit",     difficulty: "intermediate", duration: 15, calories: 250, description: "Quick and effective Tabata-style intervals",                       icon: "fa-fire" },
    { id: 11, name: "Full Body Circuit",      type: "fullbody", difficulty: "beginner",     duration: 30, calories: 280, description: "Complete circuit training for beginners",                           icon: "fa-user-ninja" },
    { id: 12, name: "Sprint Intervals",       type: "cardio",   difficulty: "advanced",     duration: 25, calories: 380, description: "High-intensity sprint training for speed and power",              icon: "fa-running" }
];

const achievements = [
    { id: 1, name: "First Workout",    description: "Complete your first workout",  icon: "fa-star",    unlocked: false },
    { id: 2, name: "Week Warrior",     description: "7-day workout streak",         icon: "fa-fire",    unlocked: false },
    { id: 3, name: "Calorie Crusher",  description: "Burn 1000 calories",          icon: "fa-burn",    unlocked: false },
    { id: 4, name: "Time Master",      description: "100 minutes exercised",        icon: "fa-clock",   unlocked: false },
    { id: 5, name: "Variety King",     description: "Try all workout types",        icon: "fa-crown",   unlocked: false },
    { id: 6, name: "Month Champion",   description: "30-day streak",               icon: "fa-trophy",  unlocked: false }
];

// ---------------------------------------------------------------------------
// User stats – kept in memory; persisted to localStorage per-session.
// (A future iteration can swap this for a /src/api/stats.php endpoint.)
// ---------------------------------------------------------------------------
let userStats = {
    totalCalories: 0, totalTime: 0, totalWorkouts: 0,
    currentStreak: 0, lastWorkoutDate: null,
    workoutHistory: [], plannedWorkouts: {}
};

function loadUserStats() {
    const saved = localStorage.getItem('bunsofsteelStats');
    if (saved) userStats = JSON.parse(saved);
}

function saveUserStats() {
    localStorage.setItem('bunsofsteelStats', JSON.stringify(userStats));
}

// ---------------------------------------------------------------------------
// Bootstrap – verify session with server, then init UI
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res  = await fetch('src/api/session.php');
        const data = await res.json();

        if (!data.success) {
            window.location.href = 'login.php';
            return;
        }

        // Store user info in memory only (never persisted)
        window.currentUser = data.user;
        document.getElementById('userGreeting').textContent = `Welcome, ${data.user.name}!`;
    } catch {
        window.location.href = 'login.php';
        return;
    }

    loadUserStats();
    initializeApp();
});

// ---------------------------------------------------------------------------
// Logout → POST /src/api/logout.php
// ---------------------------------------------------------------------------
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to logout?')) return;

    try {
        await fetch('src/api/logout.php', { method: 'POST' });
    } catch { /* best-effort */ }

    localStorage.removeItem('bunsofsteelStats');
    window.location.href = 'login.php';
});

// ---------------------------------------------------------------------------
// App initialisation
// ---------------------------------------------------------------------------
function initializeApp() {
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

// ---------------------------------------------------------------------------
// Tab navigation
// ---------------------------------------------------------------------------
function setupTabNavigation() {
    const tabBtns     = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${name}-tab`).classList.add('active');
            if (name === 'stats') renderCharts();
        });
    });
}

// ---------------------------------------------------------------------------
// Workout rendering
// ---------------------------------------------------------------------------
function renderWorkouts(list = workouts) {
    const carousel = document.getElementById('workoutCarousel');
    const grid     = document.getElementById('workoutsGrid');
    carousel.innerHTML = '';
    grid.innerHTML     = '';

    list.slice(0, 6).forEach(w => carousel.appendChild(createWorkoutCard(w)));
    list.forEach(w => grid.appendChild(createWorkoutCard(w)));
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
                <div class="stat"><i class="fas fa-fire"></i><span>${workout.calories} cal</span></div>
                <div class="stat"><i class="fas fa-clock"></i><span>${workout.duration} min</span></div>
            </div>
            <span class="difficulty-badge ${workout.difficulty}">${workout.difficulty}</span>
        </div>`;
    card.addEventListener('click', () => openWorkoutModal(workout));
    return card;
}

// ---------------------------------------------------------------------------
// Carousel
// ---------------------------------------------------------------------------
function setupCarousel() {
    const carousel = document.getElementById('workoutCarousel');
    document.getElementById('prevBtn').addEventListener('click', () => carousel.scrollBy({ left: -400, behavior: 'smooth' }));
    document.getElementById('nextBtn').addEventListener('click', () => carousel.scrollBy({ left:  400, behavior: 'smooth' }));
}

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------
function setupFilters() {
    const search     = document.getElementById('searchInput');
    const type       = document.getElementById('typeFilter');
    const difficulty = document.getElementById('difficultyFilter');
    const duration   = document.getElementById('durationFilter');

    function apply() {
        let list = workouts;
        const term = search.value.toLowerCase();
        if (term)                  list = list.filter(w => w.name.toLowerCase().includes(term) || w.description.toLowerCase().includes(term));
        if (type.value !== 'all')       list = list.filter(w => w.type === type.value);
        if (difficulty.value !== 'all') list = list.filter(w => w.difficulty === difficulty.value);
        if (duration.value !== 'all')   list = list.filter(w => w.duration <= parseInt(duration.value));
        renderWorkouts(list);
    }

    search.addEventListener('input', apply);
    type.addEventListener('change', apply);
    difficulty.addEventListener('change', apply);
    duration.addEventListener('change', apply);
}

// ---------------------------------------------------------------------------
// Quick start
// ---------------------------------------------------------------------------
function setupQuickStart() {
    document.getElementById('quickStartBtn').addEventListener('click', () => {
        startWorkout(workouts[Math.floor(Math.random() * workouts.length)]);
    });
}

// ---------------------------------------------------------------------------
// Workout detail modal
// ---------------------------------------------------------------------------
function setupModal() {
    const modal   = document.getElementById('workoutModal');
    const closeBtn = document.getElementById('closeModal');
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

function openWorkoutModal(workout) {
    document.getElementById('modalBody').innerHTML = `
        <div class="modal-header">
            <div class="modal-icon"><i class="fas ${workout.icon}"></i></div>
            <h2>${workout.name}</h2>
            <p>${workout.description}</p>
        </div>
        <div class="modal-stats">
            <div class="modal-stat"><i class="fas fa-fire"></i><h4>${workout.calories}</h4><p>Calories</p></div>
            <div class="modal-stat"><i class="fas fa-clock"></i><h4>${workout.duration}</h4><p>Minutes</p></div>
            <div class="modal-stat"><i class="fas fa-signal"></i><h4>${workout.difficulty}</h4><p>Level</p></div>
        </div>
        <div class="modal-action-btns">
            <button class="start-workout-btn" onclick="startWorkout(${JSON.stringify(workout).replace(/"/g, '&quot;')})">
                <i class="fas fa-play"></i> Start Workout
            </button>
            <button class="plan-workout-btn" onclick="openScheduleModal(${JSON.stringify(workout).replace(/"/g, '&quot;')})">
                <i class="fas fa-calendar-plus"></i> Plan Workout
            </button>
        </div>`;
    document.getElementById('workoutModal').classList.add('active');
}

// ---------------------------------------------------------------------------
// Workout timer
// ---------------------------------------------------------------------------
let timerInterval = null, timerSeconds = 0, currentWorkout = null;
let workoutExercises = [], currentExerciseIndex = 0, caloriesPerSecond = 0;

const exercises = {
    cardio:   [
        { name: "Warm-up Jog",     duration: 300, calories: 50 },
        { name: "Jumping Jacks",   duration: 180, calories: 30 },
        { name: "High Knees",      duration: 180, calories: 35 },
        { name: "Burpees",         duration: 240, calories: 40 },
        { name: "Cool Down",       duration: 300, calories: 25 }
    ],
    strength: [
        { name: "Warm-up",  duration: 180, calories: 20 },
        { name: "Push-ups", duration: 240, calories: 40 },
        { name: "Squats",   duration: 240, calories: 35 },
        { name: "Lunges",   duration: 240, calories: 30 },
        { name: "Plank",    duration: 180, calories: 25 },
        { name: "Cool Down",duration: 180, calories: 20 }
    ],
    hiit: [
        { name: "Warm-up",           duration: 180, calories: 25 },
        { name: "Sprint",           duration: 60,  calories: 20 },
        { name: "Rest",             duration: 30,  calories: 5  },
        { name: "Jump Squats",      duration: 60,  calories: 25 },
        { name: "Rest",             duration: 30,  calories: 5  },
        { name: "Mountain Climbers",duration: 60,  calories: 30 },
        { name: "Cool Down",        duration: 180, calories: 20 }
    ],
    yoga: [
        { name: "Breathing",        duration: 180, calories: 15 },
        { name: "Sun Salutations",  duration: 300, calories: 40 },
        { name: "Warrior Poses",    duration: 240, calories: 30 },
        { name: "Balance Poses",    duration: 240, calories: 25 },
        { name: "Cool Down",        duration: 180, calories: 15 }
    ],
    fullbody: [
        { name: "Warm-up",           duration: 180, calories: 25 },
        { name: "Squat to Press",    duration: 180, calories: 35 },
        { name: "Push-up Row",       duration: 180, calories: 30 },
        { name: "Lunge with Twist",  duration: 180, calories: 25 },
        { name: "Burpee",            duration: 180, calories: 40 },
        { name: "Cool Down",         duration: 180, calories: 20 }
    ]
};

const exerciseInstructions = {
    "Warm-up Jog":"Jog in place for 5 minutes. Focus on breathing and getting your heart rate up.",
    "Jumping Jacks":"Stand with feet together, arms at sides. Jump while spreading legs and raising arms. Return to start.",
    "High Knees":"Run in place while bringing knees up to hip level. Keep core engaged.",
    "Burpees":"Squat down, place hands on floor. Kick feet back into plank. Do a push-up. Return to squat and jump up.",
    "Push-ups":"Keep body straight from head to heels. Lower chest to floor, then push back up.",
    "Squats":"Feet shoulder-width apart. Lower hips back and down as if sitting. Keep chest up.",
    "Lunges":"Step forward with one leg. Lower until both knees are at 90 degrees. Return and alternate.",
    "Plank":"Hold push-up position on forearms. Keep body straight. Engage core.",
    "Sprint":"Run as fast as you can for the duration. Focus on speed and power.",
    "Jump Squats":"Perform a regular squat, then explosively jump up. Land softly and immediately go into next squat.",
    "Mountain Climbers":"In plank position, alternate bringing knees to chest quickly.",
    "Sun Salutations":"Flow through a series of yoga poses: mountain, forward fold, plank, cobra, downward dog.",
    "Warrior Poses":"Hold Warrior I, II, and III poses on each side. Focus on balance and strength.",
    "Balance Poses":"Practice tree pose and eagle pose. Focus on stability and breathing.",
    "Squat to Press":"Hold weights at shoulders. Squat down, then stand and press weights overhead.",
    "Push-up Row":"In plank with dumbbells, do a push-up, then row one weight to side. Alternate sides.",
    "Lunge with Twist":"Hold weight at chest. Lunge forward, then twist torso toward front leg.",
    "Breathing":"Focus on deep, controlled breathing. Inhale for 4 counts, exhale for 6 counts.",
    "Rest":"Take this time to recover. Walk slowly and hydrate.",
    "Cool Down":"Walk slowly and stretch major muscle groups. Focus on deep breathing.",
    "Warm-up":"Perform light cardio and dynamic stretches for the duration.",
    "Burpee":"Squat down, place hands on floor. Kick feet back into plank. Do a push-up. Return to squat and jump up."
};

function startWorkout(workout) {
    if (timerInterval) return;
    currentWorkout      = workout;
    caloriesPerSecond   = workout.calories / (workout.duration * 60);
    workoutExercises    = getExercisesForWorkout(workout);
    currentExerciseIndex = 0;
    timerSeconds        = 0;

    setupTimerModal(workout);
    document.getElementById('workoutModal').classList.remove('active');
    document.getElementById('workoutTimerModal').classList.add('active');
}

function getExercisesForWorkout(workout) {
    const base  = exercises[workout.type] || exercises.cardio;
    const total = base.reduce((s, e) => s + e.duration, 0);
    const ratio = (workout.duration * 60) / total;
    return base.map(e => ({ ...e, duration: Math.round(e.duration * ratio) }));
}

function setupTimerModal(workout) {
    document.getElementById('timerWorkoutName').textContent = workout.name;
    document.getElementById('timerWorkoutType').textContent = workout.type.charAt(0).toUpperCase() + workout.type.slice(1);

    document.getElementById('startTimer').onclick   = toggleStartPause;
    document.getElementById('skipExercise').onclick  = skipExercise;
    document.getElementById('completeWorkout').onclick = completeWorkout;
    document.getElementById('closeTimerModal').onclick = () => {
        document.getElementById('workoutTimerModal').classList.remove('active');
        resetTimer();
    };

    updateTimerDisplay();
    updateInstructions();
    updateProgress();
}

function toggleStartPause() {
    if (timerInterval !== null) {
        // --- PAUSE ---
        clearInterval(timerInterval);
        timerInterval = null;
        const btn = document.getElementById('startTimer');
        btn.innerHTML = '<i class="fas fa-play"></i> Resume';
        btn.classList.replace('pause-btn', 'start-btn');
    } else {
        // --- START / RESUME ---
        timerInterval = setInterval(updateTimer, 1000);
        const btn = document.getElementById('startTimer');
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        btn.classList.replace('start-btn', 'pause-btn');
    }
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
    const ex        = workoutExercises[currentExerciseIndex];
    const startTime = workoutExercises.slice(0, currentExerciseIndex).reduce((s, e) => s + e.duration, 0);

    if (timerSeconds >= startTime + ex.duration) {
        if (currentExerciseIndex < workoutExercises.length - 1) {
            currentExerciseIndex++;
            updateInstructions();
            updateProgress();
        } else {
            completeWorkout();
        }
    }
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent         = `${m}:${s}`;
    document.getElementById('caloriesBurned').textContent = Math.round(timerSeconds * caloriesPerSecond);
}

function updateInstructions() {
    const list = document.getElementById('instructionsList');
    list.innerHTML = '';
    workoutExercises.forEach((ex, i) => {
        const div = document.createElement('div');
        div.className = `instruction-step ${i === currentExerciseIndex ? 'active' : ''}`;
        const mins = Math.floor(ex.duration / 60);
        const secs = (ex.duration % 60).toString().padStart(2, '0');
        div.innerHTML = `
            <div class="instruction-number">${i + 1}</div>
            <div class="instruction-text">
                <strong>${ex.name}</strong> – ${mins}:${secs}
                <p>${exerciseInstructions[ex.name] || `Perform ${ex.name}.`}</p>
            </div>`;
        list.appendChild(div);
    });
}

function updateProgress() {
    const ex    = workoutExercises[currentExerciseIndex];
    const total = workoutExercises.reduce((s, e) => s + e.duration, 0);
    const elapsed = workoutExercises.slice(0, currentExerciseIndex).reduce((s, e) => s + e.duration, 0);

    document.getElementById('currentExercise').textContent = currentExerciseIndex + 1;
    document.getElementById('totalExercises').textContent  = workoutExercises.length;
    document.getElementById('exerciseName').textContent    = ex.name;
    document.getElementById('workoutProgress').style.width = `${(elapsed / total) * 100}%`;
}

function completeWorkout() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }

    const cal = Math.round(timerSeconds * caloriesPerSecond);
    const min = Math.floor(timerSeconds / 60);

    userStats.totalCalories  += cal;
    userStats.totalTime      += min;
    userStats.totalWorkouts  += 1;

    const today     = new Date().toDateString();
    if (userStats.lastWorkoutDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        userStats.currentStreak = (userStats.lastWorkoutDate === yesterday.toDateString())
            ? userStats.currentStreak + 1 : 1;
        userStats.lastWorkoutDate = today;
    }

    userStats.workoutHistory.push({
        workout: currentWorkout, date: new Date().toISOString(),
        completed: true, duration: min, calories: cal
    });

    checkAchievements();
    saveUserStats();
    updateStatsDisplay();
    renderCharts();

    document.getElementById('workoutTimerModal').classList.remove('active');
    alert(`🎉 Workout Complete!\n\n${currentWorkout.name}\nCalories: ${cal}`);
    resetTimer();
}

function resetTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    timerSeconds = 0; currentWorkout = null;
    workoutExercises = []; currentExerciseIndex = 0; caloriesPerSecond = 0;
}

function setupTimerModalHandlers() {
    const modal = document.getElementById('workoutTimerModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { modal.classList.remove('active'); resetTimer(); }
    });
}
// ---------------------------------------------------------------------------
// Calendar & planned workouts
// ---------------------------------------------------------------------------
let _activeCalendarDate = null;   // dateStr of whichever calendar day is selected

function setupCalendar() {
    const el    = document.getElementById('weeklyCalendar');
    const today = new Date();
    el.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const date    = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toDateString();
        const planned = userStats.plannedWorkouts[dateStr];
        const count   = planned ? planned.length : 0;

        const day = document.createElement('div');
        day.className = 'calendar-day' + (count ? ' has-workout' : '') + (i === 0 ? ' active' : '');
        day.innerHTML = `
            <div class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div class="day-number">${date.getDate()}</div>
            ${count ? `<div class="workout-count">${count} workout${count > 1 ? 's' : ''}</div>` : ''}`;
        day.addEventListener('click', () => {
            el.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            _activeCalendarDate = dateStr;
            updateSelectedDateLabel(dateStr);
            showPlannedWorkouts(dateStr);
        });
        el.appendChild(day);
    }

    // default selection: today
    if (!_activeCalendarDate) {
        _activeCalendarDate = today.toDateString();
        updateSelectedDateLabel(_activeCalendarDate);
        showPlannedWorkouts(_activeCalendarDate);
    }
}

function updateSelectedDateLabel(dateStr) {
    const d = new Date(dateStr);
    document.getElementById('selectedDateText').textContent =
        d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function showPlannedWorkouts(dateStr) {
    const el      = document.getElementById('plannedWorkoutsList');
    const planned = userStats.plannedWorkouts[dateStr];

    if (!planned || !planned.length) {
        el.innerHTML = `<p class="empty-state">No workouts scheduled for this day.</p>
            <button class="schedule-empty-btn" onclick="openScheduleModalForDate('${dateStr}')">
                <i class="fas fa-plus-circle"></i> Add a Workout
            </button>`;
        return;
    }

    el.innerHTML = planned.map((item, idx) => {
        const w = workouts.find(x => x.id === item.workoutId);
        if (!w) return '';
        return `<div class="planned-workout-card">
            <div class="planned-card-header ${w.type}"><i class="fas ${w.icon}"></i></div>
            <div class="planned-card-body">
                <h3>${w.name}</h3>
                <p class="planned-meta">
                    <span><i class="fas fa-clock"></i> ${item.time || '–'}</span>
                    ${item.notes ? `<span><i class="fas fa-sticky-note"></i> ${item.notes}</span>` : ''}
                </p>
                <div class="planned-card-actions">
                    <button class="planned-action-btn start" onclick="startWorkout(${JSON.stringify(w).replace(/"/g, '&quot;')})">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="planned-action-btn remove" onclick="removePlannedWorkout('${dateStr}', ${idx})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    // always render an "add another" button below the list
    el.innerHTML += `<button class="schedule-empty-btn" onclick="openScheduleModalForDate('${dateStr}')">
        <i class="fas fa-plus-circle"></i> Add Another Workout
    </button>`;
}
// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
function setupCategories() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelector('[data-tab="home"]').click();
            document.getElementById('typeFilter').value = card.dataset.category;
            document.getElementById('typeFilter').dispatchEvent(new Event('change'));
        });
    });
}

// ---------------------------------------------------------------------------
// Stats display
// ---------------------------------------------------------------------------
function updateStatsDisplay() {
    document.getElementById('totalCalories').textContent  = userStats.totalCalories.toLocaleString();
    document.getElementById('totalTime').textContent      = userStats.totalTime.toLocaleString();
    document.getElementById('totalWorkouts').textContent  = userStats.totalWorkouts;
    document.getElementById('currentStreak').textContent  = userStats.currentStreak;
}

// ---------------------------------------------------------------------------
// Charts
// ---------------------------------------------------------------------------
let weeklyChart = null, distributionChart = null;

function renderCharts() { renderWeeklyChart(); renderDistributionChart(); }

function renderWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    const labels = [], data = [], today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        data.push(
            userStats.workoutHistory
                .filter(h => new Date(h.date).toDateString() === d.toDateString())
                .reduce((s, h) => s + h.workout.calories, 0)
        );
    }

    if (weeklyChart) weeklyChart.destroy();
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Calories Burned', data, borderColor: '#4ecdc4', backgroundColor: 'rgba(78,205,196,0.1)', tension: 0.4, fill: true }] },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { labels: { color: '#ffffff' } } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#b8b8d1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: '#b8b8d1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

function renderDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;

    const counts = { cardio: 0, strength: 0, hiit: 0, yoga: 0, fullbody: 0 };
    userStats.workoutHistory.forEach(h => { counts[h.workout.type]++; });

    if (distributionChart) distributionChart.destroy();
    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cardio','Strength','HIIT','Yoga','Full Body'],
            datasets: [{ data: [counts.cardio, counts.strength, counts.hiit, counts.yoga, counts.fullbody],
                backgroundColor: ['#4facfe','#f5576c','#fee140','#38f9d7','#764ba2'] }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: '#ffffff' } } } }
    });
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
function checkAchievements() {
    const checks = [
        () => userStats.totalWorkouts >= 1,
        () => userStats.currentStreak >= 7,
        () => userStats.totalCalories >= 1000,
        () => userStats.totalTime >= 100,
        () => new Set(userStats.workoutHistory.map(h => h.workout.type)).size >= 5,
        () => userStats.currentStreak >= 30
    ];
    checks.forEach((check, i) => {
        if (check() && !achievements[i].unlocked) {
            achievements[i].unlocked = true;
            alert(`🏆 Achievement Unlocked!\n\n${achievements[i].name}\n${achievements[i].description}`);
        }
    });
    renderAchievements();
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = achievements.map(a => `
        <div class="achievement-badge ${a.unlocked ? 'unlocked' : ''}">
            <i class="fas ${a.icon}"></i>
            <h4>${a.name}</h4>
            <p>${a.description}</p>
        </div>`).join('');
}

// ---------------------------------------------------------------------------
// Profile & Settings placeholders
// ---------------------------------------------------------------------------
document.getElementById('profileBtn').addEventListener('click', () => alert('Profile feature coming soon!'));

document.getElementById('settingsBtn').addEventListener('click', () => {
    if (!confirm('Settings\n\nWould you like to reset all your progress?')) return;
    localStorage.removeItem('bunsofsteelStats');
    userStats = { totalCalories:0, totalTime:0, totalWorkouts:0, currentStreak:0, lastWorkoutDate:null, workoutHistory:[], plannedWorkouts:{} };
    achievements.forEach(a => a.unlocked = false);
    updateStatsDisplay();
    renderCharts();
    renderAchievements();
    alert('All progress has been reset!');
});

// ---------------------------------------------------------------------------
// BMI Calculator
// ---------------------------------------------------------------------------
document.getElementById('calculateBMI').addEventListener('click', calculateBMI);

function calculateBMI() {
    const height = parseFloat(document.getElementById('heightInput').value);
    const weight = parseFloat(document.getElementById('weightInput').value);
    if (!height || !weight || height <= 0 || weight <= 0) { alert('Please enter valid height and weight values'); return; }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    document.getElementById('bmiResult').style.display = 'block';
    document.getElementById('bmiNumber').textContent   = bmi;

    let category, description, badgeClass, indicatorPos, workoutIds, showMealPlan;

    if (bmi < 18.5) {
        category = 'Underweight'; description = 'Focus on strength training and increase caloric intake';
        badgeClass = 'underweight'; indicatorPos = (bmi / 18.5) * 25;
        workoutIds = []; showMealPlan = true;
    } else if (bmi < 25) {
        category = 'Normal Weight'; description = 'You are within the healthy weight range. Maintain your fitness!';
        badgeClass = 'normal'; indicatorPos = 25 + ((bmi - 18.5) / 6.5) * 25;
        workoutIds = [2,3,5,7,8,9,10,12]; showMealPlan = false;
    } else {
        category = 'Overweight'; description = 'Focus on cardio and low-impact exercises to start';
        badgeClass = 'overweight'; indicatorPos = Math.min(50 + ((bmi - 25) / 10) * 50, 100);
        workoutIds = [1,4,6,11]; showMealPlan = false;
    }

    const badge = document.getElementById('categoryBadge');
    badge.textContent = category;
    badge.className   = `category-badge ${badgeClass}`;
    document.getElementById('categoryDescription').textContent = description;
    document.getElementById('bmiIndicator').style.left = `${indicatorPos}%`;

    document.getElementById('mealPlanSection').style.display      = showMealPlan ? 'block' : 'none';
    document.getElementById('recommendedWorkouts').style.display  = showMealPlan ? 'none'  : 'block';
    if (!showMealPlan) displayRecommendedWorkouts(workoutIds);

    document.getElementById('bmiResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayRecommendedWorkouts(ids) {
    const grid = document.getElementById('recommendedGrid');
    grid.innerHTML = '';
    ids.forEach(id => {
        const w = workouts.find(x => x.id === id);
        if (!w) return;
        const card = document.createElement('div');
        card.className = 'workout-card-mini';
        card.innerHTML = `
            <div class="workout-card-header ${w.type}"><i class="fas ${w.icon}"></i></div>
            <div class="workout-card-body">
                <h4>${w.name}</h4>
                <div class="workout-stats">
                    <span><i class="fas fa-fire"></i> ${w.calories} cal</span>
                    <span><i class="fas fa-clock"></i> ${w.duration} min</span>
                </div>
                <span class="difficulty-badge ${w.difficulty}">${w.difficulty}</span>
            </div>`;
        card.addEventListener('click', () => openWorkoutModal(w));
        grid.appendChild(card);
    });
}

// ---------------------------------------------------------------------------
// Schedule / Plan Workout system
// ---------------------------------------------------------------------------
let _scheduleWorkout = null;   // workout object being scheduled
let _selectedDateStr = null;   // currently picked date in the day-picker

function openScheduleModal(workout) {
    _scheduleWorkout = workout;
    _selectedDateStr = _activeCalendarDate;
    document.getElementById('scheduleWorkoutName').textContent = workout.name;
    document.getElementById('scheduleNotes').value = '';
    document.getElementById('scheduleTime').value  = '08:00';
    renderDayPicker();
    document.getElementById('workoutModal').classList.remove('active');
    document.getElementById('scheduleModal').classList.add('active');
}

function openScheduleModalForDate(dateStr) {
    // opens modal pre-selecting a date (called from the empty-state Add button)
    _scheduleWorkout = null;
    _selectedDateStr = dateStr;
    document.getElementById('scheduleWorkoutName').textContent = 'Choose a workout below';
    document.getElementById('scheduleNotes').value = '';
    document.getElementById('scheduleTime').value  = '08:00';
    renderDayPicker();
    renderWorkoutPicker();
    document.getElementById('scheduleModal').classList.add('active');
}

function renderDayPicker() {
    const container = document.getElementById('dayPicker');
    container.innerHTML = '';
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const ds = d.toDateString();
        const btn = document.createElement('button');
        btn.className = 'day-pick-btn' + (ds === _selectedDateStr ? ' selected' : '');
        btn.innerHTML = `<span class="dp-name">${d.toLocaleDateString('en-US',{weekday:'short'})}</span>
                         <span class="dp-num">${d.getDate()}</span>`;
        btn.onclick = () => {
            _selectedDateStr = ds;
            container.querySelectorAll('.day-pick-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
        container.appendChild(btn);
    }
}

function renderWorkoutPicker() {
    // Only shown when opened from empty-state (no workout pre-selected)
    const form = document.querySelector('.schedule-form');
    if (document.getElementById('workoutPicker')) return; // already rendered
    const select = document.createElement('div');
    select.className = 'schedule-form-group';
    select.id = 'workoutPickerWrap';
    select.innerHTML = `<label>Workout</label>
        <select id="workoutPicker" class="schedule-select">
            <option value="">– Pick a workout –</option>
            ${workouts.map(w => `<option value="${w.id}">${w.name} (${w.type} · ${w.duration}min)</option>`).join('')}
        </select>`;
    form.insertBefore(select, form.querySelector('.schedule-form-row'));
}

document.getElementById('closeScheduleModal').addEventListener('click', () => {
    document.getElementById('scheduleModal').classList.remove('active');
    removeWorkoutPicker();
});
document.getElementById('scheduleModal').addEventListener('click', function(e) {
    if (e.target === this) { this.classList.remove('active'); removeWorkoutPicker(); }
});

function removeWorkoutPicker() {
    const w = document.getElementById('workoutPickerWrap');
    if (w) w.remove();
}

document.getElementById('confirmSchedule').addEventListener('click', () => {
    if (!_selectedDateStr) { alert('Please pick a day.'); return; }

    let workout = _scheduleWorkout;
    // If opened from empty-state, grab from picker
    if (!workout) {
        const picker = document.getElementById('workoutPicker');
        if (!picker || !picker.value) { alert('Please select a workout.'); return; }
        workout = workouts.find(w => w.id === parseInt(picker.value));
    }
    if (!workout) { alert('Workout not found.'); return; }

    const time  = document.getElementById('scheduleTime').value;
    const notes = document.getElementById('scheduleNotes').value.trim();

    if (!userStats.plannedWorkouts[_selectedDateStr]) {
        userStats.plannedWorkouts[_selectedDateStr] = [];
    }
    userStats.plannedWorkouts[_selectedDateStr].push({
        workoutId: workout.id, time, notes
    });

    saveUserStats();
    setupCalendar();                      // refresh calendar dots
    showPlannedWorkouts(_selectedDateStr); // refresh the list if visible

    document.getElementById('scheduleModal').classList.remove('active');
    removeWorkoutPicker();
    alert(`✅ "${workout.name}" scheduled for ${_selectedDateStr} at ${time}!`);
});

function removePlannedWorkout(dateStr, index) {
    if (!userStats.plannedWorkouts[dateStr]) return;
    userStats.plannedWorkouts[dateStr].splice(index, 1);
    if (userStats.plannedWorkouts[dateStr].length === 0) {
        delete userStats.plannedWorkouts[dateStr];
    }
    saveUserStats();
    setupCalendar();
    showPlannedWorkouts(dateStr);
}

// ---------------------------------------------------------------------------
// Header "Add Workout" button – opens schedule modal for the currently
// selected calendar day (or today if none selected yet)
// ---------------------------------------------------------------------------
document.getElementById('addWorkoutHeaderBtn').addEventListener('click', () => {
    const dateStr = _activeCalendarDate || new Date().toDateString();
    openScheduleModalForDate(dateStr);
});
