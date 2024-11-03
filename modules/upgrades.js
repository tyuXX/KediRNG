let boughtUpgrades = [];
let sellMultiplier = 1;

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
];
