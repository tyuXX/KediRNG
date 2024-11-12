const scriptContainer = document.getElementById("injected");

async function loadScripts() {
  try {
    const response = await fetch("autoinject.json?v=" + new Date().getTime());
    const { scripts } = await response.json();

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = `${src}?v=${new Date().getTime()}`; // Adding a unique timestamp as a cache-buster
      script.async = false;
      scriptContainer.appendChild(script);
    });
  } catch (error) {
    console.error("Failed to load scripts:", error);
  }
}

loadScripts();
