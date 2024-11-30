const settingsDiv = document.getElementById("settingsContainer");
const settings = [
  {
    name: "Auto Roll",
    id: "autoRoll",
    description: "Enables auto roll",
    defaultValue: true,
    onchange: () =>{}
  },
  {
    name: "Immediate Sell",
    id: "iSell",
    description: "Sells Texts immediately",
    defaultValue: false,
    onchange: () =>{}
  },
  {
    name: "Toggle Shop",
    id: "toggleShop",
    description: "Toggles Shop",
    defaultValue: true,
    onchange: () =>{
      if(getSettingValue("toggleShop")){
        document.getElementById("shop").style.display = "";
      }
      else{
        document.getElementById("shop").style.display = "none";
      }
    }
  },
  {
    name: "Toggle Quests",
    id: "toggleQuests",
    description: "Toggles Quests",
    defaultValue: true,
    onchange: () =>{
      if(getSettingValue("toggleQuests")){
        document.getElementById("questsContainer").style.display = "";
      }
      else{
        document.getElementById("questsContainer").style.display = "none";
      }
    }
  },
  {
    name: "Toggle Stats",
    id: "toggleStats",
    description: "Toggles Stats",
    defaultValue: true,
    onchange: () =>{
      if(getSettingValue("toggleStats")){
        document.getElementById("statsContainer").style.display = "";
      }
      else{
        document.getElementById("statsContainer").style.display = "none";
      }
    }
  },
  {
    name: "Toggle Achievements",
    id: "toggleAchivements",
    description: "Toggles Achievements",
    defaultValue: true,
    onchange: () =>{
      if(getSettingValue("toggleAchivements")){
        document.getElementById("achivements").style.display = "";
      }
      else{
        document.getElementById("achivements").style.display = "none";
      }
    }
  },
  {
    name: "Toggle Leveling",
    id: "toggleLeveling",
    description: "Toggles Leveling",
    defaultValue: true,
    onchange: () =>{
      if(getSettingValue("toggleLeveling")){
        document.getElementById("leveling").style.display = "";
      }
      else{
        document.getElementById("leveling").style.display = "none";
      }
    }
  }
];
var setSettings = {}; // Store settings here

// Initialize settings with default values
function initSettings() {
  settings.forEach((setting) => {
    if(setSettings[setting.id] === undefined){
      setSettings[setting.id] = setting.defaultValue;
    }
  });
  settings.forEach((setting) => {
    setting.onchange();
  });
}

// Display settings in the settings menu
function displaySettings() {
  settingsDiv.innerHTML = "";
  settings.forEach((setting) => {
    const settingDiv = document.createElement("div");
    settingDiv.classList.add("setting");

    // Use a descriptive label with the current state
    const isOn = getSettingValue(setting.id);
    const buttonText = isOn ? "On" : "Off";
    settingDiv.innerHTML = `
      <p>${setting.name}</p>
      <button onclick="toggleSetting('${setting.id}')">
        ${setting.description} (${buttonText})
      </button>
    `;
    settingsDiv.appendChild(settingDiv);
  });
}

// Toggle setting value and update the display
function toggleSetting(id) {
  setSettings[id] = !getSettingValue(id);
  settings.find((setting) => setting.id === id).onchange();
  displaySettings();
}

// Retrieve the current value of a setting, with fallback
function getSettingValue(id) {
  return setSettings[id] !== undefined ? setSettings[id] : true;
}

// Initialize and display settings on load
initSettings();
displaySettings();
