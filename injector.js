// Function to load scripts
async function loadScripts() {
  let scriptsToLoad = 0;
  let scriptLoaded = 0;
  try {
    const response = await fetch("autoinject.json?v=" + new Date().getTime());
    const { scripts } = await response.json();
    scriptsToLoad = scripts.length;

    scripts.forEach((script) => {
      DDCInjector.injectScript(
        script.src,
        script.src,
        false,
        script.module,
        () => {
          scriptLoaded++;
          scriptInfo.textContent = `Scripts loaded: ${scriptLoaded} / ${scriptsToLoad}`;
        }
      )
    });
  } catch (error) {
    console.error("Failed to load scripts:", error);
  }
}

loadScripts();
