(function () {
  "use strict";

  var FALLBACK = {
    product_name: "ImageActionBot",
    version: "1.0.0",
    file_name: "ImageActionBot_Setup.exe",
    download_url: "https://pub-7df420d78ae8472e9817557d4ae9fd10.r2.dev/ImageActionBot_Setup.exe",
    last_updated: "2026-04-02"
  };

  function setText(selector, value) {
    if (!value) return;
    var nodes = document.querySelectorAll(selector);
    nodes.forEach(function (el) {
      el.textContent = value;
    });
  }

  function setDownloadLinks(url) {
    if (!url) return;
    var links = document.querySelectorAll("[data-download-link]");
    links.forEach(function (link) {
      link.setAttribute("href", url);
    });
    setText("[data-download-link-text]", url);
  }

  function applyReleaseData(data) {
    var release = Object.assign({}, FALLBACK, data || {});
    setDownloadLinks(release.download_url);
    setText("[data-download-version]", release.version);
    setText("[data-download-date]", release.last_updated);
    setText("[data-download-filename]", release.file_name);
    setText("[data-download-product]", release.product_name);
  }

  function init() {
    applyReleaseData(FALLBACK);
    fetch("./download.json", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to read download.json");
        }
        return response.json();
      })
      .then(function (json) {
        applyReleaseData(json);
      })
      .catch(function () {
        // Keep fallback data active when JSON is unavailable.
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
