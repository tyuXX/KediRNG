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
    req: () => true,
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
    req: () => true,
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
    req: () => getUpgradesLevel("doubleSell") > 0,
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
    req: () => getUpgradesLevel("doubleRoll") > 0,
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
    req: () => getUpgradesLevel("tripleRoll") > 0,
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
    req: () => getUpgradesLevel("tripleSell") > 0,
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
    req: () => true,
    effect: () => {},
  },
  {
    name: "Spammer",
    id: "spammer",
    description: "Remove roll cooldown",
    cost: 50000,
    limit: 1,
    req: () => getUpgradesLevel("lessCooldown") > 3,
    effect: () => {},
  },
  {
    name: "Small Invesments",
    id: "smallInvesments",
    description: "We need to scam.",
    cost: 750000,
    limit: 1,
    req: () => getUpgradesLevel("littleCompany") > 0,
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
    req: () => getUpgradesLevel("smallInvesments") > 0,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Invesments",
    id: "invesments",
    description: "Scammery strikes again.",
    cost: 50000000,
    limit: 1,
    req: () => getUpgradesLevel("company") > 0,
    effect: () => {
      changeUpgradeValue("sellMultiplier", 1);
      displayInventory();
    },
  },
  {
    name: "Big Company",
    id: "bigCompany",
    description: "Pet simulator goes brrr",
    cost: 500000000,
    limit: 1,
    req: () => getUpgradesLevel("invesments") > 0,
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
    req: () => true,
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
    req: () => getUpgradesLevel("autoRoll") > 0,
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
    req: () => getUpgradesLevel("quadRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Sextuple Roll",
    id: "sextupleRoll",
    description: "Roll 6 items at once.",
    cost: 5000000000,
    limit: 1,
    req: () => getUpgradesLevel("quintupleRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    },
  },
  {
    name: "Septuple Roll",
    id: "septupleRoll",
    description: "Roll 7 items at once.",
    cost: 50000000000,
    limit: 1,
    req: () => getUpgradesLevel("sextupleRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    }
  },
  {
    name: "Octuple Roll",
    id: "octupleRoll",
    description: "Roll 8 items at once.",
    cost: 500000000000,
    limit: 1,
    req: () => getUpgradesLevel("septupleRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    }
  },
  {
    name: "Novuple Roll",
    id: "novupleRoll",
    description: "Roll 9 items at once.",
    cost: 5000000000000,
    limit: 1,
    req: () => getUpgradesLevel("octupleRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    }
  },
  {
    name: "Decuple Roll",
    id: "decupleRoll",
    description: "Roll 10 items at once.",
    cost: 50000000000000,
    limit: 1,
    req: () => getUpgradesLevel("novupleRoll") > 0,
    effect: () => {
      changeUpgradeValue("rollMultiplier", 1);
    }
  },
  {
    name: "Luckery",
    id: "luckery",
    description: "We get real lucky this time.",
    cost: 10000000,
    limit: 10,
    req: () => true,
    effect: () => {
      changeUpgradeValue("luck", 1);
    },
  },
  {
    name: "Quantum Luck",
    id: "qluck",
    description: "Luck, but quantum. Cus' i understand neither.",
    cost: 10000000000,
    limit: 3,
    req: () => getUpgradesLevel("luckery") > 0,
    effect: () => {
      changeUpgradeValue("luck",1);
    },
  },
  {
    name: "Questing Luckery",
    id: "qluckery",
    description: "Questable luck.",
    cost: 10000000,
    limit: 10,
    req: () => true,
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
    req: () => true,
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
    req: () => getUpgradesLevel("experiancedRoller") > 0,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    },
  },
  {
    name: "Experianced roller 3",
    id: "experiancedRoller3",
    description: "Increase xp gain",
    cost: 1000000000,
    limit: 5,
    req: () => getUpgradesLevel("experiancedRoller2") > 0,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    }
  },
  {
    name: "Experianced roller 4",
    id: "experiancedRoller4",
    description: "Increase xp gain",
    cost: 10000000000,
    limit: 5,
    req: () => getUpgradesLevel("experiancedRoller3") > 0,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    }
  },
  {
    name: "Experianced roller 5",
    id: "experiancedRoller5",
    description: "Increase xp gain",
    cost: 100000000000,
    limit: 5,
    req: () => getUpgradesLevel("experiancedRoller4") > 0,
    effect: () => {
      changeUpgradeValue("xpbonus", 1);
    }
  },
  {
    name: "Rollmaster",
    id: "rollmaster",
    description: "Rollmaster",
    cost: 1000000000000,
    limit: 2,
    req: () => getUpgradesLevel("experiancedRoller5") > 0,
    effect: () => {
      changeUpgradeValue("xpbonus", 3);
    },
  },
  {
    name: "Quest Speedup",
    id: "questSpeedup",
    description: "Decrease quest generation time",
    cost: 1000000,
    limit: 40,
    req: () => true,
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
    req: () => getUpgradesLevel("questSpeedup") > 0,
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
    req: () => getUpgradesLevel("questSpeedupplus") > 0,
    effect: () => {
      changeUpgradeValue("questSpeed", 1);
    },
  },
  {
    name: "Double money",
    id: "doubleMoney",
    description: "Double money",
    cost: 10000000,
    limit: 1,
    req: () => true,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Triple money",
    id: "tripleMoney",
    description: "Triple money",
    cost: 100000000,
    limit: 1,
    req: () => getUpgradesLevel("doubleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Quadruple money",
    id: "quadrupleMoney",
    description: "Quadruple money",
    cost: 1000000000,
    limit: 1,
    req: () => getUpgradesLevel("tripleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Quintuple money",
    id: "quintupleMoney",
    description: "Quintuple money",
    cost: 10000000000,
    limit: 1,
    req: () => getUpgradesLevel("quadrupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Sextuple money",
    id: "sextupleMoney",
    description: "Sextuple money",
    cost: 100000000000,
    limit: 1,
    req: () => getUpgradesLevel("quintupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Septuple money",
    id: "septupleMoney",
    description: "Septuple money",
    cost: 1000000000000,
    limit: 1,
    req: () => getUpgradesLevel("sextupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Octuple money",
    id: "octupleMoney",
    description: "Octuple money",
    cost: 10000000000000,
    limit: 1,
    req: () => getUpgradesLevel("septupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Novuple money",
    id: "novupleMoney",
    description: "Novuple money",
    cost: 100000000000000,
    limit: 1,
    req: () => getUpgradesLevel("octupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Decuple money",
    id: "decupleMoney",
    description: "Decuple money",
    cost: 1000000000000000,
    limit: 1,
    req: () => getUpgradesLevel("novupleMoney") > 0,
    effect: () => {
      changeUpgradeValue("moneyMultiplier", 1);
    }
  },
  {
    name: "Gamble",
    id: "gamble",
    description: "What will i become?",
    cost: 10000000000000000,
    limit: 3,
    req: () => true,
    effect: () => {
      const valueT = upgrades[Math.floor(Math.random() * upgrades.length)].id;
      upgrades.find((upgrade) => upgrade.id === valueT).effect();
      notify("Upgrade effect applied: " + upgrades.find((upgrade) => upgrade.id === valueT).name);
    }
  }
];

// Function to display upgrades in the shop
function displayUpgrades() {
  const upgradesDiv = document.getElementById("upgrades");
  upgradesDiv.innerHTML = ""; // Clear existing upgrades

  upgrades.forEach((upgrade, index) => {
    if (upgrade.req()) {
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
    }
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

function hasUpgradeValue(id) {
  return upgradeValues[id] ? true : false;
}

displayUpgrades();
