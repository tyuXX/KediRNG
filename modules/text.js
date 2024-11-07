const rarity = [
  {
    name: "Common",
    value: 0,
    texts: [
      "Bruh",
      "Trash",
      "Go pack p2w at pets go",
      "Cry",
      "Leave",
      "L",
      "Is that the best you can do?",
      "Keep trying, rookie!",
    ],
    colors: ["#AAAAAA"],
  },
  {
    name: "Uncommon",
    value: 1,
    texts: [
      "Unlucky",
      "oh my god i am a noob",
      "uncommon steak?",
      "Little L",
      "Almost there!",
      "This isn't quite rare yet...",
    ],
    colors: ["#CC3333"],
  },
  {
    name: "Rare",
    value: 2,
    texts: [
      "Bad try",
      "Microscopic L",
      "This can't be rare",
      "You're getting there!",
      "Is it rare? Barely.",
    ],
    colors: ["#33CC33"],
  },
  {
    name: "Super Rare",
    value: 3,
    texts: [
      "Good try",
      "Rare=Ender but Ender is an arabic name so dynamike is super arab and you too?",
      "Close to getting El primo oh you have it?",
      "Rare vibes detected",
      "Could be legendary soon!",
    ],
    colors: ["#3333CC"],
  },
  {
    name: "Epic",
    value: 4,
    texts: [
      "VAV",
      "VAVAV",
      "I WANT MINIMUM EXTRA SAUCE++",
      "HAHA tarhanaman noob trash",
      "Epic pull!",
      "This could be the start of greatness.",
    ],
    colors: ["#CCCC33"],
  },
  {
    name: "Super Epic",
    value: 5,
    texts: [
      "Lucky",
      "WOW you luck itself actually noob",
      "Super epic level reached!",
      "You're on fire!",
    ],
    colors: ["#CC33CC"],
  },
  {
    name: "Legendary",
    value: 6,
    texts: [
      "I want my meat legendary",
      "Cat la best",
      "French b",
      "Legendary vibes!",
      "A rare sight indeed.",
    ],
    colors: ["#33CCCC"],
  },
  {
    name: "Mythical",
    value: 7,
    texts: ["Mythic", "The stuff of legends", "A true myth!"],
    colors: ["#B45F06"],
  },
  {
    name: "Godly",
    value: 8,
    texts: ["What is better", "A divine pull!", "Beyond mere mortal items"],
    colors: ["#9932CC"],
  },
  {
    name: "Cheesy",
    value: 9,
    texts: [
      "Why this better",
      "Too cheesy to be true",
      "Aged to perfection",
      "Delicius Grilled Cheese without cheese?",
    ],
    colors: ["#888888"],
  },
  {
    name: "Extra Sauce",
    value: 10,
    texts: [
      "What the 2.2.2.2.2.2.2.2.2.2",
      "this game",
      "Extra sauce, extra spice",
      "Saucy find!",
    ],
    colors: ["#7B7B7B"],
  },
  // Continuation for "+ Levels" rarities and higher values
  {
    name: "Common+",
    value: 11,
    texts: [
      "?+?",
      "Just a bit more rare than common",
      "Slightly upgraded common",
    ],
    colors: ["#D2691E"],
  },
  {
    name: "Uncommon+",
    value: 12,
    texts: ["Infinite loop?", "Uncommonly uncommon", "On the rise"],
    colors: ["#800000"],
  },
  {
    name: "Rare+",
    value: 13,
    texts: [
      "I want huge pet",
      "Rare indeed",
      "Just one step away",
      "stop this pain",
    ],
    colors: ["#339933"],
  },
  {
    name: "Super Rare+",
    value: 14,
    texts: [
      "Banana",
      "Beyond rare",
      "Quite the find!",
      "Leader of gambling nothing",
    ],
    colors: ["#333399"],
  },
  {
    name: "Epic+",
    value: 15,
    texts: ["Gus gus op", "An epic moment", "That's epic!", "Shade the broken"],
    colors: ["#999933"],
  },
  {
    name: "Super Epic+",
    value: 16,
    texts: ["Stop it...", "Super epic win!", "You're on another level"],
    colors: ["#990033"],
  },
  {
    name: "Legendary+",
    value: 17,
    texts: ["How did we get here", "Legend in the making", "Beyond legendary!"],
    colors: ["#FF6347"],
  },
  {
    name: "Mythical+",
    value: 18,
    texts: ["Nibble", "A myth reborn", "Mythic upgrade!"],
    colors: ["#CD853F"],
  },
  {
    name: "Godly+",
    value: 19,
    texts: ["Near end", "Godly indeed", "Almost divine"],
    colors: ["#FF77FF"],
  },
  {
    name: "Cheesy+",
    value: 20,
    texts: ["-1 step ahead", "Extra cheesy!", "Grated greatness"],
    colors: ["#FFD700"],
  },
  {
    name: "Extra Sauce+",
    value: 21,
    texts: [
      "The End????????",
      "Na' bro",
      "Overflowing with sauce",
      "is not healthy",
    ],
    colors: ["#FFA500"],
  },
  {
    name: "Lucky",
    value: 22,
    texts: [
      "Lucky, what about next time",
      "Luck is on your side",
      "Not bad at all!",
    ],
    colors: ["#FF9B00"],
  },
  {
    name: "Prof. Dr. Brainrot",
    value: 23,
    texts: [
      "Who the rizzing ohio skibidi is this guy?",
      "Is this even real?",
      "Brainrot level: high",
    ],
    colors: ["#1B2F4B"],
  },
  {
    name: "Enchancing",
    value: 24,
    texts: [
      "The age of cheese and magic",
      "burn him he is a dark wizard!"
    ],
    colors: ["#C46927"],
  },
  {
    name: "Toprak's Wrath",
    value: 99,
    texts: ["Unlucky Car:(", "Not the car"],
    colors: ["#8F0000"],
  },
];

function getRarityFromInt(int) {
  return rarity.find((rarity) => rarity.value === int);
}

function getTextFromRarity(rarity) {
  return rarity.texts[Math.floor(Math.random() * rarity.texts.length)];
}

function getColorFromRarity(rarity) {
  return rarity.colors[Math.floor(Math.random() * rarity.colors.length)];
}
