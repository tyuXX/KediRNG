const fpsLabel = document.getElementById("fpsLabel");

// Variables to track lag
let lastFrameTime = performance.now();
let lagThreshold = 50; // milliseconds (20 fps)
let lagFrames = 0;
let totalFrames = 0;

// Function to track lag
function trackLag() {
    // Reset frames every 1000 samples
  if (totalFrames % 1000 === 0) {
    lagFrames = 0;
    totalFrames = 0;
  }

  // Calculate the time since the last frame
  const currentTime = performance.now();
  const frameDuration = currentTime - lastFrameTime;

  // Update for next frame
  totalFrames++;
  lastFrameTime = currentTime;

  const lagPercentage = (lagFrames / totalFrames) * 100;

  // Update the TPS label
  const fps = 1000 / frameDuration;
  fpsLabel.textContent = `FPS: ${fps.toFixed(0)} Lag: ${lagPercentage.toFixed(2)}%`;

  // Call this function again on the next frame
  requestAnimationFrame(trackLag);
}

// Start lag tracking when the game starts
document.addEventListener("DOMContentLoaded", () => {
  trackLag();
});
