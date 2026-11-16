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

/* BACKGROUND STARS & COMETS CANVAS LOOP (NO SPINNING) */
var canvas = document.getElementById("space-canvas");
if (canvas) {
var ctx = canvas.getContext("2d");
var bgStars = [];
var comets = [];
var starCount = 220;

function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (var s = 0; s < starCount; s++) {
bgStars.push({
x: Math.random() * window.innerWidth,
y: Math.random() * window.innerHeight,
r: Math.random() * 1.5 + 0.4,
alpha: Math.random() * 0.8 + 0.1,
twinkleSpeed: Math.random() * 0.03 + 0.01
});
}

function spawnComet() {
comets.push({
x: -50,
y: Math.random() * (window.innerHeight * 0.7),
vx: Math.random() * 6 + 5,
vy: Math.random() * 3 + 2,
length: Math.random() * 120 + 80,
life: 1
});
}

setInterval(function () {
if (viewHub && viewHub.classList.contains("active")) {
spawnComet();
}
}, 1800);

function animateSpace() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

/* DRAW TWINKLING STARS */
for (var i = 0; i < bgStars.length; i++) {
var st = bgStars[i];
st.alpha += st.twinkleSpeed;
if (st.alpha > 0.98 || st.alpha < 0.1) {
st.twinkleSpeed *= -1;
}
ctx.beginPath();
ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
ctx.fillStyle = "rgba(255, 255, 255," + st.alpha.toFixed(2) + ")";
ctx.fill();
}

/* DRAW COMETS */
for (var c = comets.length - 1; c >= 0; c--) {
var cm = comets[c];
cm.x += cm.vx;
cm.y += cm.vy;
cm.life -= 0.012;
var grad = ctx.createLinearGradient(
cm.x, cm.y,
cm.x - cm.vx * (cm.length / 6),
cm.y - cm.vy * (cm.length / 6)
);
grad.addColorStop(0, "rgba(255, 255, 255," + Math.max(0, cm.life) + ")");
grad.addColorStop(1, "rgba(255, 255, 255, 0)");
ctx.strokeStyle = grad;
ctx.lineWidth = 1.6;
ctx.beginPath();
ctx.moveTo(cm.x, cm.y);
ctx.lineTo(
cm.x - cm.vx * (cm.length / 6),
cm.y - cm.vy * (cm.length / 6)
);
ctx.stroke();
if (cm.life <= 0 || cm.x > canvas.width + 200 || cm.y > canvas.height + 200) {
comets.splice(c, 1);
}
}

requestAnimationFrame(animateSpace);
}
requestAnimationFrame(animateSpace);
}

/* PLANET WARP TRANSITION & NAVIGATION */
if (nodeElpis) {
nodeElpis.addEventListener("click", function (e) {
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