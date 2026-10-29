(function () {
  "use strict";

  var entries = Array.prototype.slice.call(document.querySelectorAll("#entries .entry"));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var countEl = document.getElementById("count");

  var labels = {
    all: "all work",
    journalism: "journalism",
    teaching: "teaching",
    graduate: "graduate study",
    editing: "editing and publishing"
  };

  // Show only entries matching the chosen interest; keep every filter button in sync.
  function applyFilter(name) {
    var shown = 0;
    entries.forEach(function (entry) {
      var match = name === "all" || entry.getAttribute("data-tags").split(" ").indexOf(name) !== -1;
      entry.hidden = !match;
      if (match) shown++;
    });
    filterButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-filter") === name));
    });
    countEl.textContent = "Showing " + shown + " of " + entries.length + " pieces for " + labels[name] + ".";
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-filter");
      applyFilter(name);
      // Hero buttons jump to the writing list so the result is visible.
      if (btn.closest(".paths")) {
        document.getElementById("writing").scrollIntoView();
        document.getElementById("writing-h").setAttribute("tabindex", "-1");
        document.getElementById("writing-h").focus({ preventScroll: true });
      }
    });
  });

  applyFilter("all");

  // CV preview: load the PDF only when asked, so the page stays fast.
  var cvToggle = document.getElementById("cv-toggle");
  var cvPreview = document.getElementById("cv-preview");
  if (cvToggle && cvPreview) {
    cvToggle.addEventListener("click", function () {
      var opening = cvPreview.hidden;
      cvPreview.hidden = !opening;
      cvToggle.setAttribute("aria-expanded", String(opening));
      cvToggle.textContent = opening ? "Hide preview" : "Preview in browser";
      var frame = cvPreview.querySelector("iframe");
      if (opening && !frame.getAttribute("src")) {
        frame.setAttribute("src", frame.getAttribute("data-src"));
      }
    });
  }

  // Copy email address
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  var emailLink = document.getElementById("email-link");
  if (copyBtn && emailLink) {
    copyBtn.addEventListener("click", function () {
      var address = emailLink.textContent.trim();
      function done(message) {
        copyStatus.textContent = message;
        setTimeout(function () { copyStatus.textContent = ""; }, 3000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(
          function () { done("Email address copied."); },
          function () { done("Copy failed. Select the address and copy it manually."); }
        );
      } else {
        done("Copy is not supported here. Select the address and copy it manually.");
      }
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) { year.textContent = new Date().getFullYear(); }
})();
