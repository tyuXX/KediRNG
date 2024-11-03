const invDiv = document.getElementById("inventory");
const mlabel = document.getElementById("mlabel");
const pmlabel = document.getElementById("pmlabel");

var inventory = [{ text: "Kedi RNG", rarity: 0, sell: 0 }];
var money = 0;

function rollText() {
  let rarit = rarity[0];
  for (let index = 0; index < rarity.length; index++) {
    if (Math.random() >= 0.5) {
      rarit = rarity[index];
      break;
    }
  }
  inventory.push({
    text: rarit.texts[Math.floor(Math.random() * rarit.texts.length)],
    rarity: rarit.value,
    sell: Math.floor(Math.pow(2, rarit.value)*Math.random())
  });
  displayInventory();
}

function displayInventory() {
  invDiv.innerHTML = "";
  for (let index = 0; index < inventory.length; index++) {
    invDiv.innerHTML += `<div data-rvalue=${
      inventory[index].rarity
    } class=\"item\"><p>${inventory[index].text}</p><p>${
      rarity[inventory[index].rarity].name
    }</p><button onclick=delItem(${index})>Sell:${inventory[index].sell}</button></div>`;
  }

  const items = document.querySelectorAll(".item");
  for (let index = 0; index < items.length; index++) {
    items[index].style.backgroundColor =
      rarity[inventory[index].rarity].colors[
        Math.floor(
          Math.random() * rarity[inventory[index].rarity].colors.length
        )
      ];
  }
}

function delItem(index) {
    money += inventory[index].sell
  inventory.splice(index, 1);
  displayInventory();
}

async function renderLoop() {
    while(true){
        mlabel.innerHTML = `Money:${money}`;
        pmlabel.innerHTML = `Potential Money:${inventory.reduce((a, b) => a + b.sell, 0)}`;
        await new Promise(r => setTimeout(r, 100));
    }
}

displayInventory();
renderLoop();