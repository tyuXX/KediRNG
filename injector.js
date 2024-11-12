const scriptContainer = document.getElementById("injected");
const scripts = [
    "modules/defaults.js",
    "modules/settings.js",
    "modules/version.js",
    "modules/game.js",
    "modules/text.js",
    "modules/notifications.js",
    "modules/leveling.js",
    "modules/achivement.js",
    "modules/stats.js",
    "modules/upgrades.js",
    "script.js",
    "https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js",
    "modules/gamestate.js",
];

scripts.forEach(src => {
    const script = document.createElement("script");
    script.src = `${src}?v=${new Date().getTime()}`;  // Adding a unique timestamp as a cache-buster
    script.async = false;
    scriptContainer.appendChild(script);
});

