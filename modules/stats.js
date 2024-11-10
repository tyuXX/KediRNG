const statsDiv = document.getElementById("stats");
var lastSave = Date.now();
var stats = defStats;
var compositeStats = [
  {
    name: "Average money per roll",
    value: () => {
      return (getStat("totalMoney") / getStat("totalRolls")).toLocaleString();
    },
  },
  {
    name: "Money per second",
    value: () => {
      return (getStat("totalMoney") / (getStat("timePlayed")/10)).toLocaleString();
    },
  },
  {
    name: "Money per minute",
    value: () => {
      return (getStat("totalMoney") / (getStat("timePlayed")/600)).toLocaleString();
    },
  },
  {
    name: "Money per hour",
    value: () => {
      return (getStat("totalMoney") / (getStat("timePlayed")/3600)).toLocaleString();
    },
  },
  {
    name: "Lifelessness",
    value: () => {
      return (getStat("totalRolls") * getStat("timePlayed")).toLocaleString();
    }
  }
];

function displayStats() {
  statsDiv.innerHTML = "";
  stats.forEach((stat) => {
    const statDiv = document.createElement("div");
    statDiv.classList.add("stat");
    statDiv.innerHTML = `<p>${stat.name}: ${stat.value.toLocaleString()}</p>`;
    statsDiv.appendChild(statDiv);
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
    stats.push({ name: id, id: id, value: amount });
  }
}

function getStat(id) {
  const stat = stats.find((stat) => stat.id === id);
  return stat ? stat.value : 0;
}

displayStats();
