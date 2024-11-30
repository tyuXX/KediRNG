function migrate(version, gversion){
    if(gversion < 11){
        let newInventory = [];
        for (let i = 0; i < inventory.length; i++) {
            const grit = grades.find(() => Math.random() < 0.7);
            newInventory.push({
                text: inventory[i].text,
                grade: grit.value,
                rarity: inventory[i].rarity,
                sell: inventory[i].sell,
            });
        }
        inventory = newInventory;
    }
}