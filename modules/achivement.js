const achivementsDiv = document.getElementById("achivementsContiner");
var doneAchivements = [];
var achivements = [
  {
    name: "KediRNG",
    id: "kedirng",
    description: "Play the game",
    req: () => {
      return true;
    },
  },
  {
    name: "Beginner",
    id: "beginner",
    description: "Roll at least 1000 times",
    req: () => {
      return getStat("totalRolls") > 1000;
    },
  },
  {
    name: "Intermediate",
    id: "intermediate",
    description: "Roll at least 10.000 times",
    req: () => {
      return getStat("totalRolls") > 10000;
    },
  },
  {
    name: "Advanced",
    id: "advanced",
    description: "Roll at least 100.000 times",
    req: () => {
      return getStat("totalRolls") > 100000;
    },
  },
  {
    name: "Master",
    id: "master",
    description: "Roll at least 1.000.000 times",
    req: () => {
      return getStat("totalRolls") > 1000000;
    },
  },
  {
    name: "Legend",
    id: "legend",
    description: "Roll at least 10.000.000 times",
    req: () => {
      return getStat("totalRolls") > 10000000;
    },
  },
  {
    name: "Myth",
    id: "myth",
    description: "Roll at least 100.000.000 times",
    req: () => {
      return getStat("totalRolls") > 100000000;
    },
  },
  {
    name: "Omega Roller",
    id: "omegaRoller",
    description: "Roll at least 1.000.000.000 times",
    req: () => {
      return getStat("totalRolls") > 1000000000;
    },
  },
  {
    name: "Millionare",
    id: "millionare",
    description: "Have 1.000.000 total money",
    req: () => {
      return getStat("totalMoney") > 1000000;
    },
  },
  {
    name: "Billionare",
    id: "billionare",
    description: "Have 1.000.000.000 total money",
    req: () => {
      return getStat("totalMoney") > 1000000000;
    },
  },
  {
    name: "Trillionare",
    id: "trillionare",
    description: "Have 1.000.000.000.000 total money",
    req: () => {
      return getStat("totalMoney") > 1000000000000;
    },
  },
  {
    name: "Quadrillionare",
    id: "quadrillionare",
    description: "Have 1.000.000.000.000.000 total money",
    req: () => {
      return getStat("totalMoney") > 1000000000000000;
    },
  },
  {
    name: "Omega RichGuy",
    id: "omegaRichGuy",
    description: "Have 1.000.000.000.000.000.000 total money",
    req: () => {
      return getStat("totalMoney") > 1000000000000000000n;
    },
  },
  {
    name: "Discord mod",
    id: "discordMod",
    description: "Have a lifelessness above 1.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 1000000;
    },
  },
  {
    name: "KediRNG Fan",
    id: "kediRNGfan",
    description: "Have a lifelessness above 500.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 500000000;
    },
  },
  {
    name: "KediRNG SuperFan",
    id: "kediRNGSuperfan",
    description: "Have a lifelessness above 2.500.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 2500000000;
    },
  },
  {
    name: "KediRNG HyperFan",
    id: "kediRNGHyperfan",
    description: "Have a lifelessness above 7.500.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 7500000000;
    },
  },
  {
    name: "KediRNG UltiFan",
    id: "kediRNGUltiFan",
    description: "Have a lifelessness above 150.000.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 150000000000;
    },
  },
  {
    name: "KediRNG OmegaFan",
    id: "kediRNGOmegaFan",
    description:
      "I am become kedi, not haver of life. Have a lifelessness above 5.000.000.000.000",
    req: () => {
      return getCompositeStat("lifelessness") > 5000000000000;
    },
  },
  {
    name: "Complete all achivements",
    id: "finishAchivements",
    description: "Except for this one",
    req: () => {
      return doneAchivements.length == achivements.length - 1;
    },
  },
  {
    name: "Achievement Collector",
    id: "achCol",
    description: "Collect 25 achivements",
    req: () => {
      return doneAchivements.length > 24;
    },
  },
  {
    name: "Raritifier",
    id: "tenRarities",
    description: "Get 10 rarities",
    req: () => {
      return raritiesDone.length > 9;
    },
  },
  {
    name: "Raritifier+",
    id: "twentyRarities",
    description: "Get 20 rarities",
    req: () => {
      return raritiesDone.length > 19;
    },
  },
  {
    name: "Rarity Collector",
    id: "thirtyRarities",
    description: "Get 30 rarities",
    req: () => {
      return raritiesDone.length > 29;
    },
  },
  {
    name: "Status: Rich",
    id: "statusRich",
    description: "Have 1.000.000 money at one time",
    req: () => {
      return money > 1000000;
    },
  },
  {
    name: "Status: Richer",
    id: "statusRicher",
    description: "Have 1.000.000.000 money at one time",
    req: () => {
      return money > 1000000000;
    },
  },
  {
    name: "Status: Richest",
    id: "statusRichest",
    description: "Have 1.000.000.000.000 money at one time",
    req: () => {
      return money > 1000000000000;
    },
  },
  {
    name: "Quest Completer 1",
    id: "questCompleter1",
    description: "Complete 25 quests.",
    req: () => {
      return getStat("questsCompleted") > 24;
    },
  },
  {
    name: "Quest Completer 1+",
    id: "questCompleter1plus",
    description: "Complete 100 quests.",
    req: () => {
      return getStat("questsCompleted") > 99;
    },
  },
  {
    name: "Quest Completer 2",
    id: "questCompleter2",
    description: "Complete 250 quests.",
    req: () => {
      return getStat("questsCompleted") > 249;
    },
  },
  {
    name: "Quest Completer 2+",
    id: "questCompleter2plus",
    description: "Complete 1000 quests.",
    req: () => {
      return getStat("questsCompleted") > 999;
    },
  },
  {
    name: "Quest Completer 3",
    id: "questCompleter3",
    description: "Complete 2500 quests.",
    req: () => {
      return getStat("questsCompleted") > 2499;
    },
  },
  {
    name: "Omega Quester",
    id: "omegaQuester",
    description: "Complete 25000 quests.",
    req: () => {
      return getStat("questsCompleted") > 24999;
    },
  },
];

function displayAchivements() {
  // Ensure this div exists in your HTML
  achivementsDiv.innerHTML = ""; // Clear existing achivements
  achivements.forEach((achivement) => {
    const achivementDiv = document.createElement("div");
    achivementDiv.classList.add("achivement");
    achivementDiv.innerHTML = `
                <p id="name">${achivement.name}</p>
                <p id="description">${achivement.description}</p>
            `;
    if (doneAchivements.includes(achivement.id)) {
      achivementDiv.innerHTML += `<p id="done">Done</p>`;
    }
    achivementsDiv.appendChild(achivementDiv);
  });
}

function checkachivements() {
  achivements.forEach((achivement) => {
    if (!doneAchivements.includes(achivement.id)) {
      if (achivement.req()) {
        doneAchivements.push(achivement.id);
        notify("Achivement unlocked: " + achivement.name, "green");
      }
    }
  });
  displayAchivements();
}

setInterval(checkachivements, 20000);
displayAchivements();
