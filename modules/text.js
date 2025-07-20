// Load rarities synchronously since other modules depend on it
let rarity = [];
const xhr = new XMLHttpRequest();
xhr.open('GET', './modules/rarities.json', false); // false makes the request synchronous
xhr.send(null);

if (xhr.status === 200) {
  rarity = JSON.parse(xhr.responseText);
} else {
  console.error('Failed to load rarities.json');
  // Fallback to an empty array to prevent further errors
  rarity = [];
}

const grades = [];
const xhr2 = new XMLHttpRequest();
xhr2.open('GET', './modules/grades.json', false); // false makes the request synchronous
xhr2.send(null);

if (xhr2.status === 200) {
  grades = JSON.parse(xhr2.responseText);
} else {
  console.error('Failed to load grades.json');
  // Fallback to an empty array to prevent further errors
  grades = [];
}

function getRarityFromInt(int) {
  return rarity.find((r) => r.value === int) || { name: 'Unknown', colors: ['#000000'], texts: ['Unknown rarity'] };
}

function getTextFromRarity(rarity) {
  const r = typeof rarity === 'number' ? getRarityFromInt(rarity) : rarity;
  if (!r || !r.texts || r.texts.length === 0) return 'No text available';
  return r.texts[Math.floor(Math.random() * r.texts.length)];
}

function getColorFromRarity(rarity) {
  const r = typeof rarity === 'number' ? getRarityFromInt(rarity) : rarity;
  if (!r || !r.colors || r.colors.length === 0) return '#000000';
  return r.colors[0];
}

function getGradeFromInt(int) {
  if (!isRarityLoaded) {
    console.warn('Rarities not fully loaded yet');
    return { name: 'Loading...', colors: ['#CCCCCC'], texts: ['Please wait...'] };
  }
  return grades.find((grade) => grade.value === int) || { name: '?', color: '#000000' };
}

// Export to window
window.getRarityFromInt = getRarityFromInt;
window.getTextFromRarity = getTextFromRarity;
window.getColorFromRarity = getColorFromRarity;
window.getGradeFromInt = getGradeFromInt;
window.rarity = rarity;
window.grades = grades;