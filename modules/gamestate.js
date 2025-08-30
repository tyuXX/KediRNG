import {
  loadLocalSave,
  newSave,
  loadStringSave
} from "gameSave";

const gVersion = 15; // Bump version for Decimal support

// Function to convert Decimal values to plain objects for saving
function convertToSaveFormat(data) {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => convertToSaveFormat(item));
  }

  // Handle Decimal objects
  if (typeof Decimal !== 'undefined' && data instanceof Decimal) {
    return { __decimal__: true, value: data.toString() };
  }

  // Handle regular objects
  const result = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      result[key] = convertToSaveFormat(data[key]);
    }
  }
  return result;
}

// Function to restore Decimal values from saved data
function restoreFromSaveFormat(data) {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle Decimal restoration
  if (data.__decimal__ === true && data.value) {
    return new Decimal(data.value);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => restoreFromSaveFormat(item));
  }

  // Handle regular objects
  const result = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      result[key] = restoreFromSaveFormat(data[key]);
    }
  }
  return result;
}

const saveID = "KediRNG";

// Function to get game data
function getGameData() {
  lastSave = Date.now();
  const gameData = {
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
    doneAchivements: doneAchivements,
    setSettings: setSettings,
    rebirth: rebirth,
    updateVersion: versionString,
    combinationsDone: combinationsDone,
  };
  
  // Convert Decimal values to save format
  return convertToSaveFormat(gameData);
}

// Function to set game data
function setGameData(gameData) {
  // Check the version of the save file
  if (gameData.version !== gVersion) {
    notify(
      "Old version detected (v" + gameData.version + "), attempting migration...",
      "wheat"
    );
    // Migrate old save format if needed
    migrate(gameData.version, gVersion);
  }

  // Restore Decimal values from save format
  const restoredData = restoreFromSaveFormat(gameData);

  // Helper function to safely convert to Decimal
  const safeToDecimal = (value, defaultValue = 0) => {
    try {
      return value instanceof Decimal ? value : new Decimal(value || defaultValue);
    } catch (e) {
      console.warn('Error converting value to Decimal, using default:', value, e);
      return new Decimal(defaultValue);
    }
  };

  money = safeToDecimal(restoredData.money, 0);
  inventory = restoredData.inventory || defInventory;
  boughtUpgrades = restoredData.boughtUpgrades || [];
  raritiesDone = restoredData.raritiesDone || defRaritiesDone;
  quests = restoredData.quests || [];
  
  // Ensure level is properly initialized with Decimal values
  level = restoredData.level || defLevel;
  if (level) {
    level.level = safeToDecimal(level.level, 1);
    level.xp = safeToDecimal(level.xp, 0);
  }
  
  lastSave = restoredData.lastSave || Date.now();
  upgradeValues = restoredData.upgradeValues || defUpgradeValues;
  
  // Initialize stats with proper Decimal values
  stats = (restoredData.stats || defStats).map(stat => {
    const defaultStat = defStats.find(s => s.id === stat.id) || {};
    const newStat = { ...defaultStat, ...stat };
    
    // Convert numeric values to Decimal if they should be numbers
    if (defaultStat.value instanceof Decimal || stat.value instanceof Decimal) {
      newStat.value = safeToDecimal(stat.value, defaultStat.value || 0);
    }
    if (defaultStat.highest instanceof Decimal || stat.highest instanceof Decimal) {
      newStat.highest = safeToDecimal(stat.highest, stat.value || defaultStat.highest || 0);
    }
    
    return newStat;
  });
  
  doneAchivements = gameData.doneAchivements || [];
  setSettings = gameData.setSettings || {};
  initSettings();
  
  // Ensure rebirth is a Decimal
  rebirth = safeToDecimal(restoredData.rebirth, 1);
  
  combinationsDone = gameData.combinationsDone || [];

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
  // Create a DDCSave instance using the library and trigger download
  const saveInstance = newSave(getGameData(), gVersion, saveID);
  const saveString = saveInstance.ToString();
  const blob = new Blob([saveString], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = saveID + "(v" + gVersion + ").gsdsv";
  link.click();
}

// Function to save game data to localStorage (for autosave)
async function saveGameToLocalStorage() {
  notify("Saving game...");
  // Use library function to save to localStorage
  const saveInstance = newSave(getGameData(), gVersion, saveID);
  saveInstance.saveToLocal();
  notify("Game saved successfully!", "green");
}

// Function to load game data from a compressed string
function loadGameData(compressedData, notifySuccess = true) {
  try {
    // Use the library's loadStringSave to verify integrity and parse the save
    const saveInstance = loadStringSave(compressedData);
    if (!saveInstance) {
      throw new Error("Integrity check failed");
    }
    setGameData(saveInstance.data);
    if (notifySuccess) notify("Game loaded successfully!", "green");
  } catch (error) {
    notify("Error loading game data: " + error, "red");
    console.error("Error loading game data:", error);
  }
}

// Function to load game data from localStorage (for autosave)
function loadGameFromLocalStorage() {
  // Use the library function to load the save using saveID as saveID
  const saveInstance = loadLocalSave(saveID);
  if (saveInstance) {
    setGameData(saveInstance.data);
  } else {
    notify("No valid autosave found", "red");
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
  localStorage.removeItem("DDCSave-" + saveID); // Clear storage
  window.location.reload(); // Reload the page
}

loadGameFromLocalStorage(); // Load game from localStorage on page load
setInterval(saveGameToLocalStorage, 30000); // Start autosaving every 30 seconds

// Adding event listener to load input
document.getElementById("load-input").addEventListener("change", loadGame);
document.getElementById("saveButton").textContent += " (v" + gVersion + ")";

globalThis.loadGame = loadGame;
globalThis.saveGame = saveGame;
globalThis.saveGameToLocalStorage = saveGameToLocalStorage;
globalThis.loadGameFromLocalStorage = loadGameFromLocalStorage;
document.getElementById("resetButton").addEventListener("click", resetGame);