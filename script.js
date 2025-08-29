const invDiv = document.getElementById("inventory");
const mlabel = document.getElementById("mlabel");
const pmlabel = document.getElementById("pmlabel");
const tlabel = document.getElementById("tlabel");

// Function to roll a new item based on rarity
function rollText() {
  if (getUpgradesLevel("spammer") === 0 && rollCooldown > 0) {
    notify("On cooldown for " + rollCooldown + "ms");
    return;
  }
  backgroundRoll();
  rollCooldown = 500 - getUpgradesLevel("lessCooldown") * 100;
  displayInventory(true);
}

function getGrit() {
  let grit = grades.find(() => Math.random() < 0.7);
  if(!grit) {
    grit = grades[grades.length - 1];
  }
  if (grit.value < (rebirth - 1) * 2) {
    grit = getGrit();
  }
  return grit;
}

function getRarit() {
  let rarit = rarity.find(() => Math.random() < 0.5 - (getUpgradeValue("luck") - 1) / 100) || rarity[0];
  if(!rarit) {
    rarit = rarity[rarity.length - 1];
  }
  if (rarit.value < (rebirth - 1) * 2) {
    rarit = getRarit();
  }
  return rarit;
}

function backgroundRoll(num = getUpgradeValue("rollMultiplier")) {
  const autoSell = getSettingValue("iSell");
  
  const newItems = [];
  let moneyGained = 0;
  
  for (let index = 0; index < num; index++) {
    let rarit = getRarit();
    let grit = getGrit();
    const selectedText = getTextFromRarity(rarit);
    
    if (!checkQuestCompletion(selectedText, grit.value)) {
      const sellValue = Math.floor(
        Math.pow(2, rarit.value) *
        Math.pow(1.8, grit.value) *
        Math.random() * doneAchivements.length
      ) + 1;
      
      if (autoSell) {
        moneyGained += sellValue;
      } else {
        newItems.push({
          text: selectedText,
          rarity: rarit.value,
          grade: grit.value,
          sell: sellValue
        });
      }
    }
    
    // Track statistics
    if (!raritiesDone.includes(rarit.value)) {
      raritiesDone.push(rarit.value);
      notify("New rarity found!\n" + rarit.name, getColorFromRarity(rarit));
    }
    
    if (!combinationsDone.includes(rarit.value + "-" + grit.value)) {
      combinationsDone.push(rarit.value + "-" + grit.value);
    }
    
    changeStat("totalRolls", 1);
    
    // Update high scores
    const potentialSell = Math.floor(Math.pow(2, rarit.value) * Math.random()) + 1;
    if (getStat("topSellPay") < potentialSell) {
      changeStat("topSellPay", potentialSell, true);
    }
    
    if (rarit.value > getStat("highestRarity")) {
      changeStat("highestRarity", rarit.value, true);
      notify("New highest rarity!\n" + rarit.name, getColorFromRarity(rarit));
    }
    
    if (grit.value > getStat("highestGrade")) {
      changeStat("highestGrade", grit.value, true);
      notify("New highest grade!\n" + grit.name, grit.color);
    }
    
    const textValue = Math.pow(rarit.value, 2) * Math.pow(1.8, grit.value);
    const previousValue = Math.pow(2, getStat("highestVRarity")) * Math.pow(1.8, getStat("highestVGrade"));
    
    if (textValue > previousValue) {
      changeStat("highestVRarity", rarit.value, true);
      changeStat("highestVGrade", grit.value, true);
      notify("New valued highest Text!\n " + rarit.name + "-" + grit.name, getColorFromRarity(rarit));
    }
  }
  
  // Batch update inventory and money
  if (autoSell) {
    changeMoney(moneyGained);
  } else if (newItems.length > 0) {
    inventory.push(...newItems);
  }
}

// Global event delegation for inventory
invDiv.addEventListener('click', (e) => {
  const sellButton = e.target.closest('button[data-index]');
  if (sellButton) {
    const index = parseInt(sellButton.dataset.index);
    delItem(index);
  }
});

async function displayInventory(half = false) {
  if (invDiv.style.display === "none") return;
  const fragment = document.createDocumentFragment();
  const startIndex = half ? invDiv.childElementCount : 0;
  for (let index = startIndex; index < inventory.length; index++) {
    const item = inventory[index];
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.dataset.rvalue = item.rarity;
    itemDiv.style.backgroundColor = getColorFromRarity(
      getRarityFromInt(item.rarity)
    );
    itemDiv.innerHTML = `
      <p>${item.text}</p>
      <p>${getRarityFromInt(item.rarity).name}</p>
      <p style="background-color: ${getGradeFromInt(item.grade).color}">${
      getGradeFromInt(item.grade).name
    }</p>
      <button onclick="delItem(${index})">Sell: ${getFAmount(
      item.sell * getUpgradeValue("sellMultiplier")
    ).toLocaleString()}</button>
    `;
    fragment.appendChild(itemDiv);
  }
  if (!half) invDiv.innerHTML = "";
  invDiv.appendChild(fragment);
}

// Function to delete an item from the inventory
function delItem(index) {
  if (inventory[index].sell > 0) {
    changeMoney(inventory[index].sell * getUpgradeValue("sellMultiplier"));
    inventory.splice(index, 1);
    displayInventory();
  }
}

function sellAll() {
  inventory = inventory.filter((item) => {
    if (item.sell > 0) {
      changeMoney(item.sell * getUpgradeValue("sellMultiplier")); // Add the sell value to money
      return false; // Remove this item from inventory
    }
    return true; // Keep this item in inventory
  });
  closePopup();
  displayInventory();
}

// Function to toggle the visibility of the inventory
function toggleInventory() {
  if (invDiv.style.display === "none") {
    invDiv.style.display = "grid"; // Show inventory as a grid
    displayInventory();
  } else {
    invDiv.style.display = "none"; // Hide inventory
  }
}

// Function to open the Sell All popup
function openSellAllPopup() {
  const rarityCheckboxesDiv = document.getElementById("rarityCheckboxes");
  rarityCheckboxesDiv.innerHTML = ""; // Clear existing checkboxes

  // Create checkboxes for each rarity
  rarity.forEach((r, index) => {
    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("checkboxdiv"); // Add a class for styling
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `rarity-${index}`;
    checkbox.value = r.value; // Or whatever property represents the rarity value

    const label = document.createElement("label");
    label.htmlFor = `rarity-${index}`;
    label.innerText = r.name; // Assuming you have a 'name' property for the rarity

    checkboxDiv.appendChild(checkbox);
    checkboxDiv.appendChild(label);
    rarityCheckboxesDiv.appendChild(checkboxDiv);
    rarityCheckboxesDiv.appendChild(document.createElement("br")); // Line break for better spacing
  });

  document.getElementById("sellAllPopup").style.display = "flex"; // Show the popup
}

// Function to close the popup
function closePopup() {
  document.getElementById("sellAllPopup").style.display = "none"; // Hide the popup
}

// Function to sell selected rarities
function sellSelectedRarities() {
  const checkboxes = document.querySelectorAll(
    "#rarityCheckboxes input[type=checkbox]"
  );
  const selectedRarities = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedRarities.push(parseInt(checkbox.value)); // Store the selected rarity values
    }
  });

  if (selectedRarities.length === 0) {
    notify("Please select at least one rarity to sell.");
    return;
  }

  // Sell items of selected rarities
  selectedRarities.forEach((rarityValue) => {
    inventory = inventory.filter((item) => {
      if (item.rarity === rarityValue && item.sell > 0) {
        changeMoney(item.sell * getUpgradeValue("sellMultiplier")); // Add the sell value to money
        return false; // Remove this item from inventory
      }
      return true; // Keep this item in inventory
    });
  });

  displayInventory(); // Update inventory display
  closePopup(); // Close the popup
}

// Function to animate new rarity items in fullscreen
function newRarityAnimation(rarityint) {
  // Create a fullscreen overlay for the notification
  const overlay = document.createElement("div");
  overlay.classList.add("fullscreen-notification-overlay");

  // Create the content container
  const content = document.createElement("div");
  content.classList.add("notification-content");

  // Add rarity information
  content.innerHTML = `
      <h1>New Rarity Unlocked!</h1>
      <h2 id="rarityText" style="color: ${getColorFromRarity(
        getRarityFromInt(rarityint)
      )};">Rarity Level: ${getColorFromRarity(rarityint)}</h2>
      <button class="close-button">Close</button>
    `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Add event listener to close the modal
  content.querySelector(".close-button").addEventListener("click", () => {
    document.body.removeChild(overlay); // Remove the overlay when closed
  });
}
// Function to generate random quests
function generateRandomQuest() {
  // Select a random rarity
  const randomRarity =
    rarity.find(
      () => Math.random() < 0.3 - (getUpgradeValue("luck") - 1) / 100
    ) || rarity[0]; // Get a random rarity

  // Select a random text from the chosen rarity
  const randomText = getTextFromRarity(randomRarity);

  // Define the quest with a reward greater than the text's base value
  const reward = Math.pow(2, randomRarity.value) * Math.random() * 10; // Example reward formula
  const newQuest = {
    id: quests.length + 1,
    requiredText: randomText,
    reward: Math.floor(reward),
    rarity: randomRarity.value,
  };

  quests.push(newQuest);
}

function checkQuestCompletion(text,grade) {
  quests.forEach((quest) => {
    if (text === quest.requiredText) {
      changeStat("questsCompleted", 1);
      changeMoney(getFAmount(quest.reward) * Math.pow(1.8,grade)); // Reward the player
      //Remove quest from list
      quests = quests.filter((q) => q.id !== quest.id);
      notify(
        "Quest completed (" + quest.requiredText + ")! Reward: " + quest.reward,
        getColorFromRarity(getRarityFromInt(quest.rarity))
      );
      displayQuests();
      // Add a notification or modal to inform the player
      return true;
    }
  });
  return false;
}

function displayQuests() {
  const questsDiv = document.getElementById("quests");
  const fragment = document.createDocumentFragment();
  const template = document.createElement('template');
  
  // Clear existing quests
  questsDiv.innerHTML = "";
  
  // Batch create quest elements
  const questElements = quests.map(quest => {
    const rarity = getRarityFromInt(quest.rarity);
    template.innerHTML = `
      <div class="quest" style="background-color: ${getColorFromRarity(rarity)}">
        <p>${quest.requiredText}</p>
        <p>${rarity.name}</p>
        <p>Reward: ${getFAmount(quest.reward).toLocaleString()}</p>
      </div>
    `.trim();
    
    return template.content.firstChild.cloneNode(true);
  });
  
  // Append all quests at once
  fragment.append(...questElements);
  questsDiv.appendChild(fragment);
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  
  // Cache DOM elements
  const levelLabel = document.getElementById("levelLabel");
  const rebirthLabel = document.getElementById("rebirthLabel");
  
  // Batch DOM updates
  requestAnimationFrame(() => {
    levelLabel.textContent = `Level: ${level.level} (EXP: ${level.xp.toLocaleString()} / ${getXpReq().toLocaleString()})`;
    rebirthLabel.textContent = `Rebirth: ${rebirth} (Level: ${level.level} / ${getRebirthReq()})`;
    mlabel.textContent = `Money: ${money.toLocaleString()}`;
    pmlabel.textContent = `Potential Money: ${getFAmount(
      inventory.reduce((a, b) => a + b.sell * getUpgradeValue("sellMultiplier"), 0)
    ).toLocaleString()}`;
    tlabel.textContent = `Text count: ${inventory.length}`;
    
    renderLevelBar();
    renderRebirthBar();
    
    if (level.level >= getRebirthReq()) {
      document.getElementById("rebirthButton").style.display = "";
    }
    displayStats();
  });
}

async function questLoop() {
  while (true) {
    generateRandomQuest();
    displayQuests();
    await new Promise((r) =>
      setTimeout(r, 100000 - getUpgradeValue("questSpeed") * 1000)
    );
  }
}

async function tickLoop() {
  while (true) {
    if (rollCooldown > 0) {
      rollCooldown -= 100;
    }
    if (hasUpgradeValue("autoRoll") && getSettingValue("autoRoll")) {
      backgroundRoll(getUpgradeValue("autoRoll"));
      displayInventory(true);
    }
    changeStat("timePlayed", 1);
    await new Promise((r) => setTimeout(r, 100));
  }
}

function changeMoney(amount) {
  const famount = getFAmount(amount);
  money += famount;
  addXP(famount);
  if (amount > 0) {
    changeStat("totalMoney", famount);
    changeStat("totalMoneyRebirth", famount);
  }
}

function toggleNotifications() {
  const notifications = document.getElementById("notifications");
  const toggleButton = document.getElementById("toggleNotifications");

  // Toggle display and update button text based on current state
  if (notifications.style.display !== "none") {
    notifications.style.display = "none";
    toggleButton.innerHTML = "Notifications (Off)";
  } else {
    notifications.style.display = "block";
    toggleButton.innerHTML = "Notifications (On)";
  }
}

function getFAmount(amount) {
  return (
    Math.floor(amount * Math.pow(rebirth, 2) * (1 + level.level / 10)) *
    getUpgradeValue("moneyMultiplier")
  );
}

// Cache maps for O(1) lookups
const rarityMap = new Map();
const gradeMap = new Map();

// Initialize cache maps
function initializeCacheMaps() {
    rarity.forEach(r => rarityMap.set(r.value, r));
    grades.forEach(g => gradeMap.set(g.value, g));
}

// Replace getRarityFromInt with cached version
function getRarityFromInt(value) {
    return rarityMap.get(value) || rarity[0];
}

// Replace getGradeFromInt with cached version
function getGradeFromInt(value) {
    return gradeMap.get(value) || grades[0];
}

// Initialize maps on load
initializeCacheMaps();

// Initial calls

displayInventory();
for (let i = 0; i < 5; i++) {
  generateRandomQuest();
}
displayQuests();
tickLoop();
questLoop();
renderLoop();

// Set default upgrade values
changeUpgradeValue("rollMultiplier", 1);
changeUpgradeValue("sellMultiplier", 1);
