const invDiv = document.getElementById("inventory");
const mlabel = document.getElementById("mlabel");
const pmlabel = document.getElementById("pmlabel");
const tlabel = document.getElementById("tlabel");

// Function to roll a new item based on rarity
function rollText() {
  for (let index = 0; index < rollMultiplier; index++) {
    const rarit = rarity.find(() => Math.random() < 0.5) || rarity[0]; // Get a random rarity
    const selectedText = getTextFromRarity(rarit);
    if (!checkQuestCompletion(selectedText)) {
      inventory.push({
        text: selectedText,
        rarity: rarit.value,
        sell: Math.floor(Math.pow(2, rarit.value) * Math.random()) + 1,
      });
    }
    if (!raritiesDone.includes(rarit.value)) {
      raritiesDone.push(rarit.value);
      newRarityAnimation(rarit.value);
    }
  }
  displayInventory();
}
// Function to display the inventory
function displayInventory() {
  if (invDiv.style.display != "none") {
    const fragment = document.createDocumentFragment();

    inventory.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.setAttribute("data-rvalue", item.rarity);

      itemDiv.innerHTML = `
            <p>${item.text}</p>
            <p>${rarity[item.rarity].name}</p>
            <button onclick="delItem(${index})">Sell: ${
        item.sell * sellMultiplier
      }</button>
        `;

      itemDiv.style.backgroundColor = getColorFromRarity(
        getRarityFromInt(item.rarity)
      );

      fragment.appendChild(itemDiv);
    });

    invDiv.innerHTML = "";
    invDiv.appendChild(fragment);
  }
}

function displayQuests() {
  const questsDiv = document.getElementById("quests"); // Ensure this div exists in your HTML
  questsDiv.innerHTML = ""; // Clear existing quests

  quests.forEach((quest) => {
    const questDiv = document.createElement("div");
    questDiv.classList.add("quest");
    questDiv.innerHTML = `
            <p>${quest.requiredText}</p>
            <p>${getRarityFromInt(quest.rarity).name}</p>
            <p>Reward: ${quest.reward}</p>
        `;
    questDiv.style.backgroundColor = getColorFromRarity(
      getRarityFromInt(quest.rarity)
    );
    questsDiv.appendChild(questDiv);
  });
}

// Function to delete an item from the inventory
function delItem(index) {
  if (inventory[index].sell > 0) {
    money += inventory[index].sell * sellMultiplier;
    inventory.splice(index, 1);
    displayInventory();
  }
}

// Function to toggle the visibility of the inventory
function toggleInventory() {
  if (invDiv.style.display === "none") {
    invDiv.style.display = "grid"; // Show inventory as a grid
  } else {
    invDiv.style.display = "none"; // Hide inventory
  }
  displayInventory();
}

// Function to display upgrades in the shop
function displayUpgrades() {
  const upgradesDiv = document.getElementById("upgrades");
  upgradesDiv.innerHTML = ""; // Clear existing upgrades

  upgrades.forEach((upgrade, index) => {
    const boughtUpgrade = boughtUpgrades.find((up) => up[0] === upgrade.id);
    const boughtCount = boughtUpgrade ? boughtUpgrade[1] : 0;

    const upgradeDiv = document.createElement("div");
    upgradeDiv.classList.add("upgrade");
    upgradeDiv.innerHTML = `
        <p>${upgrade.name} - ${upgrade.description} (Level: ${boughtCount})</p>
        <p>Cost: ${upgrade.cost}</p>
      `;

    if (boughtCount >= upgrade.limit) {
      upgradeDiv.innerHTML += `<button disabled style="background-color: gray;">Sold out</button>`;
    } else {
      upgradeDiv.innerHTML += `<button onclick="buyUpgrade(${index})">Buy</button>`;
    }

    upgradesDiv.appendChild(upgradeDiv);
  });
}

// Function to buy an upgrade
function buyUpgrade(index) {
  const upgrade = upgrades[index];
  const boughtUpgrade = boughtUpgrades.find((up) => up[0] === upgrade.id);
  const boughtCount = boughtUpgrade ? boughtUpgrade[1] : 0;

  if (money >= upgrade.cost && boughtCount < upgrade.limit) {
    money -= upgrade.cost;
    upgrade.effect(); // Apply the effect of the upgrade

    if (boughtUpgrade) {
      boughtUpgrade[1]++; // Increment count of the upgrade
    } else {
      boughtUpgrades.push([upgrade.id, 1]); // Add new upgrade with count 1
    }

    displayInventory(); // Update inventory
    displayUpgrades(); // Update shop to reflect changes
  } else {
    alert("Not enough money or upgrade limit reached!");
  }
}

// Function to open the Sell All popup
function openSellAllPopup() {
  const rarityCheckboxesDiv = document.getElementById("rarityCheckboxes");
  rarityCheckboxesDiv.innerHTML = ""; // Clear existing checkboxes

  // Create checkboxes for each rarity
  rarity.forEach((r, index) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `rarity-${index}`;
    checkbox.value = r.value; // Or whatever property represents the rarity value

    const label = document.createElement("label");
    label.htmlFor = `rarity-${index}`;
    label.innerText = r.name; // Assuming you have a 'name' property for the rarity

    rarityCheckboxesDiv.appendChild(checkbox);
    rarityCheckboxesDiv.appendChild(label);
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
    alert("No rarities selected!");
    return;
  }

  // Sell items of selected rarities
  selectedRarities.forEach((rarityValue) => {
    inventory = inventory.filter((item) => {
      if (item.rarity === rarityValue) {
        money += item.sell * sellMultiplier; // Add the sell value to money
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
  const randomRarity = rarity.find(() => Math.random() < 0.3) || rarity[0]; // Get a random rarity

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

function checkQuestCompletion(text) {
  quests.forEach((quest) => {
    if (text === quest.requiredText) {
      money += quest.reward; // Reward the player
      //Remove quest from list
      quests = quests.filter((q) => q.id !== quest.id);
      displayQuests();
      // Add a notification or modal to inform the player
      return true;
    }
  });
  return false;
}

async function renderLoop() {
  while (true) {
    mlabel.innerHTML = `Money: ${money}`;
    pmlabel.innerHTML = `Potential Money: ${inventory.reduce(
      (a, b) => a + b.sell * sellMultiplier,
      0
    )}`;
    tlabel.innerHTML = `Text Count: ${inventory.length}`;
    await new Promise((r) => setTimeout(r, 100));
  }
}

async function questLoop() {
  while (true) {
    generateRandomQuest();
    await new Promise((r) => setTimeout(r, 100000));
  }
}

// Initial calls
displayUpgrades();
displayInventory();
for (let i = 0; i < 5; i++) {
  generateRandomQuest();
}
displayQuests();
questLoop();
renderLoop();
