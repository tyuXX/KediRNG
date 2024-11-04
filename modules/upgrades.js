var boughtUpgrades = [];
var sellMultiplier = 1;
var rollMultiplier = 1;

const upgrades = [
  {
    name: "Double Sell",
    id: "doubleSell",
    description: "Doubles the sell value of items.",
    cost: 10000,
    limit: 1,
    effect: () => {
      sellMultiplier++;
    },
  },
  {
    name: "Double Roll",
    id: "doubleRoll",
    description: "Roll double the items.",
    cost: 100000,
    limit: 1,
    effect: () => {
      rollMultiplier++;
    },
  },
  {
    name: "Triple Sell",
    id: "tripleSell",
    description: "Triple the sell value of items. (Disclamier: I farted.)",
    cost: 100000,
    limit: 1,
    effect: () => {
      sellMultiplier++;
    },
  },
];
