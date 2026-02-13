document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const millisecondsEl = document.getElementById('milliseconds');
    const startStopBtn = document.getElementById('startStopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');

    // State Variables
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapCounter = 1;

    // Helper: Format time
    function formatTime(time) {
        const diff = new Date(time);

        // Calculate minutes, seconds, milliseconds
        // Since `time` is just duration in ms, we can calculate manually for > 1 hour scenarios if we wanted,
        // but for a simple stopwatch, minutes/seconds/ms is fine.

        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time % 60000) / 1000);
        let milliseconds = Math.floor((time % 1000) / 10); // Display only first 2 digits of ms

        // 60 minutes wraps (simplified) - usually stopwatch goes to hours but let's stick to simple display first
        // If users need hours, we can add it, but 99 mins is usually enough for basic tracking

        return {
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }

    // Helper: Update Display
    function updateDisplay() {
        // Calculate current elapsed time
        const now = Date.now();
        const time = isRunning ? (now - startTime + elapsedTime) : elapsedTime;

        const formatted = formatTime(time);

        minutesEl.textContent = formatted.minutes;
        secondsEl.textContent = formatted.seconds;
        millisecondsEl.textContent = formatted.milliseconds;
    }

    // Start / Stop Timer
    function toggleTimer() {
        if (!isRunning) {
            // Start
            isRunning = true;
            startTime = Date.now();
            timerInterval = setInterval(updateDisplay, 10); // Update every 10ms

            // UI Updates
            startStopBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            startStopBtn.classList.remove('btn-primary');
            startStopBtn.style.backgroundColor = '#f59e0b'; // Amber for pause
            startStopBtn.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';

            resetBtn.disabled = false;
            lapBtn.disabled = false;
        } else {
            // Stop (Pause)
            isRunning = false;
            elapsedTime += Date.now() - startTime;
            clearInterval(timerInterval);

            // UI Updates
            startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            startStopBtn.classList.add('btn-primary');
            startStopBtn.style.backgroundColor = ''; // Revert to CSS default
            startStopBtn.style.boxShadow = '';
        }
    }

    // Reset Timer
    function resetTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        startTime = 0;
        elapsedTime = 0;
        lapCounter = 1;

        // Reset Display
        updateDisplay();

        // Reset UI
        startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        startStopBtn.classList.add('btn-primary');
        startStopBtn.style.backgroundColor = '';
        startStopBtn.style.boxShadow = '';

        resetBtn.disabled = true;
        lapBtn.disabled = true;

        // Clear Laps
        lapsList.innerHTML = '';
    }

    // Record Lap
    function recordLap() {
        if (!isRunning && elapsedTime === 0) return;

        const currentTotalTime = isRunning ? (Date.now() - startTime + elapsedTime) : elapsedTime;
        const formatted = formatTime(currentTotalTime);
        const timeString = `${formatted.minutes}:${formatted.seconds}.${formatted.milliseconds}`;

        const li = document.createElement('li');
        li.innerHTML = `
            <span class="lap-number">Lap ${lapCounter}</span>
            <span class="lap-time">${timeString}</span>
        `;

        // Add to top of list
        lapsList.prepend(li);
        lapCounter++;
    }

    // Event Listeners
    startStopBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);

});
