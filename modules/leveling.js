const levelBar = document.getElementById("levelBarI");
const rebirthBar = document.getElementById("rebirthBarI");
var level = defLevel;
var rebirth = 1;

function addXP(amount) {
  level.xp += Math.floor(amount * (1 + getUpgradeValue("xpbonus") / 10));
  while (level.xp >= getXpReq()) {
    level.xp -= getXpReq();
    level.level++;
  }
}

function rebirthHandler() {
  if (level.level > getRebirthReq()) {
    rebirth++;
    level = defLevel;
    changeStat("totalMoneyRebirth", 0, true);
    inventory = defInventory;
    document.getElementById("rebirthButton").style.display = "none";
  }
}

function getXpReq() {
  return Math.ceil(Math.pow(1.2, level.level) * 10);
}

function getRebirthReq() {
  return Math.ceil(Math.pow(2.5, rebirth) * 10);
}

function renderLevelBar() {
  levelBar.style.width = `${(level.xp / getXpReq()) * 100}%`;
}

function renderRebirthBar() {
  rebirthBar.style.width = `${((level.level / getRebirthReq()) * 100) % 100}%`;
}
