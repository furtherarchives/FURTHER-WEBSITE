document.addEventListener("DOMContentLoaded", function () {
  var viewHub = document.getElementById("view-hub");
  var viewElpis = document.getElementById("view-elpis");
  var viewPandora = document.getElementById("view-pandora");
  var viewReveal = document.getElementById("view-reveal");
  var glitchOverlay = document.getElementById("glitch-overlay");
  var constellationMap = document.getElementById("constellation-map");
  var radioToggle = document.getElementById("radio-toggle");
  var radioStatus = document.getElementById("radio-status");
  var nodeBlackhole = document.getElementById("node-blackhole");
  var nodeElpis = document.getElementById("node-elpis");
  var nodeDormant1 = document.getElementById("node-dormant-1");
  var nodeDormant2 = document.getElementById("node-dormant-2");
  var elpisNodeLabel = document.getElementById("elpis-node-label");
  var backToHub = document.getElementById("back-to-hub");
  var backFromPandora = document.getElementById("back-from-pandora");
  var backFromReveal = document.getElementById("back-from-reveal");
  var polarityToggle = document.getElementById("polarity-toggle");
  var dualityPhrase = document.getElementById("duality-phrase");
  var pandoraBoxTrigger = document.getElementById("pandora-box-trigger");
  var loreModal = document.getElementById("lore-modal");
  var closeLoreModal = document.getElementById("close-lore-modal");
  var keyModal = document.getElementById("key-modal");
  var closeModal = document.getElementById("close-modal");
  var passwordForm = document.getElementById("password-form");
  var passwordInput = document.getElementById("password-input");
  var passwordFeedback = document.getElementById("password-feedback");
  var timerTooltip = document.getElementById("elpis-timer-tooltip");

  /* FRAGMENT ARCHIVE STATE & LOGIC */
  var unlockedFragments = {
    1: true,  // Pandora's Box unlocked by default
    2: false, // Spirit Box locked initially
    3: false, // Titanium Bands locked
    4: false, // Basalt Hands locked
    5: false  // Burned Polaroid locked
  };

  function updateArchiveUI() {
    for (var id = 1; id <= 5; id++) {
      var card = document.querySelector('.fragment-card[data-fragment="' + id + '"]');
      if (!card) continue;
      var statusEl = card.querySelector('.fragment-status');
      if (unlockedFragments[id]) {
        card.classList.remove("locked");
        card.classList.add("unlocked");
        if (statusEl) {
          statusEl.textContent = "UNLOCKED";
          statusEl.style.color = "#a8f5a8";
        }
      } else {
        card.classList.remove("unlocked");
        card.classList.add("locked");
        if (statusEl) {
          statusEl.textContent = "LOCKED // [?]";
          statusEl.style.color = "#ff6b6b";
        }
      }
    }
  }

  updateArchiveUI();

  /* ORIGIN ARCHIVE MODAL & BLACK HOLE CLICK */
  var originArchiveModal = document.getElementById("origin-archive-modal");
  var closeArchiveModal = document.getElementById("close-archive-modal");
  var fragmentCards = document.querySelectorAll(".fragment-card");
  var fragmentViewer = document.getElementById("fragment-viewer");
  var viewerTitle = document.getElementById("viewer-title");
  var viewerText = document.getElementById("viewer-text");
  var closeViewer = document.getElementById("close-viewer");
  var blackHoleTrigger = document.querySelector(".black-hole") || nodeBlackhole;

  if (blackHoleTrigger && originArchiveModal) {
    blackHoleTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      originArchiveModal.classList.remove("hidden");
    });
  }

  if (closeArchiveModal && originArchiveModal) {
    closeArchiveModal.addEventListener("click", function () {
      originArchiveModal.classList.add("hidden");
      if (fragmentViewer) fragmentViewer.classList.add("hidden");
    });
  }

  for (var f = 0; f < fragmentCards.length; f++) {
    fragmentCards[f].addEventListener("click", function () {
      var fragId = parseInt(this.getAttribute("data-fragment"), 10);
      if (!unlockedFragments[fragId]) {
        if (viewerTitle && viewerText && fragmentViewer) {
          viewerTitle.textContent = "RESTRICTED // ANOMALY UNVERIFIED";
          viewerText.textContent = "This artifact has not yet been recovered. Explore the system, decode transmissions, or interact with environmental nodes to discover its location.";
          var actionContainer = document.getElementById("viewer-action-container");
          if (actionContainer) actionContainer.style.display = "none";
          fragmentViewer.classList.remove("hidden");
        }
        return;
      }
      var lore = fragmentLoreData[fragId];
      if (lore && viewerTitle && viewerText && fragmentViewer) {
        viewerTitle.textContent = lore.title;
        viewerText.textContent = lore.text;
        var actionContainer = document.getElementById("viewer-action-container");
        if (actionContainer) actionContainer.style.display = "none";
        fragmentViewer.classList.remove("hidden");
      }
    });
  }

  if (closeViewer && fragmentViewer) {
    closeViewer.addEventListener("click", function () {
      fragmentViewer.classList.add("hidden");
    });
  }

  /* TERMINAL SIDE DRAWER CONTROLS */
  var terminalToggle = document.getElementById("terminal-toggle");
  var terminalDrawer = document.getElementById("terminal-drawer");
  var terminalClose = document.getElementById("terminal-close");
  var termTabBtns = document.querySelectorAll(".term-tab-btn");
  var termPanels = document.querySelectorAll(".term-panel");

  if (terminalToggle && terminalDrawer) {
    terminalToggle.addEventListener("click", function () {
      terminalDrawer.classList.toggle("open");
    });
  }

  if (terminalClose && terminalDrawer) {
    terminalClose.addEventListener("click", function () {
      terminalDrawer.classList.remove("open");
    });
  }

  for (var t = 0; t < termTabBtns.length; t++) {
    termTabBtns[t].addEventListener("click", function () {
      var targetId = this.getAttribute("data-target");
      for (var i = 0; i < termTabBtns.length; i++) {
        termTabBtns[i].classList.remove("active");
      }
      for (var j = 0; j < termPanels.length; j++) {
        termPanels[j].classList.remove("active");
      }
      this.classList.add("active");
      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  }

  /* AUDIO ELEMENTS */
  var audioHomepage = document.getElementById("audio-homepage");
  var audioSwitchNoise = document.getElementById("audio-switch-noise");
  var audioWarp = document.getElementById("audio-warp");
  var audioHopeGone = document.getElementById("audio-hope-gone");
  var audioHopeHave = document.getElementById("audio-hope-have");
  var audioSideA = document.getElementById("audio-side-a");
  var audioSideB = document.getElementById("audio-side-b");
  var zoneSideA = document.getElementById("zone-side-a");
  var zoneSideB = document.getElementById("zone-side-b");
  var isLightMode = false;
  var hasMutatedPhrase = false;
  var radioEnabled = false;

  /* WEEKLY TRACKLIST REVEAL DATA */
  var weeklyTracks = [
    { letter: "E", label: "TRANSMISSION 01 // SIDE A", title: "[ ENCRYPTED // WEEK 01 ]" },
    { letter: "L", label: "TRANSMISSION 02 // SIDE A", title: "[ ENCRYPTED // WEEK 02 ]" },
    { letter: "P", label: "TRANSMISSION 03 // INTERLUDE", title: "[ ENCRYPTED // WEEK 03 ]" },
    { letter: "I", label: "TRANSMISSION 04 // SIDE B", title: "[ ENCRYPTED // WEEK 04 ]" },
    { letter: "S", label: "TRANSMISSION 05 // SIDE B", title: "[ ENCRYPTED // WEEK 05 ]" }
  ];

  /* SYNCHRONIZE AUDIO & COMMS */
  function syncBackgroundComms() {
    var onHub = viewHub && viewHub.classList.contains("active");
    var onElpis = viewElpis && viewElpis.classList.contains("active");
    if (radioEnabled) {
      if (onHub) {
        if (audioHopeGone) audioHopeGone.pause();
        if (audioHopeHave) audioHopeHave.pause();
        if (audioHomepage && audioHomepage.readyState >= 2) {
          audioHomepage.volume = 0.65;
          audioHomepage.play().catch(function () {});
        }
      } else if (onElpis) {
        if (audioHomepage) audioHomepage.pause();
        stopBlackHoleStatic();
        if (!isLightMode) {
          if (audioHopeHave) audioHopeHave.pause();
          if (audioHopeGone && audioHopeGone.readyState >= 2) {
            audioHopeGone.volume = 0.7;
            audioHopeGone.play().catch(function () {});
          }
        } else {
          if (audioHopeGone) audioHopeGone.pause();
          if (audioHopeHave && audioHopeHave.readyState >= 2) {
            audioHopeHave.volume = 0.7;
            audioHopeHave.play().catch(function () {});
          }
        }
      } else {
        if (audioHomepage) audioHomepage.pause();
        if (audioHopeGone) audioHopeGone.pause();
        if (audioHopeHave) audioHopeHave.pause();
      }
    } else {
      if (audioHomepage) audioHomepage.pause();
      if (audioHopeGone) audioHopeGone.pause();
      if (audioHopeHave) audioHopeHave.pause();
      stopBlackHoleStatic();
    }
  }

  if (radioToggle) {
    radioToggle.addEventListener("click", function () {
      radioEnabled = !radioEnabled;
      if (radioEnabled) {
        radioToggle.classList.add("active");
        if (radioStatus) radioStatus.textContent = "ON";
      } else {
        radioToggle.classList.remove("active");
        if (radioStatus) radioStatus.textContent = "OFF";
        stopBlackHoleStatic();
      }
      syncBackgroundComms();
    });
  }

  /* BLACK HOLE RADIO STATIC */
  var audioCtx = null;
  var staticNode = null;
  var staticGain = null;

  function startBlackHoleStatic() {
    if (!radioEnabled) return;
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    if (staticNode) return;
    var bufferSize = audioCtx.sampleRate * 2;
    var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }
    staticNode = audioCtx.createBufferSource();
    staticNode.buffer = buffer;
    staticNode.loop = true;
    var filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    staticGain = audioCtx.createGain();
    staticGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    staticGain.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.25);
    staticNode.connect(filter);
    filter.connect(staticGain);
    staticGain.connect(audioCtx.destination);
    staticNode.start();
  }

  function stopBlackHoleStatic() {
    if (staticNode) {
      try {
        staticNode.stop();
        staticNode.disconnect();
      } catch (e) {}
      staticNode = null;
    }
    staticGain = null;
  }

  if (nodeBlackhole) {
    nodeBlackhole.addEventListener("mouseenter", startBlackHoleStatic);
    nodeBlackhole.addEventListener("mouseleave", stopBlackHoleStatic);
  }

  function playWarpAudio() {
    if (!radioEnabled) return;
    if (audioWarp && audioWarp.readyState >= 2) {
      audioWarp.currentTime = 0;
      audioWarp.play().catch(function () {});
    }
  }

  function playSwitchNoise() {
    if (!radioEnabled) return;
    if (audioSwitchNoise && audioSwitchNoise.readyState >= 2) {
      audioSwitchNoise.currentTime = 0;
      audioSwitchNoise.play().catch(function () {});
    }
  }

  /* GLITCH & VIEW MANAGEMENT */
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
    syncBackgroundComms();
  }

  /* DUALITY CHAMBER LOGIC */
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
    syncBackgroundComms();
  }

  if (polarityToggle) {
    polarityToggle.addEventListener("change", function () {
      isLightMode = polarityToggle.checked;
      playSwitchNoise();
      triggerGlitch(false);
      renderDualityState();
    });
  }

  if (dualityPhrase) {
    dualityPhrase.addEventListener("click", function (e) {
      var target = e.target;
      var clickedId = target ? target.id : "";
      if (clickedId === "word-hope" && !hasMutatedPhrase) {
        hasMutatedPhrase = true;
        if (!isLightMode) {
          triggerGlitch(true);
          setTimeout(function () {
            dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-cage" class="interactive-word word-cage">CAGE</span>.';
            replayPhraseEntrance();
          }, 260);
        } else {
          triggerGlitch(false);
          dualityPhrase.innerHTML = 'HOPE IS THE <span id="word-key" class="interactive-word word-key">KEY</span>.';
          replayPhraseEntrance();
        }
        return;
      }
      if (clickedId === "word-cage") {
        triggerGlitch(false);
        showView(viewPandora);
        return;
      }
      if (clickedId === "word-key") {
        if (keyModal && passwordInput && passwordFeedback) {
          passwordInput.value = "";
          passwordFeedback.textContent = "";
          keyModal.classList.remove("hidden");
          passwordInput.focus();
        }
      }
    });
  }

  renderDualityState();

  /* COUNTDOWN TIMER (01 JAN 2027) */
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

  /* 3D CONSTELLATION & DIRECT VIEW-HUB DRAG ENGINE */
  var canvas = document.getElementById("space-canvas");
  var rotX = 0.18;
  var rotY = -0.25;
  var velX = 0;
  var velY = 0.0012;
  var isDragging = false;
  var dragMoved = false;
  var lastMouseX = 0;
  var lastMouseY = 0;
  var nodes3D = [
    { id: "origin", el: nodeBlackhole, x: 0, y: 0, z: 0, baseOpacity: 1 },
    { id: "elpis", el: nodeElpis, x: 210, y: -95, z: 95, baseOpacity: 1 },
    { id: "dormant1", el: nodeDormant1, x: -200, y: 105, z: -110, baseOpacity: 0.32 },
    { id: "dormant2", el: nodeDormant2, x: 140, y: 125, z: -145, baseOpacity: 0.28 },
    { id: "ghost1", el: null, x: -130, y: -140, z: 120, baseOpacity: 0.4 },
    { id: "ghost2", el: null, x: -260, y: -30, z: -60, baseOpacity: 0.3 }
  ];
  var edges3D = [
    { from: 0, to: 1, active: true },
    { from: 0, to: 2, active: false },
    { from: 1, to: 3, active: false },
    { from: 0, to: 4, active: false },
    { from: 2, to: 5, active: false }
  ];

  /* DIRECT DRAG LISTENERS ON VIEW-HUB */
  if (viewHub) {
    viewHub.addEventListener("mousedown", function (e) {
      if (e.target.closest("#radio-toggle") || e.target.closest(".node")) return;
      isDragging = true;
      dragMoved = false;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      viewHub.classList.add("dragging");
    });
    viewHub.addEventListener("touchstart", function (e) {
      if (e.target.closest("#radio-toggle") || e.target.closest(".node")) return;
      if (e.touches && e.touches.length === 1) {
        isDragging = true;
        dragMoved = false;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        viewHub.classList.add("dragging");
      }
    }, { passive: true });
  }

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    var dx = e.clientX - lastMouseX;
    var dy = e.clientY - lastMouseY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragMoved = true;
    }
    velY = dx * 0.0055;
    velX = -dy * 0.0055;
    rotY += velY;
    rotX += velX;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener("touchmove", function (e) {
    if (!isDragging || !e.touches || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - lastMouseX;
    var dy = e.touches[0].clientY - lastMouseY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragMoved = true;
    }
    velY = dx * 0.006;
    velX = -dy * 0.006;
    rotY += velY;
    rotX += velX;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      if (viewHub) viewHub.classList.remove("dragging");
    }
  });

  window.addEventListener("touchend", function () {
    if (isDragging) {
      isDragging = false;
      if (viewHub) viewHub.classList.remove("dragging");
    }
  });

  function project3D(x, y, z, cx, cy, fov) {
    var cosY = Math.cos(rotY);
    var sinY = Math.sin(rotY);
    var x1 = x * cosY - z * sinY;
    var z1 = z * cosY + x * sinY;
    var cosX = Math.cos(rotX);
    var sinX = Math.sin(rotX);
    var y2 = y * cosX - z1 * sinX;
    var z2 = z1 * cosX + y * sinX;
    var depth = Math.max(120, fov + z2);
    var scale = fov / depth;
    return {
      sx: cx + x1 * scale,
      sy: cy + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  if (canvas) {
    var ctx = canvas.getContext("2d");
    var bgStars = [];
    var comets = [];
    var starCount = 180;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    for (var s = 0; s < starCount; s++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(Math.random() * 2 - 1);
      var radius = 500 + Math.random() * 650;
      bgStars.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        r: Math.random() * 1.4 + 0.35,
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
      if (!isDragging) {
        rotY += velY;
        rotX += velX;
        velX *= 0.94;
        velY = velY * 0.95 + 0.0012 * 0.05;
      }
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
      var cx = canvas.width / 2;
      var cy = canvas.height / 2;
      var fov = Math.min(canvas.width, canvas.height) * 0.85;

      for (var i = 0; i < bgStars.length; i++) {
        var st = bgStars[i];
        st.alpha += st.twinkleSpeed;
        if (st.alpha > 0.95 || st.alpha < 0.15) {
          st.twinkleSpeed *= -1;
        }
        var pStar = project3D(st.x, st.y, st.z, cx, cy, fov);
        if (pStar.z > -fov * 0.8) {
          ctx.beginPath();
          ctx.arc(pStar.sx, pStar.sy, Math.max(0.4, st.r * pStar.scale), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255," + st.alpha.toFixed(2) + ")";
          ctx.fill();
        }
      }

      for (var c = comets.length - 1; c >= 0; c--) {
        var cm = comets[c];
        cm.x += cm.vx;
        cm.y += cm.vy;
        cm.life -= 0.008;
        var grad = ctx.createLinearGradient(
          cm.x, cm.y,
          cm.x - cm.vx * (cm.length / 6),
          cm.y - cm.vy * (cm.length / 6)
        );
        grad.addColorStop(0, "rgba(255, 255, 255," + Math.max(0, cm.life) + ")");
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

      var projected = [];
      for (var n = 0; n < nodes3D.length; n++) {
        var nd = nodes3D[n];
        var pr = project3D(nd.x, nd.y, nd.z, cx, cy, fov);
        projected.push(pr);
        if (nd.el) {
          var depthFade = Math.max(0.25, Math.min(1.15, pr.scale));
          nd.el.style.transform = "translate3d(" + pr.sx.toFixed(1) + "px, " + pr.sy.toFixed(1) + "px, 0) translate(-50%, -50%) scale(" + pr.scale.toFixed(3) + ")";
          nd.el.style.opacity = (nd.baseOpacity * depthFade).toFixed(2);
          nd.el.style.zIndex = String(Math.round(500 + pr.z));
        } else {
          ctx.beginPath();
          ctx.arc(pr.sx, pr.sy, Math.max(0.8, 2 * pr.scale), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.fill();
        }
      }

      for (var e = 0; e < edges3D.length; e++) {
        var edge = edges3D[e];
        var pA = projected[edge.from];
        var pB = projected[edge.to];
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(pA.sx, pA.sy);
        ctx.lineTo(pB.sx, pB.sy);
        ctx.strokeStyle = edge.active ? "rgba(255, 255, 255, 0.28)" : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    requestAnimationFrame(animateSpace);
    setInterval(animateSpace, 16);
  }

  /* PLANET WARP TRANSITION & NAVIGATION */
  if (nodeElpis) {
    nodeElpis.addEventListener("click", function (e) {
      if (dragMoved) {
        e.preventDefault();
        return;
      }
      stopBlackHoleStatic();
      playWarpAudio();
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
      if (audioSideA) audioSideA.pause();
      if (audioSideB) audioSideB.pause();
      triggerGlitch(false);
      showView(viewHub);
    });
  }

  /* PANDORA'S BOX LORE */
  if (pandoraBoxTrigger && loreModal) {
    pandoraBoxTrigger.addEventListener("click", function () {
      triggerGlitch(false);
      loreModal.classList.remove("hidden");
    });
  }

  if (closeLoreModal && loreModal) {
    closeLoreModal.addEventListener("click", function () {
      loreModal.classList.add("hidden");
    });
  }

  /* PASSWORD MODAL & REVEAL */
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

  /* REVEAL PAGE TRACKS */
  var revealChars = document.querySelectorAll(".reveal-char");
  var trackSlotLabel = document.getElementById("track-slot-label");
  var trackTitleDisplay = document.getElementById("track-title-display");

  for (var r = 0; r < revealChars.length; r++) {
    revealChars[r].addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-index"), 10);
      var track = weeklyTracks[idx];
      if (!track) return;
      for (var j = 0; j < revealChars.length; j++) {
        revealChars[j].classList.remove("selected");
      }
      this.classList.add("selected");
      triggerGlitch(false);
      if (trackSlotLabel) trackSlotLabel.textContent = track.label;
      if (trackTitleDisplay) trackTitleDisplay.textContent = track.title;
    });
  }

  if (zoneSideA && audioSideA) {
    zoneSideA.addEventListener("mouseenter", function () {
      if (radioEnabled && audioSideA.readyState >= 2) {
        audioSideA.play().catch(function () {});
      }
    });
    zoneSideA.addEventListener("mouseleave", function () {
      audioSideA.pause();
    });
  }

  if (zoneSideB && audioSideB) {
    zoneSideB.addEventListener("mouseenter", function () {
      if (radioEnabled && audioSideB.readyState >= 2) {
        audioSideB.play().catch(function () {});
      }
    });
    zoneSideB.addEventListener("mouseleave", function () {
      audioSideB.pause();
    });
  }

});

/* FRAGMENT ARCHIVE LORE DATA */
var fragmentLoreData = {
  1: {
    title: "FRAGMENT 01 // PANDORA'S BOX",
    text: "The iron container recovered from the Duality Chamber. Inside, a breathing core pulses with erratic energy. Archival logs indicate that when this seal was breached, it released not malice, but a frequency that permanently altered human emotional response. Hope was never a gift; it was the mechanism of the cage."
  },
  2: {
    title: "FRAGMENT 02 // THE SPIRIT BOX",
    text: "A military-grade frequency receiver modified with analog vacuum tubes. Emits continuous white noise interspersed with anomalous voice transmissions. Unlocking this artifact grants direct access to the independent frequency tuner."
  },
  3: {
    title: "FRAGMENT 03 // INTERLINKED TITANIUM BANDS",
    text: "Two ritualistic rings fused together at an atomic level across impossible spatial coordinates. Archives confirm these belonged to the earliest subjects of the anomaly, proving that human connection survived structural dissolution before the great separation."
  },
  4: {
    title: "FRAGMENT 04 // BASALT STONE HANDS",
    text: "A pair of hands sculpted from volcanic glass, crafted before publicly known human civilization, palms pressed tightly together in perpetual prayer. Believed to originate from the 'First Silence'—the historic era when civilization abandoned spoken language because speech itself began attracting the signal from the void."
  },
  5: {
    title: "FRAGMENT 05 // BURNED POLAROID",
    text: "A physical photographic print scorched black by atmospheric heat, preserving only a single glowing coordinate in an ancient forest. A remnant of the pre-XXXXXX world view before the architects vanished."
  }
};