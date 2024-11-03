const invDiv = document.getElementById("inventory");
const mlabel = document.getElementById("mlabel");
const pmlabel = document.getElementById("pmlabel");
const tlabel = document.getElementById("tlabel");

// Function to roll a new item based on rarity
function rollText() {
  const rarit = rarity.find((r) => Math.random() < 0.5) || rarity[0]; // Get a random rarity
  inventory.push({
    text: rarit.texts[Math.floor(Math.random() * rarit.texts.length)],
    rarity: rarit.value,
    sell: Math.floor(Math.pow(2, rarit.value) * Math.random()) + 1,
  });
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
            <button onclick="delItem(${index})">Sell: ${item.sell*sellMultiplier}</button>
        `;

      itemDiv.style.backgroundColor =
        rarity[item.rarity].colors[
          Math.floor(Math.random() * rarity[item.rarity].colors.length)
        ];

      fragment.appendChild(itemDiv);
    });

    invDiv.innerHTML = "";
    invDiv.appendChild(fragment);
  }
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
  displayInventory();
  if (invDiv.style.display === "none") {
    invDiv.style.display = "grid"; // Show inventory as a grid
  } else {
    invDiv.style.display = "none"; // Hide inventory
  }
}

// Function to display upgrades in the shop
function displayUpgrades() {
  const upgradesDiv = document.getElementById("upgrades");
  upgradesDiv.innerHTML = ""; // Clear existing upgrades

  upgrades.forEach((upgrade, index) => {
    if (!boughtUpgrades.includes(upgrade.id)) {
      const upgradeDiv = document.createElement("div");
      upgradeDiv.classList.add("upgrade");
      upgradeDiv.innerHTML = `
        <p>${upgrade.name}</p>
        <p>Cost: ${upgrade.cost}</p>
        <button onclick="buyUpgrade(${index})">Buy</button>
      `;
      upgradesDiv.appendChild(upgradeDiv);
    }
  });
}

// Function to buy an upgrade
function buyUpgrade(index) {
  const upgrade = upgrades[index];
  if (money >= upgrade.cost) {
    money -= upgrade.cost;
    upgrade.effect(); // Apply the effect of the upgrade
    if (!upgrade.multibuy) {
      boughtUpgrades.push(upgrade.id);
    }
    displayInventory(); // Update inventory
    displayUpgrades(); // Update shop to reflect changes
  } else {
    alert("Not enough money!");
  }
}

// Render loop to update money labels
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

// Initial calls
displayUpgrades();
displayInventory();
renderLoop();
