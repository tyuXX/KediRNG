import { PerformanceRecorder } from "performance";

const fpsLabel = document.getElementById("fpsLabel");
const recorder = PerformanceRecorder.startNewRecorder(60, "GamePerformance");

setInterval(() => {
  recorder.restart();
}, 50000);

setInterval(() => {
  fpsLabel.textContent = recorder.generateRecord().getReportString();
}, 1000);