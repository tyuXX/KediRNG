const achivementsDiv = document.getElementById("achivementsContiner");
var doneAchivements = [];
var achivements = [
    {
        name: "KediRNG",
        id: "kedirng",
        description: "Play the game",
        req: () => {
            return true;
        }
    },
    {
        name: "Beginner",
        id: "beginner",
        description: "Roll at least 1000 times",
        req: () => {
            return getStat("totalRolls") > 1000;
        }
    },
    {
        name: "Intermediate",
        id: "intermediate",
        description: "Roll at least 10.000 times",
        req: () => {
            return getStat("totalRolls") > 10000;
        }
    },
    {
        name: "Advanced",
        id: "advanced",
        description: "Roll at least 100.000 times",
        req: () => {
            return getStat("totalRolls") > 100000;
        }
    },
    {
        name: "Master",
        id: "master",
        description: "Roll at least 1.000.000 times",
        req: () => {
            return getStat("totalRolls") > 1000000;
        }
    },
    {
        name: "Millionare",
        id: "millionare",
        description: "Have 1.000.000 total money",
        req: () => {
            return getStat("totalMoney") > 1000000;
        }
    },
    {
        name: "Billionare",
        id: "billionare",
        description: "Have 1.000.000.000 total money",
        req: () => {
            return getStat("totalMoney") > 1000000000;
        }
    },
    {
        name: "Trillionare",
        id: "trillionare",
        description: "Have 1.000.000.000.000 total money",
        req: () => {
            return getStat("totalMoney") > 1000000000000;
        }
    },
    {
        name: "Quadrillionare",
        id: "quadrillionare",
        description: "Have 1.000.000.000.000.000 total money",
        req: () => {
            return getStat("totalMoney") > 1000000000000000;
        }
    },
    {
        name: "Discord mod",
        id: "discordMod",
        description: "Have a lifelessness above 1.000.000",
        req: () => {
            return getCompositeStat("lifelessness") > 1000000;
        }
    },
    {
        name: "KediRNG Fan",
        id: "kediRNGfan",
        description: "Have a lifelessness above 500.000.000",
        req: () => {
            return getCompositeStat("lifelessness") > 500000000;
        }
    },
    {
        name: "KediRNG SuperFan",
        id: "kediRNGSuperfan",
        description: "Have a lifelessness above 2.500.000.000",
        req: () => {
            return getCompositeStat("lifelessness") > 2500000000;
        }
    },
    {
        name: "Complete all achivements",
        id: "finishAchivements",
        description: "Except for this one",
        req: () => {
            return doneAchivements.length == achivements.length - 1;
        }
    },
    {
        name: "Raritifier",
        id: "tenRarities",
        description: "Get 10 rarities",
        req: () => {
            return raritiesDone.length > 9;
        }
    },
    {
        name: "Raritifier+",
        id: "twentyRarities",
        description: "Get 20 rarities",
        req: () => {
            return raritiesDone.length > 19;
        }
    },
    {
        name: "Rarity Collector",
        id: "thirtyRarities",
        description: "Get 30 rarities",
        req: () => {
            return raritiesDone.length > 29;
        }
    },
    {
        name: "Status: Rich",
        id: "statusRich",
        description: "Have 1.000.000 money at one time",
        req: () => {
            return money > 1000000;
        }
    },
    {
        name: "Status: Richer",
        id: "statusRicher",
        description: "Have 1.000.000.000 money at one time",
        req: () => {
            return money > 1000000000;
        }
    }
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
        if(doneAchivements.includes(achivement.id)){
            achivementDiv.innerHTML += `<p id="done">Done</p>`;
        }
        achivementsDiv.appendChild(achivementDiv);
    });
}

function checkachivements() {
    achivements.forEach((achivement) => {
        if(!doneAchivements.includes(achivement.id)){
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