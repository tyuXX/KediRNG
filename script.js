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
  if (grit.value < (rebirth - 1) && grit.value < grades.length - 2) {
    grit = getGrit();
  }
  return grit;
}

function getRarit() {
  let rarit = rarity.find(() => Math.random() < 0.5 - (getUpgradeValue("luck") - 1) / 100) || rarity[0];
  if(!rarit) {
    rarit = rarity[rarity.length - 1];
  }
  if (rarit.value < (rebirth - 1) * 2 && rarity.value < rarity.length - 4) {
    rarit = getRarit();
  }
  return rarit;
}

function backgroundRoll(num = getUpgradeValue("rollMultiplier")) {
  const autoSell = getSettingValue("iSell");
  
  const newItems = [];
  let moneyGained = new Decimal(0);
  
  for (let index = 0; index < num; index++) {
    let rarit = getRarit();
    let grit = getGrit();
    const selectedText = getTextFromRarity(rarit);
    
    if (!checkQuestCompletion(selectedText, grit.value)) {
      const sellValue = new Decimal(2)
        .pow(rarit.value)
        .times(Decimal.pow(1.8, grit.value))
        .times(Math.random() * doneAchivements.length)
        .floor()
        .plus(1);
      
      if (autoSell) {
        moneyGained = Decimal.add(moneyGained, sellValue);
      } else {
        newItems.push({
          text: selectedText,
          rarity: rarit.value,
          grade: grit.value,
          sell: sellValue.toNumber() // Store as number since it's used in comparisons
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
    const potentialSell = new Decimal(2).pow(rarit.value).times(Math.random()).floor().plus(1);
    if (Decimal.gt(potentialSell, getStat("topSellPay"))) {
      changeStat("topSellPay", potentialSell.toNumber(), true);
    }
    
    if (rarit.value > getStat("highestRarity")) {
      changeStat("highestRarity", rarit.value, true);
      notify("New highest rarity!\n" + rarit.name, getColorFromRarity(rarit));
    }
    
    if (grit.value > getStat("highestGrade")) {
      changeStat("highestGrade", grit.value, true);
      notify("New highest grade!\n" + grit.name, grit.color);
    }
    
    const textValue = new Decimal(rarit.value).pow(2).times(Decimal.pow(1.8, grit.value));
    const previousValue = new Decimal(2).pow(getStat("highestVRarity")).times(Decimal.pow(1.8, getStat("highestVGrade")));
    
    if (textValue.gt(previousValue)) {
      changeStat("highestVRarity", rarit.value, true);
      changeStat("highestVGrade", grit.value, true);
      notify("New valued highest Text!\n " + rarit.name + "-" + grit.name, getColorFromRarity(rarit));
    }
  }
  
  // Batch update inventory and money
  if (autoSell && moneyGained.gt(0)) {
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
      <button onclick="delItem(${index})">Sell: ${formatNumber(new Decimal(item.sell).times(getUpgradeValue("sellMultiplier")))}</button>
    `;
    fragment.appendChild(itemDiv);
  }
  if (!half) invDiv.innerHTML = "";
  invDiv.appendChild(fragment);
}

// Function to delete an item from the inventory
function delItem(index) {
  const item = inventory[index];
  if (item && item.sell > 0) {
    const sellValue = new Decimal(item.sell).times(getUpgradeValue("sellMultiplier"));
    changeMoney(sellValue);
    inventory.splice(index, 1);
    displayInventory();
  }
}

function sellAll() {
  inventory = inventory.filter((item) => {
    if (item.sell > 0) {
      const sellValue = new Decimal(item.sell).times(getUpgradeValue("sellMultiplier"));
      changeMoney(sellValue);
      return false;
    }
    return true;
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
        const sellValue = new Decimal(item.sell).times(getUpgradeValue("sellMultiplier"));
        changeMoney(sellValue);
        return false;
      }
      return true;
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

function checkQuestCompletion(text, grade) {
  let completed = false;
  quests = quests.filter((quest) => {
    if (text === quest.requiredText) {
      try {
        changeStat("questsCompleted", 1);
        const baseReward = getFAmount(quest.reward);
        const gradeBonus = new Decimal(1.8).pow(grade || 0);
        const reward = baseReward.times(gradeBonus);
        
        changeMoney(reward);
        notify(
          `Quest completed (${quest.requiredText})! Reward: ${formatNumber(reward)}`,
          getColorFromRarity(getRarityFromInt(quest.rarity))
        );
        displayQuests();
        completed = true;
        return false; // Remove this quest
      } catch (error) {
        console.error('Error in checkQuestCompletion:', error, { quest, grade });
        return true; // Keep the quest if there was an error
      }
    }
    return true; // Keep other quests
  });
  return completed;
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
    // Safely get values, handling both Decimal and regular numbers
    const currentLevel = level && level.level ? 
      (typeof level.level.toNumber === 'function' ? level.level : new Decimal(level.level || 1)) : new Decimal(1);
    const currentXP = level && level.xp ? 
      (typeof level.xp.toNumber === 'function' ? level.xp : new Decimal(level.xp || 0)) : new Decimal(0);
    
    const xpNeeded = getXpReq();
    const xpNeededDec = xpNeeded instanceof Decimal ? xpNeeded : new Decimal(xpNeeded || 10);
    
    const rebirthReq = getRebirthReq();
    const rebirthReqDec = rebirthReq instanceof Decimal ? rebirthReq : new Decimal(rebirthReq || 10);
    
    // Safely format money values
    const moneyValue = money instanceof Decimal ? money : new Decimal(money || 0);
    
    levelLabel.textContent = `Level: ${formatNumber(currentLevel)} (EXP: ${formatNumber(currentXP)} / ${formatNumber(xpNeededDec)})`;
    rebirthLabel.textContent = `Rebirth: ${formatNumber(rebirth)} (Level: ${formatNumber(currentLevel)} / ${formatNumber(rebirthReqDec)})`;
    mlabel.textContent = `Money: ${formatNumber(moneyValue)}`;
    
    // Calculate potential money, handling both Decimal and regular numbers
    const potentialMoney = inventory.reduce((sum, item) => {
      if (!item || !item.sell) return sum;
      
      const itemSell = item.sell instanceof Decimal ? item.sell : new Decimal(item.sell || 0);
      const multiplier = getUpgradeValue("sellMultiplier") || 1;
      const multiplierDec = multiplier instanceof Decimal ? multiplier : new Decimal(multiplier);
      
      return sum.plus(itemSell.times(multiplierDec));
    }, new Decimal(0));
    
    pmlabel.textContent = `Potential Money: ${formatNumber(potentialMoney)}`;
    tlabel.textContent = `Text count: ${formatNumber(inventory.length)}`;
    
    renderLevelBar();
    renderRebirthBar();
    
    // Check if rebirth is available
    const currentLevelValue = level && level.level ? 
      (typeof level.level.gte === 'function' ? level.level : new Decimal(level.level || 0)) : 
      new Decimal(0);
    const reqLevel = getRebirthReq();
    const requiredLevel = reqLevel instanceof Decimal ? reqLevel : new Decimal(reqLevel || 0);
    
    if (currentLevelValue.gte(requiredLevel)) {
      const rebirthButton = document.getElementById("rebirthButton");
      if (rebirthButton) {
        rebirthButton.style.display = "";
      }
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

function changeMoney(amount, mult = false) {
  // Ensure money is a Decimal
  if (!money || !money.plus) {
    money = new Decimal(money || 0);
  }
  
  const famount = new Decimal(amount);
  money = money.plus(famount);
  
  // Ensure addXP gets a number, not a Decimal
  addXP(famount.toNumber());
  
  if (famount.gt(0)) {
    changeStat("totalMoney", famount.toNumber());
    changeStat("totalMoneyRebirth", famount.toNumber());
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

function formatNumber(num) {
  if (num && num.isDecimal) {
    if (num.gte(1e6)) {
      return num.toExponential();
    }
    return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return Number(num).toFixed(0).toLocaleString();
}

function getFAmount(amount) {
  try {
    // Convert amount to Decimal if it isn't already
    const amountDecimal = amount instanceof Decimal ? amount : new Decimal(amount || 0);
    
    // Safely get rebirth value
    let rebirthValue;
    try {
      rebirthValue = rebirth instanceof Decimal ? rebirth : new Decimal(rebirth || 1);
    } catch (e) {
      console.warn("Error getting rebirth value: ", e);
      console.warn('Invalid rebirth value, using 1:', rebirth);
      rebirthValue = new Decimal(1);
    }
    
    // Safely get level value
    let levelValue = new Decimal(1);
    if (level && level.level !== undefined) {
      try {
        levelValue = level.level instanceof Decimal ? level.level : new Decimal(level.level || 1);
      } catch (e) {
        console.warn("Error getting level value, using 1", e);
        console.warn('Invalid level value, using 1:', level.level);
      }
    }
    
    // Get money multiplier safely
    let moneyMultiplier;
    try {
      moneyMultiplier = new Decimal(getUpgradeValue("moneyMultiplier") || 1);
    } catch (e) {
      console.warn('Invalid moneyMultiplier, using 1');
      moneyMultiplier = new Decimal(1);
    }
    
    // Perform calculations safely
    const rebirthBonus = rebirthValue.times(rebirthValue);
    const levelBonus = levelValue.dividedBy(10).plus(1);
    
    return amountDecimal.times(rebirthBonus).times(levelBonus).times(moneyMultiplier);
  } catch (error) {
    console.error('Error in getFAmount:', error, { amount, rebirth, level });
    return new Decimal(0);
  }
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
