const statsDiv = document.getElementById("stats");
var stats = defStats;
var lastSave = Date.now();

function displayStats() {
  statsDiv.innerHTML = "";
  stats.forEach((stat) => {
    const statDiv = document.createElement("div");
    statDiv.classList.add("stat");
    statDiv.innerHTML = `<p>${stat.name}: ${stat.value.toLocaleString()}</p>`;
    statsDiv.appendChild(statDiv);
  });
}

function changeStat(id, amount, set = false) {
  const stat = stats.find((stat) => stat.id === id);
  if (stat) {
    if(set){
        stat.value = amount;
    }
    else{
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
