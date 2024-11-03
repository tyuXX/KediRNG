const invDiv = document.getElementById("inventory");

var inventory = [{ text: "Kedi RNG", rarity: 0 }];

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
    }</p><button onclick=delItem(${index})>X</button></div>`;
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
  inventory.splice(index, 1);
  displayInventory();
}
