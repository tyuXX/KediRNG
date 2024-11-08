var boughtUpgrades = [];
var upgradeValues = defUpgradeValues;
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
    cost: 500000,
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
    name:"Not so cool",
    id:"lessCooldown",
    description:"Lower roll cooldown",
    cost:1000,
    limit:4,
    effect:() => {}
  },
  {
    name: "Spammer",
    id: "spammer",
    description: "Remove roll cooldown",
    cost: 50000,
    limit: 1,
    effect: () => {},
  },
];

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
  return upgradeValues[id];
}

function changeUpgradeValue(id, value) {
  upgradeValues[id] = upgradeValues[id] + value;
}