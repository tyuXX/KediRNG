// Debug Module for KediRNG
// Remove this script in production

const DEBUG = {
    // Game State Management
    state: {
        save: () => {
            saveGameToLocalStorage();
            console.log('[DEBUG] Game state saved');
        },

        load: () => {
            loadGameFromLocalStorage();
            console.log('[DEBUG] Game state loaded');
        },

        reset: () => {
            resetGame();
            console.log('[DEBUG] Game state reset');
        }
    },

    // Rolling System
    roll: {
        texts: (amount = 1) => {
            console.log(`[DEBUG] Rolling ${amount} texts`);
            backgroundRoll(amount);
        },

        specific: (rarityLevel = 0, gradeLevel = 0, amount = 1) => {
            console.log(`[DEBUG] Adding ${amount} texts with rarity ${rarityLevel} and grade ${gradeLevel}`);
            const rarit = rarity.find(r => r.value === rarityLevel) || rarity[0];
            const grit = grades.find(g => g.value === gradeLevel) || grades[0];
            
            for (let i = 0; i < amount; i++) {
                inventory.push({
                    text: getTextFromRarity(rarit),
                    rarity: rarit.value,
                    grade: grit.value,
                    sell: Math.floor(Math.pow(2, rarit.value) * Math.pow(1.8, grit.value) * Math.random()) + 1
                });
            }
            displayInventory();
        },

        auto: (() => {
            let autoRollInterval = null;
            return {
                start: (interval = 100) => {
                    if (!autoRollInterval) {
                        console.log(`[DEBUG] Starting auto-roll every ${interval}ms`);
                        autoRollInterval = setInterval(() => rollText(), interval);
                    }
                },
                stop: () => {
                    if (autoRollInterval) {
                        clearInterval(autoRollInterval);
                        autoRollInterval = null;
                        console.log('[DEBUG] Auto-roll stopped');
                    }
                },
                toggle: (interval = 100) => {
                    if (autoRollInterval) {
                        DEBUG.roll.auto.stop();
                    } else {
                        DEBUG.roll.auto.start(interval);
                    }
                }
            };
        })()
    },

    // Inventory Management
    inventory: {
        clear: () => {
            console.log('[DEBUG] Clearing inventory');
            inventory.length = 0;
            displayInventory();
        },

        fill: (amount = 100) => {
            console.log(`[DEBUG] Filling inventory with ${amount} random items`);
            for (let i = 0; i < amount; i++) {
                const randomRarity = Math.floor(Math.random() * rarity.length);
                const randomGrade = Math.floor(Math.random() * grades.length);
                DEBUG.roll.specific(randomRarity, randomGrade, 1);
            }
        }
    },

    // Upgrade System Management
    upgrades: {
        list: () => {
            console.log('[DEBUG] Available upgrades:');
            upgrades.forEach((upgrade, index) => {
                const bought = boughtUpgrades.includes(upgrade.id);
                console.log(`${index}. ${upgrade.name} (${upgrade.id}) - ${bought ? 'Bought' : 'Not bought'} - Cost: ${upgrade.cost}`);
            });
        },

        buy: (id) => {
            const upgrade = upgrades.find(u => u.id === id || u.name === id);
            if (!upgrade) {
                console.error('[DEBUG] Upgrade not found');
                return;
            }
            if (boughtUpgrades.includes(upgrade.id)) {
                console.log('[DEBUG] Upgrade already bought');
                return;
            }
            const index = upgrades.indexOf(upgrade);
            money += upgrade.cost; // Temporarily add money to buy upgrade
            buyUpgrade(index);
            console.log(`[DEBUG] Bought upgrade: ${upgrade.name}`);
        },

        buyAll: () => {
            upgrades.forEach((upgrade, index) => {
                if (!boughtUpgrades.includes(upgrade.id)) {
                    money += upgrade.cost;
                    buyUpgrade(index);
                }
            });
            console.log('[DEBUG] Bought all available upgrades');
        },

        values: () => {
            console.log('[DEBUG] Current upgrade values:');
            Object.entries(upgradeValues).forEach(([id, value]) => {
                console.log(`${id}: ${value}`);
            });
        },

        setValue: (id, value) => {
            if (typeof value !== 'number') {
                console.error('[DEBUG] Value must be a number');
                return;
            }
            changeUpgradeValue(id, value);
            console.log(`[DEBUG] Set ${id} value to ${value}`);
        }
    },

    // Resources
    resources: {
        addMoney: (amount = 1000) => {
            console.log(`[DEBUG] Adding ${amount} money`);
            changeMoney(amount);
        },

        setLevel: (level = 1) => {
            console.log(`[DEBUG] Setting level to ${level}`);
            window.level.level = level;
            window.level.xp = getXpReq() - 1;
        },

        setRebirth: (amount = 1) => {
            console.log(`[DEBUG] Setting rebirth to ${amount}`);
            window.rebirth = amount;
        }
    },

    // Quest System
    quests: {
        complete: () => {
            console.log('[DEBUG] Completing all quests');
            quests.forEach(quest => {
                changeMoney(quest.reward);
            });
            quests.length = 0;
            displayQuests();
        },

        add: (amount = 1) => {
            console.log(`[DEBUG] Adding ${amount} random quests`);
            for (let i = 0; i < amount; i++) {
                generateRandomQuest();
            }
            displayQuests();
        }
    },

    // Performance Testing
    performance: {
        stressTest: (iterations = 1000) => {
            console.log(`[DEBUG] Running stress test with ${iterations} iterations`);
            console.time('stressTest');
            for (let i = 0; i < iterations; i++) {
                backgroundRoll(10);
            }
            console.timeEnd('stressTest');
        },

        profile: (duration = 5000) => {
            console.log(`[DEBUG] Profiling game for ${duration}ms`);
            console.profile('gameProfile');
            const endTime = Date.now() + duration;
            const interval = setInterval(() => {
                if (Date.now() > endTime) {
                    clearInterval(interval);
                    console.profileEnd('gameProfile');
                } else {
                    rollText();
                }
            }, 100);
        }
    },

    // Help System
    help: () => {
        console.log(`
KediRNG Debug Commands
=====================

Game State:
- DEBUG.state.save() - Save current game state
- DEBUG.state.load() - Load saved game state
- DEBUG.state.reset() - Reset game to initial state

Rolling:
- DEBUG.roll.texts(amount) - Roll specified amount of texts
- DEBUG.roll.specific(rarity, grade, amount) - Add specific rarity/grade texts
- DEBUG.roll.auto.start(interval) - Start auto-rolling
- DEBUG.roll.auto.stop() - Stop auto-rolling
- DEBUG.roll.auto.toggle(interval) - Toggle auto-rolling

Inventory:
- DEBUG.inventory.clear() - Clear inventory
- DEBUG.inventory.fill(amount) - Fill with random items

Upgrades:
- DEBUG.upgrades.list() - List all upgrades
- DEBUG.upgrades.buy(id) - Buy specific upgrade
- DEBUG.upgrades.buyAll() - Buy all available upgrades
- DEBUG.upgrades.values() - Show current upgrade values
- DEBUG.upgrades.setValue(id, value) - Set specific upgrade value

Resources:
- DEBUG.resources.addMoney(amount) - Add money
- DEBUG.resources.setLevel(level) - Set player level
- DEBUG.resources.setRebirth(amount) - Set rebirth level

Quests:
- DEBUG.quests.complete() - Complete all quests
- DEBUG.quests.add(amount) - Add random quests

Performance:
- DEBUG.performance.stressTest(iterations) - Run stress test
- DEBUG.performance.profile(duration) - Profile game performance

Help:
- DEBUG.help() - Show this help message
        `);
    }
};

// Initialize debug mode
console.log('[DEBUG] Type DEBUG.help() for available commands.\n[DEBUG] Please do not use this to cheat, but only to test.');

globalThis.DEBUG = DEBUG;