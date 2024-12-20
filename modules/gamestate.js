const gVersion = 12;
var UUID =
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

// Function to get game data
function getGameData() {
  lastSave = Date.now();
  return {
    version: gVersion,
    money: money,
    inventory: inventory,
    boughtUpgrades: boughtUpgrades,
    raritiesDone: raritiesDone,
    quests: quests,
    level: level,
    lastSave: lastSave,
    upgradeValues: upgradeValues,
    stats: stats,
    UUID: UUID,
    doneAchivements: doneAchivements,
    setSettings: setSettings,
    rebirth: rebirth,
    updateVersion: versionString,
    combinationsDone: combinationsDone,
    // Add any new properties here
  };
}

// Function to set game data
function setGameData(gameData) {
  // Check the version of the save file
  if (gameData.version !== gVersion) {
    notify(
      "Old version detected (v" + gameData.version + "), proceeding anyway...",
      "wheat"
    );
  }

  money = gameData.money || 0;
  inventory = gameData.inventory || defInventory;
  boughtUpgrades = gameData.boughtUpgrades || [];
  raritiesDone = gameData.raritiesDone || defRaritiesDone;
  quests = gameData.quests || [];
  level = gameData.level || defLevel;
  lastSave = gameData.lastSave || Date.now();
  upgradeValues = gameData.upgradeValues || defUpgradeValues;
  stats = gameData.stats || defStats;
  stats.forEach((stat) => {
    let st = defStats.find((s) => s.id === stat.id);
    if (st) {
      if (stat.name !== st.name) {
        stat.name = st.name;
        stat.show = st.show;
      }
    }
  });
  UUID =
    gameData.UUID ||
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  doneAchivements = gameData.doneAchivements || [];
  setSettings = gameData.setSettings || {};
  initSettings();
  rebirth = gameData.rebirth || 1;
  combinationsDone = gameData.combinationsDone || [];
  // Load other properties here as needed
  
  // Migrate game data
  migrate(gameData.versionString, gameData.version);

  if (inventory.length < 10000) {
    displayInventory(); // Update UI
  } else {
    invDiv.style.display = "none";
    notify("Inventory hidden to reduce lag, Press Toggle to show it", "wheat");
  }
  displayUpgrades(); // Update UI
  displayQuests(); // Update UI
  displayAchivements(); // Update UI
  displaySettings(); // Update UI
}

// Function to save game data to file
function saveGame() {
  const compressed = LZString.compressToUTF16(JSON.stringify(getGameData())); // Compress the JSON string
  const blob = new Blob([compressed], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = UUID + "(v" + gVersion + ").gsdsv";
  link.click();
}

// Function to save game data to localStorage (for autosave)
async function saveGameToLocalStorage() {
  notify("Saving game...");
  const compressed = LZString.compressToUTF16(JSON.stringify(getGameData()));
  localStorage.setItem("autosave", compressed); // Save to localStorage
  notify("Game saved successfully!", "green");
}

// Function to load game data from a compressed string
function loadGameData(compressedData, notifySuccess = true) {
  try {
    const json = LZString.decompressFromUTF16(compressedData);
    if (json) {
      const gameData = JSON.parse(json);
      setGameData(gameData);
      if (notifySuccess) notify("Game loaded successfully!", "green");
    } else {
      notify("Error loading game data: data is corrupted or invalid", "red");
    }
  } catch (error) {
    notify("Error loading game data: " + error, "red");
  }
}

// Function to load game data from localStorage (for autosave)
function loadGameFromLocalStorage() {
  const compressedData = localStorage.getItem("autosave");
  if (compressedData) {
    loadGameData(compressedData, false); // Load without success notification
  }
}

// Function to load game data from a file input
function loadGame(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    loadGameData(e.target.result); // Load with success notification
  };
  reader.readAsText(file);
}

function resetGame() {
  localStorage.removeItem("autosave"); // Clear storage
  window.location.reload(); // Reload the page
}

loadGameFromLocalStorage(); // Load game from localStorage on page load
setInterval(saveGameToLocalStorage, 30000); // Start autosaving every 30 seconds

// Adding event listener to load input
document.getElementById("load-input").addEventListener("change", loadGame);
document.getElementById("saveButton").textContent += " (v" + gVersion + ")";
