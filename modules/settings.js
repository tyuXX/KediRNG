const settingsDiv = document.getElementById("settingsContainer");
const settings = [
  {
    name: "Auto Roll",
    id: "autoRoll",
    description: "Enables auto roll",
    defaultValue: true,
  },
  {
    name: "Immediate Sell",
    id: "iSell",
    description: "Sells Texts immediately",
    defaultValue: false,
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
  displaySettings();
}

// Retrieve the current value of a setting, with fallback
function getSettingValue(id) {
  return setSettings[id] !== undefined ? setSettings[id] : true;
}

// Initialize and display settings on load
initSettings();
displaySettings();
