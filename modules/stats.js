const statsDiv = document.getElementById("stats");
var lastSave = Date.now();
var stats = defStats;

// Helper function to safely convert to Decimal
const safeToDecimal = (value, defaultValue = 0) => {
  try {
    return value instanceof Decimal ? value : new Decimal(value || defaultValue);
  } catch (e) {
    console.warn('Error converting value to Decimal, using default:', value, e);
    return new Decimal(defaultValue);
  }
};

// Helper function to format Decimal values consistently
const formatDecimal = (value) => {
  if (!value) return '0';
  const num = value instanceof Decimal ? value : new Decimal(value || 0);
  if (num.gte(1e6)) {
    return num.toExponential(2);
  }
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
var compositeStats = [
  {
    name: "Highest rarity",
    id: "highestRarity",
    value: () => {
      return getRarityFromInt(getStat("highestRarity")).name;
    },
  },
  {
    name: "Highest grade",
    id: "highestGrade",
    value: () => {
      return getGradeFromInt(getStat("highestGrade")).name;
    },
  },
  {
    name: "Highest valued Text",
    id: "highestVText",
    value: () => {
      return getRarityFromInt(getStat("highestVRarity")).name + "-" + getGradeFromInt(getStat("highestVGrade")).name;
    },
  },
  {
    name: "Rarities",
    id: "raritiesGotten",
    value: () => {
      return `Gotten: ${raritiesDone.length} / ${rarity.length}`;
    },
  },
  {
    name: "Rarity-Grade combinations",
    id: "combinationsGotten",
    value: () => {
      return `Gotten: ${combinationsDone.length} / ${rarity.length * grades.length}`;
    },
  },
  {
    name: "Time played (Seconds)",
    id: "timePlayedS",
    value: () => {
      return formatDecimal(safeToDecimal(getStat("timePlayed")).div(10));
    },
  },
  {
    name: "Average money per roll",
    id: "averageMoneyPerRoll",
    value: () => {
      const totalMoney = safeToDecimal(getStat("totalMoney"));
      const totalRolls = safeToDecimal(getStat("totalRolls"));
      return formatDecimal(totalRolls.gt(0) ? totalMoney.div(totalRolls) : 0);
    },
  },
  {
    name: "Money per second",
    id: "moneyPerSecond",
    value: () => {
      const totalMoney = safeToDecimal(getStat("totalMoney"));
      const timePlayed = safeToDecimal(getStat("timePlayed"));
      return formatDecimal(timePlayed.gt(0) ? totalMoney.div(timePlayed).times(10) : 0);
    },
  },
  {
    name: "Money per minute",
    id: "moneyPerMinute",
    value: () => {
      const totalMoney = safeToDecimal(getStat("totalMoney"));
      const timePlayed = safeToDecimal(getStat("timePlayed"));
      return formatDecimal(timePlayed.gt(0) ? totalMoney.div(timePlayed).times(600) : 0);
    },
  },
  {
    name: "Money per hour",
    id: "moneyPerHour",
    value: () => {
      const totalMoney = safeToDecimal(getStat("totalMoney"));
      const timePlayed = safeToDecimal(getStat("timePlayed"));
      return formatDecimal(timePlayed.gt(0) ? totalMoney.div(timePlayed).times(36000) : 0);
    },
  },
  {
    name: "Lifelessness",
    id: "lifelessness",
    value: () => {
      const totalRolls = safeToDecimal(getStat("totalRolls"));
      const timePlayed = safeToDecimal(getStat("timePlayed"));
      return formatDecimal(totalRolls.times(timePlayed));
    },
  },
  {
    name: "Achievements",
    id: "achievements",
    value: () => {
      return `Done: ${doneAchivements.length} / ${achivements.length}`;
    },
  },
];

function displayStats() {
  if (!statsDiv) return;
  
  statsDiv.innerHTML = "";
  
  // Display regular stats
  stats.forEach((stat) => {
    if (stat.show) {
      const statDiv = document.createElement("div");
      statDiv.classList.add("stat");
      const displayValue = stat.value instanceof Decimal ? formatDecimal(stat.value) : stat.value.toLocaleString();
      statDiv.innerHTML = `<p>${stat.name}: ${displayValue}</p>`;
      statsDiv.appendChild(statDiv);
    }
  });

  // Display composite stats
  compositeStats.forEach((stat) => {
    const statDiv = document.createElement("div");
    statDiv.classList.add("stat");
    statDiv.innerHTML = `<p>${stat.name}: ${stat.value()}</p>`;
    statsDiv.appendChild(statDiv);
  });
}

function changeStat(id, amount, set = false) {
  const stat = stats.find((stat) => stat.id === id);
  
  if (stat) {
    // Convert amount to Decimal if it's not already
    const decimalAmount = safeToDecimal(amount, 0);
    
    if (set) {
      stat.value = decimalAmount;
    } else {
      // Ensure current value is a Decimal before adding
      stat.value = safeToDecimal(stat.value).plus(decimalAmount);
    }
    
    // Update highest value if current value is greater
    const currentValue = safeToDecimal(stat.value);
    const highestValue = safeToDecimal(stat.highest || 0);
    
    if (currentValue.gt(highestValue)) {
      stat.highest = currentValue;
    }
  } else {
    // For new stats, store amount as Decimal
    stats.push({ 
      name: id, 
      id: id, 
      value: safeToDecimal(amount, 0),
      highest: safeToDecimal(0),
      show: true 
    });
  }
  
  displayStats();
}

function getStat(id) {
  const stat = stats.find((stat) => stat.id === id);
  return stat ? stat.value : 0;
}

function getCompositeStat(id) {
  const stat = compositeStats.find((stat) => stat.id === id);
  return stat ? stat.value() : 0;
}

displayStats();
