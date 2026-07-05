const TRANSLATIONS = {
  pt: {
    eyebrow: "JOGO DE ADIVINHAÇÃO",
    title1: "Encontra a",
    title2: "Porta Secreta",
    tagline: "Escolhe um número. O jogo diz-te se a porta certa está mais acima ou mais abaixo. Tens tentativas limitadas — não as desperdices.",
    diffEasy: "Fácil",
    diffEasyTries: "10 tentativas",
    diffNormal: "Normal",
    diffNormalTries: "8 tentativas",
    diffHard: "Difícil",
    diffHardTries: "6 tentativas",
    attemptsLabel: "Tentativas",
    bestLabel: "Melhor",
    guessBtn: "Adivinhar",
    historyLabel: "Histórico",
    newGameBtn: "Novo Jogo",
    consoleHint: "💡 Dica: abre a consola do navegador para veres pistas de desenvolvimento.",
    footerBy: "Desenvolvido por",
    playAgainBtn: "Jogar Novamente",
    closeBtn: "Fechar",
    inputPlaceholder: "?",
    inputAria: "O teu palpite",
    invalid: (min, max) => `Insere um número válido entre ${min} e ${max}.`,
    hintUp: "⬆️ Mais para cima",
    hintDown: "⬇️ Mais para baixo",
    hintCorrect: "🎉 Acertaste!",
    hintOver: (n) => `💀 Fim de jogo! A porta era a nº ${n}.`,
    proxCold: "❄️ Gelado",
    proxCool: "🧊 Frio",
    proxWarm: "🌤️ Morno",
    proxHot: "🔥 Quente",
    proxBlaze: "🌋 A arder!",
    winTitle: "Porta encontrada!",
    winText: (n, secs) => `Abriste a porta certa em ${n} tentativa${n === 1 ? "" : "s"}, em ${secs}s.`,
    loseTitle: "Fim de Jogo",
    loseText: (n) => `As tentativas esgotaram-se. A porta secreta era a número ${n}.`,
    statAttempts: "Tentativas",
    statTime: "Tempo",
    statBest: "Recorde",
    newBest: "🏆 Novo recorde!",
    bestFormat: (n) => `${n} tentativas`,
  },
  en: {
    eyebrow: "GUESSING GAME",
    title1: "Find the",
    title2: "Secret Door",
    tagline: "Pick a number. The game tells you whether the right door is higher or lower. Your attempts are limited — don't waste them.",
    diffEasy: "Easy",
    diffEasyTries: "10 tries",
    diffNormal: "Normal",
    diffNormalTries: "8 tries",
    diffHard: "Hard",
    diffHardTries: "6 tries",
    attemptsLabel: "Attempts",
    bestLabel: "Best",
    guessBtn: "Guess",
    historyLabel: "History",
    newGameBtn: "New Game",
    consoleHint: "💡 Tip: open the browser console for developer hints.",
    footerBy: "Developed by",
    playAgainBtn: "Play Again",
    closeBtn: "Close",
    inputPlaceholder: "?",
    inputAria: "Your guess",
    invalid: (min, max) => `Enter a valid number between ${min} and ${max}.`,
    hintUp: "⬆️ Go higher",
    hintDown: "⬇️ Go lower",
    hintCorrect: "🎉 You got it!",
    hintOver: (n) => `💀 Game over! The door was number ${n}.`,
    proxCold: "❄️ Freezing",
    proxCool: "🧊 Cold",
    proxWarm: "🌤️ Warm",
    proxHot: "🔥 Hot",
    proxBlaze: "🌋 Blazing!",
    winTitle: "Door found!",
    winText: (n, secs) => `You opened the right door in ${n} attempt${n === 1 ? "" : "s"}, in ${secs}s.`,
    loseTitle: "Game Over",
    loseText: (n) => `You ran out of attempts. The secret door was number ${n}.`,
    statAttempts: "Attempts",
    statTime: "Time",
    statBest: "Best",
    newBest: "🏆 New record!",
    bestFormat: (n) => `${n} attempts`,
  },
};

const DIFFICULTIES = {
  easy: { min: 1, max: 50, attempts: 10 },
  normal: { min: 1, max: 100, attempts: 8 },
  hard: { min: 1, max: 200, attempts: 6 },
};

const STORAGE_LANG = "aflito:lang";
const STORAGE_SOUND = "aflito:sound";
const bestKey = (diff) => `aflito:best:${diff}`;

const state = {
  lang: localStorage.getItem(STORAGE_LANG) || (navigator.language?.startsWith("pt") ? "pt" : "en"),
  soundOn: localStorage.getItem(STORAGE_SOUND) !== "off",
  difficulty: "normal",
  secret: 0,
  min: 1,
  max: 100,
  maxAttempts: 8,
  attemptsUsed: 0,
  history: [],
  over: false,
  won: false,
  startTime: 0,
};

const el = (id) => document.getElementById(id);
const guessForm = el("guess-form");
const guessInput = el("guess-input");
const feedbackEl = el("feedback");
const historyList = el("history-list");
const doorsTrack = el("doors-track");
const attemptsUsedEl = el("attempts-used");
const attemptsMaxEl = el("attempts-max");
const bestValueEl = el("best-value");
const proximityFill = el("proximity-fill");
const proximityLabel = el("proximity-label");
const inputRange = el("input-range");
const gameCard = el("game-card");
const modalOverlay = el("modal-overlay");
const modalIcon = el("modal-icon");
const modalTitle = el("modal-title");
const modalText = el("modal-text");
const modalStats = el("modal-stats");

function t(key, ...args) {
  const value = TRANSLATIONS[state.lang][key];
  return typeof value === "function" ? value(...args) : value;
}

function applyTranslations() {
  document.documentElement.lang = state.lang === "pt" ? "pt-PT" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    const value = TRANSLATIONS[state.lang][key];
    if (typeof value === "string") node.textContent = value;
  });
  guessInput.setAttribute("aria-label", t("inputAria"));
  guessInput.setAttribute("placeholder", t("inputPlaceholder"));
  el("lang-label").textContent = state.lang.toUpperCase();
  el("lang-flag").textContent = state.lang === "pt" ? "🇵🇹" : "🇬🇧";
  updateBestDisplay();
  renderHistory();
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem(STORAGE_LANG, lang);
  applyTranslations();
}

el("lang-toggle").addEventListener("click", () => {
  setLang(state.lang === "pt" ? "en" : "pt");
  playTone(520, 0.05);
});

/* ---------------- Sound ---------------- */
let audioCtx = null;
function playTone(freq, duration, type = "sine", gainValue = 0.05) {
  if (!state.soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    /* audio unsupported */
  }
}

function playSequence(notes) {
  if (!state.soundOn) return;
  notes.forEach(([freq, delay, duration]) => {
    setTimeout(() => playTone(freq, duration || 0.15), delay);
  });
}

el("sound-toggle").addEventListener("click", () => {
  state.soundOn = !state.soundOn;
  localStorage.setItem(STORAGE_SOUND, state.soundOn ? "on" : "off");
  el("sound-icon").textContent = state.soundOn ? "🔊" : "🔇";
  if (state.soundOn) playTone(440, 0.08);
});

/* ---------------- Difficulty ---------------- */
document.querySelectorAll(".diff-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".diff-btn").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-checked", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-checked", "true");
    startGame(btn.dataset.diff);
    playTone(360, 0.08);
  });
});

/* ---------------- Game logic ---------------- */
function updateBestDisplay() {
  const best = localStorage.getItem(bestKey(state.difficulty));
  bestValueEl.textContent = best ? t("bestFormat", best) : "—";
}

function buildDoors() {
  doorsTrack.innerHTML = "";
  for (let i = 0; i < state.maxAttempts; i++) {
    const span = document.createElement("span");
    span.className = "door-pip";
    doorsTrack.appendChild(span);
  }
}

function updateDoors() {
  const pips = doorsTrack.querySelectorAll(".door-pip");
  pips.forEach((pip, i) => pip.classList.toggle("used", i < state.attemptsUsed));
}

function startGame(difficulty = state.difficulty) {
  const cfg = DIFFICULTIES[difficulty];
  state.difficulty = difficulty;
  state.min = cfg.min;
  state.max = cfg.max;
  state.maxAttempts = cfg.attempts;
  state.secret = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min;
  state.attemptsUsed = 0;
  state.history = [];
  state.over = false;
  state.won = false;
  state.startTime = Date.now();

  console.log(`%c🚪 [dev] secret door: ${state.secret}`, "color:#d97706;font-weight:bold");

  attemptsUsedEl.textContent = "0";
  attemptsMaxEl.textContent = String(cfg.attempts);
  inputRange.textContent = `${cfg.min}–${cfg.max}`;
  guessInput.min = String(cfg.min);
  guessInput.max = String(cfg.max);
  guessInput.value = "";
  guessInput.disabled = false;
  el("guess-btn").disabled = false;
  feedbackEl.textContent = " ";
  feedbackEl.className = "feedback";
  proximityFill.style.width = "0%";
  proximityLabel.textContent = " ";
  buildDoors();
  updateBestDisplay();
  renderHistory();
  closeModal();
  guessInput.focus();
}

function renderHistory() {
  historyList.innerHTML = "";
  state.history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = `history-item h-${entry.type}`;
    const hintText =
      entry.type === "up" ? t("hintUp") : entry.type === "down" ? t("hintDown") : t("hintCorrect");
    li.innerHTML = `
      <span class="h-num">#${entry.attempt}</span>
      <span class="h-guess">${entry.guess}</span>
      <span class="h-hint">${hintText}</span>
    `;
    historyList.appendChild(li);
  });
}

function proximityInfo(guess) {
  const range = state.max - state.min || 1;
  const distance = Math.abs(guess - state.secret);
  const closeness = 1 - Math.min(distance / (range / 2), 1);
  let label;
  if (closeness > 0.92) label = t("proxBlaze");
  else if (closeness > 0.7) label = t("proxHot");
  else if (closeness > 0.4) label = t("proxWarm");
  else if (closeness > 0.15) label = t("proxCool");
  else label = t("proxCold");
  return { pct: Math.round(closeness * 100), label };
}

function endGame(won) {
  state.over = true;
  state.won = won;
  guessInput.disabled = true;
  el("guess-btn").disabled = true;

  const elapsed = Math.max(1, Math.round((Date.now() - state.startTime) / 1000));
  const bestRaw = localStorage.getItem(bestKey(state.difficulty));
  const best = bestRaw ? parseInt(bestRaw, 10) : null;
  let isNewBest = false;

  if (won) {
    if (best === null || state.attemptsUsed < best) {
      localStorage.setItem(bestKey(state.difficulty), String(state.attemptsUsed));
      isNewBest = true;
    }
    modalIcon.textContent = "🎉";
    modalTitle.textContent = t("winTitle");
    modalText.textContent = t("winText", state.attemptsUsed, elapsed);
    playSequence([[523, 0], [659, 90], [784, 180], [1047, 280, 0.3]]);
    spawnConfetti();
  } else {
    modalIcon.textContent = "💀";
    modalTitle.textContent = t("loseTitle");
    modalText.textContent = t("loseText", state.secret);
    playSequence([[300, 0], [220, 120], [160, 260, 0.4]]);
    gameCard.classList.add("shake");
    setTimeout(() => gameCard.classList.remove("shake"), 400);
  }

  modalStats.innerHTML = `
    <div class="m-stat">
      <span class="m-stat-value">${state.attemptsUsed}</span>
      <span class="m-stat-label">${t("statAttempts")}</span>
    </div>
    <div class="m-stat">
      <span class="m-stat-value">${elapsed}s</span>
      <span class="m-stat-label">${t("statTime")}</span>
    </div>
    <div class="m-stat">
      <span class="m-stat-value">${isNewBest ? t("newBest") : (best ?? "—")}</span>
      <span class="m-stat-label">${t("statBest")}</span>
    </div>
  `;
  updateBestDisplay();
  openModal();
}

function submitGuess() {
  if (state.over) return;
  const raw = guessInput.value;
  const guess = Number(raw);

  if (raw === "" || Number.isNaN(guess) || guess < state.min || guess > state.max) {
    feedbackEl.textContent = t("invalid", state.min, state.max);
    feedbackEl.className = "feedback down";
    guessInput.classList.remove("invalid");
    void guessInput.offsetWidth;
    guessInput.classList.add("invalid");
    playTone(180, 0.15, "square", 0.04);
    return;
  }

  state.attemptsUsed++;
  attemptsUsedEl.textContent = String(state.attemptsUsed);
  updateDoors();

  const { pct, label } = proximityInfo(guess);
  proximityFill.style.width = `${pct}%`;
  proximityLabel.textContent = label;

  let type;
  if (guess === state.secret) {
    type = "correct";
    feedbackEl.textContent = t("hintCorrect");
    feedbackEl.className = "feedback correct";
  } else if (guess < state.secret) {
    type = "up";
    feedbackEl.textContent = t("hintUp");
    feedbackEl.className = "feedback up";
  } else {
    type = "down";
    feedbackEl.textContent = t("hintDown");
    feedbackEl.className = "feedback down";
  }

  state.history.push({ attempt: state.attemptsUsed, guess, type });
  renderHistory();
  guessInput.value = "";

  if (type === "correct") {
    endGame(true);
    return;
  }

  playTone(type === "up" ? 700 : 400, 0.08);

  if (state.attemptsUsed >= state.maxAttempts) {
    feedbackEl.textContent = t("hintOver", state.secret);
    feedbackEl.className = "feedback over";
    endGame(false);
    return;
  }

  guessInput.focus();
}

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitGuess();
});

el("reset-btn").addEventListener("click", () => startGame());
el("modal-replay").addEventListener("click", () => startGame());
el("modal-close").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

function openModal() {
  modalOverlay.classList.add("is-open");
}
function closeModal() {
  modalOverlay.classList.remove("is-open");
}

/* Tilt glow following pointer on the card */
gameCard.addEventListener("pointermove", (e) => {
  const rect = gameCard.getBoundingClientRect();
  gameCard.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  gameCard.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
});

/* ---------------- Confetti ---------------- */
const confettiCanvas = el("confetti-canvas");
const confettiCtx = confettiCanvas.getContext("2d");
let confettiParticles = [];
let confettiRAF = null;

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeConfettiCanvas);
resizeConfettiCanvas();

function spawnConfetti() {
  const colors = ["#d97706", "#f59e0b", "#fbbf24", "#10b981", "#3b82f6", "#a855f7"];
  confettiParticles = Array.from({ length: 120 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.5,
    size: 5 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 2 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    life: 0,
  }));
  if (!confettiRAF) confettiTick();
}

function confettiTick() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  let alive = false;
  confettiParticles.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    p.life++;
    if (p.y < confettiCanvas.height + 20 && p.life < 420) alive = true;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    confettiCtx.restore();
  });
  if (alive) {
    confettiRAF = requestAnimationFrame(confettiTick);
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiRAF = null;
  }
}

/* ---------------- Ambient background ---------------- */
const bgCanvas = el("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let particles = [];

function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBgCanvas);
resizeBgCanvas();

function initParticles() {
  const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: 0.6 + Math.random() * 1.8,
    speed: 0.08 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 0.15,
    alpha: 0.15 + Math.random() * 0.35,
  }));
}
initParticles();
window.addEventListener("resize", initParticles);

function bgTick() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  const g1 = bgCtx.createRadialGradient(
    bgCanvas.width * 0.2, bgCanvas.height * 0.15, 0,
    bgCanvas.width * 0.2, bgCanvas.height * 0.15, bgCanvas.width * 0.5
  );
  g1.addColorStop(0, "rgba(217,119,6,0.10)");
  g1.addColorStop(1, "rgba(217,119,6,0)");
  bgCtx.fillStyle = g1;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  const g2 = bgCtx.createRadialGradient(
    bgCanvas.width * 0.85, bgCanvas.height * 0.75, 0,
    bgCanvas.width * 0.85, bgCanvas.height * 0.75, bgCanvas.width * 0.5
  );
  g2.addColorStop(0, "rgba(168,85,247,0.07)");
  g2.addColorStop(1, "rgba(168,85,247,0)");
  bgCtx.fillStyle = g2;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  particles.forEach((p) => {
    p.y -= p.speed;
    p.x += p.drift;
    if (p.y < -5) { p.y = bgCanvas.height + 5; p.x = Math.random() * bgCanvas.width; }
    if (p.x < -5) p.x = bgCanvas.width + 5;
    if (p.x > bgCanvas.width + 5) p.x = -5;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(226,232,240,${p.alpha})`;
    bgCtx.fill();
  });

  requestAnimationFrame(bgTick);
}
bgTick();

/* ---------------- Init ---------------- */
el("sound-icon").textContent = state.soundOn ? "🔊" : "🔇";
applyTranslations();
startGame(state.difficulty);
