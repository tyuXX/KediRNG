const levelBar = document.getElementById("levelBarI");
const rebirthBar = document.getElementById("rebirthBarI");

// Ensure Decimal is available
if (typeof Decimal !== 'undefined') {
  // Initialize level with proper Decimal values
  var level = {
    level: new Decimal(defLevel && defLevel.level ? defLevel.level : 1),
    xp: new Decimal(defLevel && defLevel.xp ? defLevel.xp : 0)
  };
  var rebirth = new Decimal(1);
} else {
  // Fallback to regular numbers if Decimal is not available
  console.error('Decimal library not found!');
  var level = {
    level: defLevel && defLevel.level ? Number(defLevel.level) : 1,
    xp: defLevel && defLevel.xp ? Number(defLevel.xp) : 0
  };
  var rebirth = 1;
}

function addXP(amount) {
  if (typeof Decimal !== 'undefined') {
    // Convert amount to Decimal if it isn't already
    const xpGain = new Decimal(amount || 0)
      .times(new Decimal(1).plus(new Decimal(getUpgradeValue("xpbonus") || 0).div(10)));
    
    level.xp = level.xp.plus(xpGain);
    
    // Check for level up
    const xpNeeded = getXpReq();
    while (level.xp.gte(xpNeeded)) {
      level.xp = level.xp.minus(xpNeeded);
      level.level = level.level.plus(1);
    }
  } else {
    // Fallback to regular number operations
    const xpGain = (amount || 0) * (1 + (getUpgradeValue("xpbonus") || 0) / 10);
    level.xp += xpGain;
    
    // Check for level up
    const xpNeeded = getXpReq();
    while (level.xp >= xpNeeded) {
      level.xp -= xpNeeded;
      level.level++;
    }
  }
}

function rebirthHandler() {
  const rebirthReq = getRebirthReq();
  const canRebirth = typeof Decimal !== 'undefined' 
    ? level.level.gte(rebirthReq)
    : level.level >= rebirthReq;
    
  if (canRebirth) {
    if (typeof Decimal !== 'undefined') {
      rebirth = rebirth.plus(1);
      level.level = new Decimal(1);
      level.xp = new Decimal(0);
      money = new Decimal(0);
    } else {
      rebirth++;
      level.level = 1;
      level.xp = 0;
      money = 0;
    }
    
    changeStat("totalMoneyRebirth", 0, true);
    inventory = defInventory;
    boughtUpgrades.length = 0;
    upgradeValues = {};
    document.getElementById("rebirthButton").style.display = "none";
    displayUpgrades();
  }
}

function getXpReq() {
  // Base XP formula: 10 * 1.2^level
  if (typeof Decimal !== 'undefined') {
    return new Decimal(10).times(Decimal.pow(1.2, level.level));
  }
  // Fallback to regular math if Decimal is not available
  return 10 * Math.pow(1.2, level.level);
}

function getRebirthReq() {
  // Base rebirth formula: 10 * 2.5^rebirth
  if (typeof Decimal !== 'undefined') {
    return new Decimal(10).times(Decimal.pow(2.5, rebirth));
  }
  // Fallback to regular math if Decimal is not available
  return 10 * Math.pow(2.5, rebirth);
}

function renderLevelBar() {
  if (!levelBar) return;
  try {
    const xpNeeded = getXpReq();
    let percentage;
    
    // Handle both Decimal and regular numbers
    if (typeof Decimal !== 'undefined' && level.xp && typeof level.xp.dividedBy === 'function') {
      percentage = level.xp.dividedBy(xpNeeded).times(100).toNumber();
    } else {
      const currentXP = level && level.xp ? (level.xp.toNumber ? level.xp.toNumber() : Number(level.xp)) : 0;
      const neededXP = xpNeeded && xpNeeded.toNumber ? xpNeeded.toNumber() : Number(xpNeeded || 1);
      percentage = (currentXP / neededXP) * 100;
    }
    
    levelBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  } catch (e) {
    console.error('Error in renderLevelBar:', e);
    levelBar.style.width = '0%';
  }
}

function renderRebirthBar() {
  if (!rebirthBar) return;
  try {
    const rebirthReq = getRebirthReq();
    let percentage;
    
    // Handle both Decimal and regular numbers
    if (typeof Decimal !== 'undefined' && level.level && typeof level.level.dividedBy === 'function') {
      percentage = level.level.dividedBy(rebirthReq).times(100).toNumber();
    } else {
      const currentLevel = level && level.level ? (level.level.toNumber ? level.level.toNumber() : Number(level.level)) : 0;
      const neededLevel = rebirthReq && rebirthReq.toNumber ? rebirthReq.toNumber() : Number(rebirthReq || 1);
      percentage = (currentLevel / neededLevel) * 100;
    }
    
    rebirthBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  } catch (e) {
    console.error('Error in renderRebirthBar:', e);
    rebirthBar.style.width = '0%';
  }
}

// Helper function to get level as number for display
function getLevelNumber() {
  if (typeof Decimal !== 'undefined' && level.level.toNumber) {
    return level.level.toNumber();
  }
  return Number(level.level);
}

// Helper function to get rebirth as number for display
function getRebirthNumber() {
  if (typeof Decimal !== 'undefined' && rebirth.toNumber) {
    return rebirth.toNumber();
  }
  return Number(rebirth);
}
