const questionEl = document.getElementById("question");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const teaseEl = document.getElementById("tease");
const gifEl = document.getElementById("main-gif");
const captionEl = document.getElementById("gif-caption");
const countdownEl = document.getElementById("countdown-timer");
const bgHearts = document.getElementById("bg-hearts");
const noteContainer = document.getElementById("note-container");
const modal = document.getElementById("modal");
const musicToggle = document.getElementById("music-toggle");
const music = document.getElementById("bg-music");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

const MUSIC_TARGET = 0.6;

const teaseMessages = [
  "Are you sure? 🥺",
  "Think again 😏",
  "You don’t mean that 😭",
  "Nice try 😌",
];

const loveNotes = [
  "Hallah, you’re my favorite everything 💖",
  "Your smile is my safe place ✨",
  "I fall for you every day 💞",
  "You + Me = Magic 💫",
  "I love you to the moon and back 🌙",
];

const puppyGif = "https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif";
const celebrateGif = "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif";

let teaseTimer;
let celebrationStarted = false;
let musicFadeId;

function typeWriter(el, text, speed = 50) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text.charAt(i);
    i += 1;
    if (i >= text.length) {
      clearInterval(timer);
    }
  }, speed);
}

function setNextValentine() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 1, 14, 0, 0, 0);
  if (now > target) {
    year += 1;
    target = new Date(year, 1, 14, 0, 0, 0);
  }
  return target;
}

let valentineTarget = setNextValentine();

function updateCountdown() {
  const now = new Date();
  let diff = valentineTarget - now;
  if (diff <= 0) {
    countdownEl.textContent = "It's Valentine's Day! 💘";
    valentineTarget = setNextValentine();
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function createBackgroundHearts(count = 26) {
  bgHearts.innerHTML = "";
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤";
    const size = 16 + Math.random() * 28;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${8 + Math.random() * 10}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    heart.style.opacity = `${0.25 + Math.random() * 0.6}`;
    bgHearts.appendChild(heart);
  }
}

function showTeaseMessage() {
  const message = teaseMessages[Math.floor(Math.random() * teaseMessages.length)];
  teaseEl.textContent = message;
  teaseEl.classList.add("show");
  clearTimeout(teaseTimer);
  teaseTimer = setTimeout(() => {
    teaseEl.classList.remove("show");
  }, 1200);
}

function lockNoButtonPosition() {
  if (noBtn.classList.contains("floating")) return;
  const rect = noBtn.getBoundingClientRect();
  noBtn.classList.add("floating");
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;
}

function moveNoButton() {
  lockNoButtonPosition();
  const rect = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, window.innerWidth - rect.width);
  const maxY = Math.max(0, window.innerHeight - rect.height);
  const nextX = Math.random() * maxX;
  const nextY = Math.random() * maxY;
  const rotation = (Math.random() * 20 - 10).toFixed(2);
  const scale = (0.92 + Math.random() * 0.18).toFixed(2);
  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
  noBtn.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  showTeaseMessage();
}

function handleNoHover(event) {
  event.preventDefault();
  if (celebrationStarted) return;
  moveNoButton();
}

function createLoveNote(x, y) {
  const note = document.createElement("div");
  note.className = "love-note";
  note.textContent = loveNotes[Math.floor(Math.random() * loveNotes.length)];
  note.style.left = `${x}px`;
  note.style.top = `${y}px`;
  noteContainer.appendChild(note);
  setTimeout(() => {
    note.remove();
  }, 2400);
}

function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function startConfetti(duration = 4000) {
  resizeConfettiCanvas();
  const colors = ["#ff4f86", "#ff9ac2", "#ffd1e8", "#ffffff", "#ff6f91"];
  const particles = Array.from({ length: 220 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    size: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: -2 + Math.random() * 4,
    vy: 3 + Math.random() * 4,
    rotation: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
  }));

  const endTime = Date.now() + duration;

  function frame() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      if (p.y > confettiCanvas.height + 20) {
        p.y = -20;
      }
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    if (Date.now() < endTime) {
      requestAnimationFrame(frame);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  frame();
}

function spawnHeartBurst(count = 18) {
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("div");
    heart.className = "heart-pop";
    heart.textContent = "❤";
    heart.style.left = `${50 + (Math.random() * 40 - 20)}%`;
    heart.style.top = `${60 + Math.random() * 20}%`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.opacity = `${0.6 + Math.random() * 0.4}`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1800);
  }
}

function startHeartFireworks() {
  let bursts = 0;
  const interval = setInterval(() => {
    spawnHeartBurst(14);
    bursts += 1;
    if (bursts > 6) clearInterval(interval);
  }, 400);
}

function showModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }, 2200);
}

function fadeMusic(toVolume, duration = 1500) {
  cancelAnimationFrame(musicFadeId);
  const startVolume = music.volume;
  const startTime = performance.now();
  const delta = toVolume - startVolume;

  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    music.volume = startVolume + delta * progress;
    if (progress < 1) {
      musicFadeId = requestAnimationFrame(tick);
    }
  };

  musicFadeId = requestAnimationFrame(tick);
}

async function startMusic({ fade = true } = {}) {
  try {
    if (fade) {
      music.volume = 0;
    }
    await music.play();
    music.muted = false;
    if (fade) {
      fadeMusic(MUSIC_TARGET);
    } else {
      music.volume = MUSIC_TARGET;
    }
    musicToggle.classList.add("active");
  } catch (error) {
    music.muted = true;
    musicToggle.classList.remove("active");
  }
}

function handleYesClick() {
  if (celebrationStarted) return;
  celebrationStarted = true;
  document.body.classList.add("celebrate", "screen-zoom");

  questionEl.textContent = "Hallah, this is your flower love 💐";
  gifEl.src = celebrateGif;
  captionEl.textContent = "I promise unlimited cuddles 😌";
  noBtn.style.display = "none";

  startConfetti(4200);
  startHeartFireworks();
  showModal();

  startMusic({ fade: true });

  setTimeout(() => {
    document.body.classList.remove("screen-zoom");
  }, 1400);
}

function handleMusicToggle() {
  if (music.paused) {
    startMusic({ fade: true });
  } else {
    music.pause();
    musicToggle.classList.remove("active");
  }
}

function handleHeartClick(event) {
  if (celebrationStarted) return;
  const x = event.clientX;
  const y = event.clientY;
  createLoveNote(x, y);
}

function handleParallax(event) {
  const x = (event.clientX / window.innerWidth - 0.5) * 12;
  const y = (event.clientY / window.innerHeight - 0.5) * 12;
  bgHearts.style.transform = `translate(${x}px, ${y}px)`;
}

createBackgroundHearts();

typeWriter(questionEl, questionEl.dataset.text, 45);
updateCountdown();
setInterval(updateCountdown, 1000);

startMusic({ fade: true });
document.addEventListener(
  "pointerdown",
  () => {
    if (music.paused) startMusic({ fade: true });
  },
  { once: true }
);

bgHearts.addEventListener("click", handleHeartClick);

noBtn.addEventListener("mouseenter", handleNoHover);
noBtn.addEventListener("click", handleNoHover);
noBtn.addEventListener("touchstart", handleNoHover, { passive: false });

yesBtn.addEventListener("click", handleYesClick);
musicToggle.addEventListener("click", handleMusicToggle);

window.addEventListener("mousemove", handleParallax);
window.addEventListener("resize", () => {
  resizeConfettiCanvas();
  if (noBtn.classList.contains("floating")) {
    moveNoButton();
  }
});
