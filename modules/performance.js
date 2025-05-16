import { PerformanceRecorder } from "https://tyuxx.github.io/tyuLIB/lib/ddcLIB/ddcPerformance.js";

const fpsLabel = document.getElementById("fpsLabel");
const recorder = PerformanceRecorder.startNewRecorder(60, "GamePerformance");

setInterval(() => {
  const record = recorder.restart(); // capture current performance recor
  fpsLabel.textContent = record.getReportString();
}, 2000);
