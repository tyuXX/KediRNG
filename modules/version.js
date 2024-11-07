// Load version info and display it in your game
async function loadVersionInfo() {
  try {
    const response = await fetch('version.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch version info: ${response.statusText}`);
    }
    const versionData = await response.json();

    // Display version information on the game UI
    const versionInfoContainer = document.getElementById('versionInfo');
    versionInfoContainer.innerHTML = `
      <a href="${versionData.githubLink}" target="_blank">${versionData.commitHash}</a>
    `;
  } catch (error) {
    console.error('Error loading version info:', error);
  }
}

// Call loadVersionInfo when the game loads
window.addEventListener('load', loadVersionInfo);
