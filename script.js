document.addEventListener("DOMContentLoaded", function () {
  var viewHub = document.getElementById("view-hub");
  var viewElpis = document.getElementById("view-elpis");
  var viewPandora = document.getElementById("view-pandora");
  var viewReveal = document.getElementById("view-reveal");
  var glitchOverlay = document.getElementById("glitch-overlay");
  var constellationMap = document.getElementById("constellation-map");

  var nodeElpis = document.getElementById("node-elpis");
  var elpisNodeLabel = document.getElementById("elpis-node-label");
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

  var canvas = document.getElementById("space-canvas");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var comets = [];
    var starCount = 140;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (var s = 0; s < starCount; s++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.004
      });
    }

    function spawnComet() {
      var startFromLeft = Math.random() > 0.35;
      comets.push({
        x: startFromLeft ? -50 : Math.random() * canvas.width,
        y: startFromLeft ? Math.random() * (canvas.height * 0.6) : -50,
        vx: Math.random() * 5 + 4.5,
        vy: Math.random() * 2.5 + 1.8,
        length: Math.random() * 90 + 60,
        life: 1
      });
    }

    setInterval(function () {
      if (viewHub && viewHub.classList.contains("active") && Math.random() > 0.35) {
        spawnComet();
      }
    }, 3800);

    function animateSpace() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.x += st.vx;
        st.y += st.vy;
        st.alpha += st.twinkleSpeed;
        if (st.alpha > 0.95 || st.alpha < 0.15) {
          st.twinkleSpeed *= -1;
        }
        if (st.x < 0) st.x = canvas.width;
        if (st.x > canvas.width) st.x = 0;
        if (st.y < 0) st.y = canvas.height;
        if (st.y > canvas.height) st.y = 0;

        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, " + st.alpha.toFixed(2) + ")";
        ctx.fill();
      }

      for (var c = comets.length - 1; c >= 0; c--) {
        var cm = comets[c];
        cm.x += cm.vx;
        cm.y += cm.vy;
        cm.life -= 0.008;

        var grad = ctx.createLinearGradient(
          cm.x,
          cm.y,
          cm.x - cm.vx * (cm.length / 6),
          cm.y - cm.vy * (cm.length / 6)
        );
        grad.addColorStop(0, "rgba(255, 255, 255, " + Math.max(0, cm.life) + ")");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cm.x, cm.y);
        ctx.lineTo(
          cm.x - cm.vx * (cm.length / 6),
          cm.y - cm.vy * (cm.length / 6)
        );
        ctx.stroke();

        if (cm.life <= 0 || cm.x > canvas.width + 150 || cm.y > canvas.height + 150) {
          comets.splice(c, 1);
        }
      }

      requestAnimationFrame(animateSpace);
    }
    animateSpace();
  }

  function triggerGlitch(violentFullPage) {
    if (glitchOverlay) {
      glitchOverlay.classList.remove("flash");
      void glitchOverlay.offsetWidth;
      glitchOverlay.classList.add("flash");
    }
    if (violentFullPage) {
      document.body.classList.remove("full-page-glitch");
      void document.body.offsetWidth;
      document.body.classList.add("full-page-glitch");
    }
  }

  function replayPhraseEntrance() {
    if (!dualityPhrase) return;
    dualityPhrase.classList.remove("cinematic-emerge");
    void dualityPhrase.offsetWidth;
    dualityPhrase.classList.add("cinematic-emerge");
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
      timerTooltip.textContent = "000D : 00H : 00M : 00S";
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

      if (!isLightMode) {
        triggerGlitch(true);
        setTimeout(function () {
          dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-cage" class="interactive-word word-cage">CAGE</span>.';
          replayPhraseEntrance();
          var wordCage = document.getElementById("word-cage");
          if (wordCage) {
            wordCage.addEventListener("click", function () {
              triggerGlitch(false);
              showView(viewPandora);
            });
          }
        }, 260);
      } else {
        triggerGlitch(false);
        dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-key" class="interactive-word word-key">KEY</span>.';
        replayPhraseEntrance();
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
      dualityPhrase.innerHTML = 'ALL WE HAVE IS <span id="word-hope" class="interactive-word hope-angelic">HOPE</span>.';
    }
    replayPhraseEntrance();
    bindPhraseInteractions();
  }

  renderDualityState();

  if (polarityToggle) {
    polarityToggle.addEventListener("change", function (e) {
      isLightMode = Boolean(e.target && e.target.checked);
      triggerGlitch(false);
      renderDualityState();
    });
  }

  if (nodeElpis) {
    nodeElpis.addEventListener("click", function () {
      if (constellationMap) {
        constellationMap.classList.add("warp-dive");
      }
      setTimeout(function () {
        isLightMode = false;
        if (polarityToggle) {
          polarityToggle.checked = false;
        }
        renderDualityState();
        showView(viewElpis);
        if (constellationMap) {
          constellationMap.classList.remove("warp-dive");
        }
      }, 1050);
    });
  }

  if (backToHub) {
    backToHub.addEventListener("click", function () {
      document.body.classList.remove("state-light");
      triggerGlitch(false);
      showView(viewHub);
    });
  }

  if (backFromPandora) {
    backFromPandora.addEventListener("click", function () {
      triggerGlitch(false);
      showView(viewElpis);
    });
  }

  if (backFromReveal) {
    backFromReveal.addEventListener("click", function () {
      document.body.classList.remove("state-light");
      triggerGlitch(false);
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
        if (elpisNodeLabel) {
          elpisNodeLabel.textContent = "I // ELPIS";
        }
        passwordFeedback.style.color = "#ffffff";
        passwordFeedback.textContent = "ACCESS GRANTED";
        setTimeout(function () {
          keyModal.classList.add("hidden");
          document.body.classList.remove("state-light");
          triggerGlitch(true);
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
