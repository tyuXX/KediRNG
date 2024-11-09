// Load version info and display it in your game
async function loadVersionInfo() {
  try {
    const response = await fetch('version.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch version info: ${response.statusText}`);
    }
    const versionData = await response.json();

    const response2 = await fetch('version.json');
    if (!response2.ok) {
      throw new Error(`Failed to fetch version info: ${response2.statusText}`);
    }
    const versionData2 = await response2();

    // Display version information on the game UI
    const versionInfoContainer = document.getElementById('versionInfo');
    versionInfoContainer.innerHTML = `
      <a href="https://github.com/tyuXX/KediRNG/commit/${versionData.commitHash}" target="_blank">${versionData.commitHash}</a>
      <label id="versionLabel" for="version">Version: ${versionData}</label>
    `;
  } catch (error) {
    console.error('Error loading version info:', error);
  }
}

// Call loadVersionInfo when the game loads
window.addEventListener('load', loadVersionInfo);
