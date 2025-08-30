// Import Decimal if not already available globally
if (typeof Decimal === 'undefined') {
  // This assumes break_infinity.js is loaded via CDN
  console.warn('Decimal not found. Make sure break_infinity.js is loaded.');
}

const createDecimal = (value) => {
  try {
    return new Decimal(value || 0);
  } catch (e) {
    console.warn(`Error creating Decimal from value: ${value}`, e);
    return new Decimal(0);
  }
};

const defInventory = [{ text: "Kedi RNG", grade: 0, rarity: 0, sell: 0 }];
const defRaritiesDone = [0, 1, 2];
const defLevel = { level: createDecimal(1), xp: createDecimal(0) };
const defStats = [
  { name: "Total Money", id: "totalMoney", value: createDecimal(0), highest: createDecimal(0), show: true },
  { name: "Time Played (*100ms)", id: "timePlayed", value: 0, highest: 0, show: false },
  { name: "Total Rolls", id: "totalRolls", value: 0, highest: 0, show: true },
  { name: "Quests Completed", id: "questsCompleted", value: 0, highest: 0, show: true },
  {
    name: "Highest sell payout without bonuses",
    id: "topSellPay",
    value: createDecimal(0),
    highest: createDecimal(0),
    show: true,
  },
  { 
    name: "Highest rarity", 
    id: "highestRarity", 
    value: 0, 
    highest: 0, 
    show: false 
  },
  { 
    name: "Highest grade", 
    id: "highestGrade", 
    value: 0, 
    highest: 0, 
    show: false 
  },
  {
    name: "Total money this rebirth",
    id: "totalMoneyRebirth",
    value: createDecimal(0),
    highest: createDecimal(0),
    show: true,
  },
  { 
    name: "Highest valued Texts grade", 
    id: "highestVGrade", 
    value: 0, 
    highest: 0, 
    show: false 
  },
  { 
    name: "Highest valued Texts rarity", 
    id: "highestVRarity", 
    value: 0, 
    highest: 0, 
    show: false 
  },
];
