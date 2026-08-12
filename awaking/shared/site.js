(() => {
  const versionTargets = document.querySelectorAll("[data-app-version]");
  const yearTargets = document.querySelectorAll("[data-current-year]");

  yearTargets.forEach((target) => {
    target.textContent = String(new Date().getFullYear());
  });

  if (versionTargets.length === 0) {
    return;
  }

  const isEnglish = document.documentElement.lang.startsWith("en");
  const fallback = isEnglish ? "Available on the App Store" : "已在 App Store 上线";
  versionTargets.forEach((target) => {
    target.textContent = fallback;
  });

  const callbackName = `awakingAppStoreLookup_${Date.now()}`;
  const lookupScript = document.createElement("script");
  const cleanup = () => {
    delete window[callbackName];
    lookupScript.remove();
  };

  window[callbackName] = (payload) => {
    const version = payload?.results?.[0]?.version;
    if (version) {
      const text = isEnglish ? `Latest App Store version: ${version}` : `App Store 最新版本：${version}`;
      versionTargets.forEach((target) => {
        target.textContent = text;
      });
    }
    cleanup();
  };

  lookupScript.src = `https://itunes.apple.com/lookup?id=6760924133&country=cn&callback=${callbackName}`;
  lookupScript.async = true;
  lookupScript.onerror = cleanup;
  document.head.append(lookupScript);
})();
