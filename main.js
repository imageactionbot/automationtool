(function () {
  "use strict";

  var FALLBACK = {
    product_name: "imageactionbot",
    version: "1.0.0",
    file_name: "imageactionbot_setup.exe",
    download_url: "https://pub-7df420d78ae8472e9817557d4ae9fd10.r2.dev/ImageActionBot_Setup.exe",
    last_updated: "2026-04-03"
  };
  var currentRelease = Object.assign({}, FALLBACK);
  var hasBoundDownloadHandler = false;

  function setText(selector, value) {
    if (!value) return;
    var nodes = document.querySelectorAll(selector);
    nodes.forEach(function (el) {
      el.textContent = value;
    });
  }

  function setDownloadLinks(url, fileName) {
    if (!url) return;
    var links = document.querySelectorAll(".js-download-link, [data-download-link]");
    links.forEach(function (link) {
      link.setAttribute("href", url);
      if (fileName) {
        // Ask browser to keep a stable installer filename where supported.
        link.setAttribute("download", fileName);
      }
      if (!link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
      }
      if (!link.getAttribute("rel")) {
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
    setText("[data-download-link-text]", url);
  }

  function syncJsonLdReleaseMetadata(release) {
    var scripts = document.querySelectorAll('script[type="application/ld+json"][data-release-jsonld]');
    scripts.forEach(function (script) {
      try {
        var data = JSON.parse(script.textContent);
        if (data && typeof data === "object") {
          if (Object.prototype.hasOwnProperty.call(data, "dateModified")) {
            data.dateModified = release.last_updated;
          }
          if (Object.prototype.hasOwnProperty.call(data, "softwareVersion")) {
            data.softwareVersion = release.version;
          }
          script.textContent = JSON.stringify(data, null, 2);
        }
      } catch (error) {
        // Ignore invalid JSON-LD blocks and keep original markup.
      }
    });
  }

  function applyReleaseData(data) {
    var release = Object.assign({}, FALLBACK, data || {});
    currentRelease = release;
    setDownloadLinks(release.download_url, release.file_name);
    setText("[data-download-version]", release.version);
    setText("[data-release-version]", release.version);
    setText("[data-download-date]", release.last_updated);
    setText("[data-release-date]", release.last_updated);
    setText("[data-download-filename]", release.file_name);
    setText("[data-download-product]", release.product_name);
    syncJsonLdReleaseMetadata(release);
  }

  function forceDownload(url, fileName) {
    return fetch(url, { mode: "cors", cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Download fetch failed");
        }
        return response.blob();
      })
      .then(function (blob) {
        var objectUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = objectUrl;
        link.download = fileName || "imageactionbot_setup.exe";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      });
  }

  function bindDownloadHandlers() {
    if (hasBoundDownloadHandler) return;
    hasBoundDownloadHandler = true;
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      var link = target.closest(".js-download-link, [data-download-link]");
      if (!link) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var href = link.getAttribute("href") || "";
      if (!href || href === "#") return;
      event.preventDefault();
      var fileName = link.getAttribute("download") || currentRelease.file_name || "imageactionbot_setup.exe";
      forceDownload(href, fileName).catch(function () {
        // Cross-origin/CORS or blocked fetch: use direct link fallback.
        window.open(href, "_blank", "noopener,noreferrer");
      });
    });
  }

  function setupMobileMenus() {
    var wraps = document.querySelectorAll(".site-header .nav-wrap");
    wraps.forEach(function (wrap, index) {
      var nav = wrap.querySelector(".nav");
      if (!nav || wrap.querySelector(".nav-toggle")) return;
      var navId = nav.getAttribute("id") || ("site-nav-" + (index + 1));
      nav.setAttribute("id", navId);
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-toggle";
      toggle.setAttribute("aria-controls", navId);
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Toggle navigation menu");
      toggle.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';
      wrap.insertBefore(toggle, nav);
      function closeMenu() {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.addEventListener("click", function (event) {
        var target = event.target;
        if (!target || typeof target.closest !== "function") return;
        var link = target.closest("a");
        if (!link) return;
        closeMenu();
      });
      document.addEventListener("click", function (event) {
        if (!wrap.contains(event.target)) {
          closeMenu();
        }
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
      });
      window.addEventListener("resize", function () {
        if (window.innerWidth > 640) closeMenu();
      });
    });
  }

  function fetchJson(path) {
    return fetch(path, { cache: "no-store" }).then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to read " + path);
      }
      return response.json();
    });
  }

  function loadReleaseData() {
    return fetchJson("./download.json");
  }

  function init() {
    applyReleaseData(FALLBACK);
    setupMobileMenus();
    bindDownloadHandlers();
    loadReleaseData()
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
