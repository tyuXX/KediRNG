const versionInfoContainer = document.getElementById("versionInfo");
var versionString;

// Load version info and display it in your game
async function loadVersionInfo() {
  try {
    // Fetch from the 'versioning' branch with refs/heads
    const response = await fetch(
      "https://raw.githubusercontent.com/tyuXX/KediRNG/refs/heads/versioning/version.json?v=" +
        new Date().getTime()
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch version info: ${response.statusText}`);
    }
    const versionData = await response.json();

    const response2 = await fetch(
      "https://raw.githubusercontent.com/tyuXX/KediRNG/refs/heads/versioning/version.v?v=" +
        new Date().getTime()
    );
    if (!response2.ok) {
      throw new Error(`Failed to fetch version info: ${response2.statusText}`);
    }
    const versionData2 = await response2.text();
    versionString = versionData2.trim();

    // Display version information on the game UI
    versionInfoContainer.innerHTML = `
      <a href="https://github.com/tyuXX/KediRNG/commit/${versionData.commitHash}" target="_blank">${versionData.commitHash}</a>
      <label id="versionLabel" for="version">Version: ${versionData2}</label>
    `;
  } catch (error) {
    console.error("Error loading version info:", error);
  }
}

async function versionCheckloop() {
  while (true) {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/tyuXX/KediRNG/refs/heads/versioning/version.v?v=" +
          new Date().getTime()
      );
      if (versionString !== (await response.text()).trim()) {
        versionInfoContainer.innerHTML = "New version ready! Refresh to apply.";
      }
    }
    catch (error) {
      notify("Error checking for updates: " + error, "red");
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
}

// Call loadVersionInfo when the game loads
loadVersionInfo();
versionCheckloop();
