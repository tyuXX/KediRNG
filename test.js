for (let index = 0; index < rarity.length; index++) {
    const element = rarity[index];
    inventory.push({
        text: element.texts[Math.floor(Math.random() * element.texts.length)],
        rarity: element.value,
        sell: Math.floor(Math.pow(2, element.value)*Math.random())
    });
}
displayInventory();