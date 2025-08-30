function migrate(version, gversion) {
    // Migration for versions before 11
    if (version < 11) {
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
    
    // Migration for versions before 14
    if (version < 14) {
        changeUpgradeValue("rollMultiplier", 1);
        changeUpgradeValue("sellMultiplier", 1);   
    }
    
    // Migration for versions before 15 (Decimal support)
    if (version < 15) {
        // Convert money to Decimal if it's not already
        if (money && !money.isDecimal) {
            money = new Decimal(money);
        }
        
        // Convert level and XP to Decimal if they're not already
        if (level) {
            if (level.level && !level.level.isDecimal) {
                level.level = new Decimal(level.level);
            }
            if (level.xp && !level.xp.isDecimal) {
                level.xp = new Decimal(level.xp);
            }
        }
        
        // Convert rebirth to Decimal if it's not already
        if (rebirth && !rebirth.isDecimal) {
            rebirth = new Decimal(rebirth);
        }
        
        // Convert stats values to Decimal
        if (stats && Array.isArray(stats)) {
            stats.forEach(stat => {
                if (stat.value && !stat.value.isDecimal) {
                    stat.value = new Decimal(stat.value);
                }
                if (stat.highest && !stat.highest.isDecimal) {
                    stat.highest = new Decimal(stat.highest);
                }
            });
        }
    }
}