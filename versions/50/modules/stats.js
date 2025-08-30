const statsDiv = document.getElementById("stats");
var lastSave = Date.now();
var stats = defStats;
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
      return (getStat("timePlayed") / 10).toLocaleString();
    },
  },
  {
    name: "Average money per roll",
    id: "averageMoneyPerRoll",
    value: () => {
      return (getStat("totalMoney") / getStat("totalRolls")).toLocaleString();
    },
  },
  {
    name: "Money per second",
    id: "moneyPerSecond",
    value: () => {
      return (
        getStat("totalMoney") /
        (getStat("timePlayed") / 10)
      ).toLocaleString();
    },
  },
  {
    name: "Money per minute",
    id: "moneyPerMinute",
    value: () => {
      return (
        getStat("totalMoney") /
        (getStat("timePlayed") / 600)
      ).toLocaleString();
    },
  },
  {
    name: "Money per hour",
    id: "moneyPerHour",
    value: () => {
      return (
        getStat("totalMoney") /
        (getStat("timePlayed") / 3600)
      ).toLocaleString();
    },
  },
  {
    name: "Lifelessness",
    id: "lifelessness",
    value: () => {
      return getStat("totalRolls") * getStat("timePlayed");
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
  statsDiv.innerHTML = "";
  stats.forEach((stat) => {
    if (stat.show) {
      const statDiv = document.createElement("div");
      statDiv.classList.add("stat");
      statDiv.innerHTML = `<p>${stat.name}: ${stat.value.toLocaleString()}</p>`;
      statsDiv.appendChild(statDiv);
    }
  });

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
    // Convert amount to number if it's a Decimal
    const numAmount = amount && amount.isDecimal ? amount.toNumber() : Number(amount);
    
    if (set) {
      stat.value = numAmount;
    } else {
      stat.value = (stat.value || 0) + numAmount;
    }
    
    // Update highest value if current value is greater
    if (stat.value > (stat.highest || 0)) {
      stat.highest = stat.value;
    }
  } else {
    stats.push({ name: id, id: id, value: amount, show: true });
  }
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
