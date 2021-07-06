//https://github.com/usmanbashir/haikunator
//Copyright (c) 2015 Usman Bashir
const adjectives = [
  "autumn",
  "hidden",
  "bitter",
  "misty",
  "silent",
  "empty",
  "dry",
  "dark",
  "summer",
  "icy",
  "delicate",
  "quiet",
  "white",
  "cool",
  "spring",
  "winter",
  "patient",
  "twilight",
  "dawn",
  "crimson",
  "wispy",
  "weathered",
  "blue",
  "billowing",
  "broken",
  "cold",
  "damp",
  "falling",
  "frosty",
  "green",
  "long",
  "late",
  "lingering",
  "bold",
  "little",
  "morning",
  "muddy",
  "old",
  "red",
  "rough",
  "still",
  "small",
  "sparkling",
  "wandering",
  "withered",
  "wild",
  "black",
  "young",
  "solitary",
  "fragrant",
  "aged",
  "snowy",
  "proud",
  "floral",
  "restless",
  "divine",
  "polished",
  "ancient",
  "purple",
  "lively",
  "nameless"
];
const nouns = [
  "waterfall",
  "river",
  "breeze",
  "moon",
  "rain",
  "wind",
  "sea",
  "morning",
  "snow",
  "lake",
  "sunset",
  "pine",
  "shadow",
  "leaf",
  "dawn",
  "glitter",
  "forest",
  "hill",
  "cloud",
  "meadow",
  "sun",
  "glade",
  "bird",
  "brook",
  "butterfly",
  "dew",
  "dust",
  "field",
  "fire",
  "flower",
  "firefly",
  "feather",
  "grass",
  "haze",
  "mountain",
  "night",
  "pond",
  "darkness",
  "snowflake",
  "silence",
  "sound",
  "sky",
  "shape",
  "surf",
  "thunder",
  "violet",
  "water",
  "wildflower",
  "wave",
  "water",
  "sun",
  "dream",
  "tree",
  "fog",
  "frost",
  "voice",
  "paper",
  "frog",
  "smoke",
  "star"
];

exports.randomIze = function(upperBound) {
  return Math.floor(Math.random() * upperBound);
};

exports.generateAppName = function() {
  //generate a two-part name
  const adj = adjectives[this.randomIze(adjectives.length)];
  const noun = nouns[this.randomIze(nouns.length)];
  const suffix = this.randomIze(100);
  return `${adj}-${noun}-${suffix}`;
};

exports.passPhrase = function() {
  const a = adjectives[this.randomIze(adjectives.length)];
  const b = nouns[this.randomIze(nouns.length)];
  const c = adjectives[this.randomIze(adjectives.length)];
  const d = nouns[this.randomIze(nouns.length)];

  return `${a} ${b} ${c} ${d} `;
};
