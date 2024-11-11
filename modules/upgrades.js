var boughtUpgrades = [];
var upgradeValues = {};
var rollCooldown = 0;

const upgrades = [
  {
    name: "Double Sell",
    id: "doubleSell",
    description: "Doubles the sell value of items.",
    cost: 10000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Double Roll",
    id: "doubleRoll",
    description: "Roll double the items.",
    cost: 100000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Triple Sell",
    id: "tripleSell",
    description: "Triple the sell value of items.",
    cost: 100000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Triple Roll",
    id: "tripleRoll",
    description: "Roll triple the items.",
    cost: 250000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Quad Roll",
    id: "quadRoll",
    description: "Roll quadruaple the items.",
    cost: 1000000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Little Company",
    id: "littleCompany",
    description: "We get bussines.",
    cost: 250000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Not so cool",
    id: "lessCooldown",
    description: "Lower roll cooldown",
    cost: 1000,
    limit: 4,
    effect: () => {},
  },
  {
    name: "Spammer",
    id: "spammer",
    description: "Remove roll cooldown",
    cost: 50000,
    limit: 1,
    effect: () => {},
  },
  {
    name: "Small Invesments",
    id: "smallInvesments",
    description: "We need to scam.",
    cost: 750000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Company",
    id: "company",
    description: "We get real bussines.",
    cost: 5000000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Auto Roll",
    id: "autoRoll",
    description: "Roll automatically.",
    cost: 5000000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("autoRoll", 1);
    },
  },
  {
    name: "Automatic Labor",
    id: "automaticLabor",
    description: "It ain't slavery if it's robots.",
    cost: 50000000,
    limit: 2,
    effect: () => {
      changeUpgradeValue("autoRoll", 1);
    },
  },
  {
    name: "Quintuple Roll",
    id: "quintupleRoll",
    description: "Roll quintuple the items.",
    cost: 5000000,
    limit: 1,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Luckery",
    id: "luckery",
    description: "We get real lucky this time.",
    cost: 10000000,
    limit: 10,
    effect: () => {
      changeUpgradeValue("luck", 1);
    },
  },
  {
    name: "Questing Luckery",
    id: "qluckery",
    description: "Questable luck.",
    cost: 10000000,
    limit: 10,
    effect: () => {
      changeUpgradeValue("qluck", 1);
    },
  },
  {
    name: "Experianced roller",
    id: "experiancedRoller",
    description: "Increase xp gain",
    cost: 1000000,
    limit: 3,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    },
  },
  {
    name: "Experianced roller 2",
    id: "experiancedRoller2",
    description: "Increase xp gain",
    cost: 100000000,
    limit: 5,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    },
  },
  {
    name: "Quest Speedup",
    id: "questSpeedup",
    description: "Decrease quest generation time",
    cost: 1000000,
    limit: 40,
    effect: () => {
      changeUpgradeValue("questSpeed", 1);
    },
  },
  {
    name: "Quest Speedup+",
    id: "questSpeedupplus",
    description: "Decrease quest generation time",
    cost: 10000000,
    limit: 20,
    effect: () => {
      changeUpgradeValue("questSpeed", 1);
    },
  },
  {
    name: "Quest Speedup [Ultimate]",
    id: "questSpeedupUlt",
    description: "Decrease quest generation time",
    cost: 1000000000,
    limit: 10,
    effect: () => {
      changeUpgradeValue("questSpeed", 1);
    },
  },
];

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
        <p>Cost: ${upgrade.cost.toLocaleString()}</p>
      `;

    if (boughtCount >= upgrade.limit) {
      upgradeDiv.innerHTML += `<button disabled style="background-color: gray;">Sold out</button>`;
    } else {
      upgradeDiv.innerHTML += `<button onclick="buyUpgrade(${index})">Buy</button>`;
    }

    upgradesDiv.appendChild(upgradeDiv);
  });
}

function getUpgradesLevel(id) {
  const boughtUpgrade = boughtUpgrades.find((up) => up[0] === id);
  return boughtUpgrade ? boughtUpgrade[1] : 0;
}

// Function to buy an upgrade
function buyUpgrade(index) {
  const upgrade = upgrades[index];
  const boughtUpgrade = boughtUpgrades.find((up) => up[0] === upgrade.id);
  const boughtCount = boughtUpgrade ? boughtUpgrade[1] : 0;

  if (money < upgrade.cost) {
    notify("Not enough money to buy this upgrade.");
  } else if (boughtCount >= upgrade.limit) {
    notify("Already bought this upgrade.");
  } else {
    money -= upgrade.cost;
    upgrade.effect(); // Apply the effect of the upgrade

    if (boughtUpgrade) {
      boughtUpgrade[1]++; // Increment count of the upgrade
    } else {
      boughtUpgrades.push([upgrade.id, 1]); // Add new upgrade with count 1
    }
    displayUpgrades(); // Update shop to reflect changes
  }
}

function getUpgradeValue(id) {
  return upgradeValues[id] || 1;
}

function changeUpgradeValue(id, value) {
  if (upgradeValues[id]) {
    upgradeValues[id] = upgradeValues[id] + value;
  } else {
    upgradeValues[id] = value;
  }
}

function hasUpgradeValue(id){
  return upgradeValues[id] ? true : false;
}

displayUpgrades();