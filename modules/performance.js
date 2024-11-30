const fpsLabel = document.getElementById("fpsLabel");

// Performance monitoring configuration
const config = {
    fpsBufferSize: 60,         // Number of frames to average
    targetFPS: 60,             // Target frame rate
    lagThreshold: 1000/30,     // Consider frames taking longer than 33.33ms (30 FPS) as lag
    updateInterval: 500,       // Update display every 500ms
    warningThreshold: 45       // FPS below this will trigger warning
};

// Performance tracking state
const state = {
    frameTimeBuffer: [],       // Buffer to store frame times
    lastFrameTime: performance.now(),
    lastUpdateTime: performance.now(),
    lagFrames: 0,
    totalFrames: 0,
    currentFPS: 0
};

// Calculate average FPS from the frame time buffer
function calculateAverageFPS() {
    if (state.frameTimeBuffer.length === 0) return 0;
    const averageFrameTime = state.frameTimeBuffer.reduce((a, b) => a + b) / state.frameTimeBuffer.length;
    return 1000 / averageFrameTime;
}

// Update the performance display
function updateDisplay() {
    const currentTime = performance.now();
    if (currentTime - state.lastUpdateTime < config.updateInterval) return;

    const fps = Math.round(state.currentFPS);
    const lagPercentage = (state.lagFrames / state.totalFrames * 100) || 0;
    
    let status = '🟢'; // Default green status
    if (fps < config.warningThreshold) {
        status = fps < 30 ? '🔴' : '🟡';
    }

    fpsLabel.textContent = `${status} FPS: ${fps} | Lag: ${lagPercentage.toFixed(1)}%`;
    
    // Reset lag counters periodically
    if (state.totalFrames > 1000) {
        state.lagFrames = 0;
        state.totalFrames = 0;
    }

    state.lastUpdateTime = currentTime;
}

// Main performance monitoring function
function monitorPerformance(timestamp) {
    const frameTime = timestamp - state.lastFrameTime;
    state.lastFrameTime = timestamp;

    // Update frame time buffer
    state.frameTimeBuffer.push(frameTime);
    if (state.frameTimeBuffer.length > config.fpsBufferSize) {
        state.frameTimeBuffer.shift();
    }

    // Update FPS
    state.currentFPS = calculateAverageFPS();

    // Track lag
    state.totalFrames++;
    if (frameTime > config.lagThreshold) {
        state.lagFrames++;
    }

    // Update the display
    updateDisplay();

    // Continue monitoring
    requestAnimationFrame(monitorPerformance);
}

// Initialize performance monitoring
function initPerformanceMonitoring() {
    // Reset state
    state.frameTimeBuffer = [];
    state.lastFrameTime = performance.now();
    state.lastUpdateTime = performance.now();
    state.lagFrames = 0;
    state.totalFrames = 0;
    state.currentFPS = 0;

    // Start monitoring
    requestAnimationFrame(monitorPerformance);
}

// Start monitoring when the page loads
document.addEventListener("DOMContentLoaded", initPerformanceMonitoring);
