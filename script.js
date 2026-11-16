document.addEventListener("DOMContentLoaded", function () {
  var viewHub = document.getElementById("view-hub");
  var viewElpis = document.getElementById("view-elpis");
  var viewPandora = document.getElementById("view-pandora");
  var viewReveal = document.getElementById("view-reveal");
  var glitchOverlay = document.getElementById("glitch-overlay");

  var nodeElpis = document.getElementById("node-elpis");
  var backToHub = document.getElementById("back-to-hub");
  var backFromPandora = document.getElementById("back-from-pandora");
  var backFromReveal = document.getElementById("back-from-reveal");

  var polarityToggle = document.getElementById("polarity-toggle");
  var dualityPhrase = document.getElementById("duality-phrase");

  var keyModal = document.getElementById("key-modal");
  var closeModal = document.getElementById("close-modal");
  var passwordForm = document.getElementById("password-form");
  var passwordInput = document.getElementById("password-input");
  var passwordFeedback = document.getElementById("password-feedback");
  var timerTooltip = document.getElementById("elpis-timer-tooltip");

  var isLightMode = false;
  var hasMutatedPhrase = false;

  function triggerGlitch() {
    if (!glitchOverlay) return;
    glitchOverlay.classList.remove("flash");
    void glitchOverlay.offsetWidth;
    glitchOverlay.classList.add("flash");
  }

  function showView(targetView) {
    var views = [viewHub, viewElpis, viewPandora, viewReveal];
    for (var i = 0; i < views.length; i++) {
      if (views[i]) {
        views[i].classList.remove("active");
      }
    }
    if (targetView) {
      targetView.classList.add("active");
    }
  }

  function padZero(num, size) {
    var s = String(num);
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
  }

  var targetDate = new Date("2027-01-01T00:00:00Z").getTime();

  function updateCountdown() {
    if (!timerTooltip) return;
    var now = Date.now();
    var diff = targetDate - now;

    if (diff <= 0) {
      timerTooltip.textContent = "00D : 00H : 00M : 00S";
      return;
    }

    var days = padZero(Math.floor(diff / (1000 * 60 * 60 * 24)), 3);
    var hours = padZero(Math.floor((diff / (1000 * 60 * 60)) % 24), 2);
    var mins = padZero(Math.floor((diff / 1000 / 60) % 60), 2);
    var secs = padZero(Math.floor((diff / 1000) % 60), 2);

    timerTooltip.textContent = days + "D : " + hours + "H : " + mins + "M : " + secs + "S";
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  function bindPhraseInteractions() {
    var wordHope = document.getElementById("word-hope");
    if (!wordHope || !dualityPhrase) return;

    wordHope.addEventListener("click", function () {
      if (hasMutatedPhrase) return;
      hasMutatedPhrase = true;
      triggerGlitch();

      if (!isLightMode) {
        dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-cage" class="interactive-word word-cage">CAGE</span>.';
        var wordCage = document.getElementById("word-cage");
        if (wordCage) {
          wordCage.addEventListener("click", function () {
            triggerGlitch();
            showView(viewPandora);
          });
        }
      } else {
        dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-key" class="interactive-word word-key">KEY</span>.';
        var wordKey = document.getElementById("word-key");
        if (wordKey && keyModal && passwordInput && passwordFeedback) {
          wordKey.addEventListener("click", function () {
            passwordInput.value = "";
            passwordFeedback.textContent = "";
            keyModal.classList.remove("hidden");
            passwordInput.focus();
          });
        }
      }
    });
  }

  function renderDualityState() {
    if (!dualityPhrase) return;
    hasMutatedPhrase = false;

    if (!isLightMode) {
      document.body.classList.remove("state-light");
      dualityPhrase.innerHTML = 'ALL <span id="word-hope" class="interactive-word hope-glitch">HOPE</span> IS GONE.';
    } else {
      document.body.classList.add("state-light");
      dualityPhrase.innerHTML = 'ALL WE HAVE IS <span id="word-hope" class="interactive-word">HOPE</span>.';
    }
    bindPhraseInteractions();
  }

  renderDualityState();

  if (polarityToggle) {
    polarityToggle.addEventListener("change", function (e) {
      isLightMode = Boolean(e.target && e.target.checked);
      triggerGlitch();
      renderDualityState();
    });
  }

  if (nodeElpis) {
    nodeElpis.addEventListener("click", function () {
      triggerGlitch();
      isLightMode = false;
      if (polarityToggle) {
        polarityToggle.checked = false;
      }
      renderDualityState();
      showView(viewElpis);
    });
  }

  if (backToHub) {
    backToHub.addEventListener("click", function () {
      document.body.classList.remove("state-light");
      triggerGlitch();
      showView(viewHub);
    });
  }

  if (backFromPandora) {
    backFromPandora.addEventListener("click", function () {
      triggerGlitch();
      showView(viewElpis);
    });
  }

  if (backFromReveal) {
    backFromReveal.addEventListener("click", function () {
      document.body.classList.remove("state-light");
      triggerGlitch();
      showView(viewHub);
    });
  }

  if (closeModal && keyModal) {
    closeModal.addEventListener("click", function () {
      keyModal.classList.add("hidden");
    });
  }

  if (passwordForm && passwordInput && passwordFeedback && keyModal) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var guess = passwordInput.value.trim().toUpperCase();

      if (guess === "PANDORA") {
        passwordFeedback.style.color = "#ffffff";
        passwordFeedback.textContent = "ACCESS GRANTED";
        setTimeout(function () {
          keyModal.classList.add("hidden");
          document.body.classList.remove("state-light");
          triggerGlitch();
          showView(viewReveal);
        }, 950);
      } else {
        passwordFeedback.style.color = "#888888";
        passwordFeedback.textContent = "ACCESS DENIED";
        passwordInput.value = "";
      }
    });
  }
});
