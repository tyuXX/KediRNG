const scriptContainer = document.getElementById("injected");

// Function to load scripts
async function loadScripts() {
  let scriptsToLoad = 0;
  let scriptLoaded = 0;
  try {
    const response = await fetch("autoinject.json?v=" + new Date().getTime());
    const { scripts } = await response.json();
    scriptsToLoad = scripts.length;

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = `${src}?v=${new Date().getTime()}`; // Adding a unique timestamp as a cache-buster
      script.async = false;
      scriptContainer.appendChild(script);
      scriptLoaded++;
    });
  } catch (error) {
    console.error("Failed to load scripts:", error);
  }
  scriptInfo.textContent = `Scripts loaded: ${scriptLoaded} / ${scriptsToLoad}`;
}

loadScripts();
