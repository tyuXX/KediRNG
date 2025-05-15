import {
  loadLocalSave,
  newSave,
  loadStringSave
} from "https://tyuxx.github.io/tyuLIB/lib/ddcGame/gameSave.js";

const gVersion = 13;
const saveID = "KediRNG";

// Function to get game data
function getGameData() {
  lastSave = Date.now();
  return {
    version: gVersion, // added version property
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
  localStorage.removeItem("autosave"); // Clear storage
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
globalThis.resetGame = resetGame;