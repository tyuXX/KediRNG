let sellMultiplier = 1;

const upgrades = [
    {
      name: "Double Sell",
      id: "doubleSell",
      cost: 10000,
      multibuy: false,
      effect: () => {
        // Logic for doubling the sell value of items
        sellMultiplier++;
      },
    },
  ];