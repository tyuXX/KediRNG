const invDiv = document.getElementById("inventory");
const mlabel = document.getElementById("mlabel");
const pmlabel = document.getElementById("pmlabel");
const tlabel = document.getElementById("tlabel");


let inventory = [{ text: "Kedi RNG", rarity: 0, sell: 0 }];
let money = 0;

// Function to roll a new item based on rarity
function rollText() {
  const rarit = rarity.find(r => Math.random() < 0.5) || rarity[0]; // Get a random rarity
  inventory.push({
    text: rarit.texts[Math.floor(Math.random() * rarit.texts.length)],
    rarity: rarit.value,
    sell: Math.floor(Math.pow(2, rarit.value) * Math.random())
  });
  displayInventory();
}

// Function to display the inventory
function displayInventory() {
  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  inventory.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');
    itemDiv.setAttribute('data-rvalue', item.rarity);

    itemDiv.innerHTML = `
      <p>${item.text}</p>
      <p>${rarity[item.rarity].name}</p>
      <button onclick="delItem(${index})">Sell: ${item.sell}</button>
    `;

    // Set background color
    itemDiv.style.backgroundColor = rarity[item.rarity].colors[
      Math.floor(Math.random() * rarity[item.rarity].colors.length)
    ];

    fragment.appendChild(itemDiv); // Append to the fragment
  });

  invDiv.innerHTML = ""; // Clear the previous items
  invDiv.appendChild(fragment); // Append the fragment to the DOM
}

// Function to delete an item from the inventory
function delItem(index) {
  money += inventory[index].sell;
  inventory.splice(index, 1);
  displayInventory();
}

// Render loop to update money labels
async function renderLoop() {
  while (true) {
    mlabel.innerHTML = `Money: ${money}`;
    pmlabel.innerHTML = `Potential Money: ${inventory.reduce((a, b) => a + b.sell, 0)}`;
    tlabel.innerHTML = `Text Count: ${inventory.length}`;
    await new Promise(r => setTimeout(r, 100));
  }
}

// Initial calls
displayInventory();
renderLoop();
