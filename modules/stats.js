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
    name: "Rarities",
    id: "raritiesGotten",
    value: () => {
      return `Gotten: ${raritiesDone.length} / ${rarity.length}`;
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
    if (set) {
      stat.value = amount;
    } else {
      stat.value += amount;
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
