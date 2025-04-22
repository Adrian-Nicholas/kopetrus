let gameInterval;
let gameCountdown;
const query = new URLSearchParams(window.location.search);
const level = parseInt(query.get("level")) || 1;
const object = document.getElementById("object");
const target = document.getElementById("target");
const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const countdownSound = document.getElementById("countdownSound");
const bgm = document.getElementById("bgm");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownText = document.getElementById("countdownText");

// Suara saat objek bergerak
const moveSound = new Audio('assets/sounds/moveSound.mp3'); // Pastikan file suara tersedia
moveSound.play();

// Suara saat target tercapai
const hitSound = new Audio('assets/sounds/hitSound.mp3');
hitSound.play();

let speed = 25 + level * 2;
let duration = 20 + (5 - level) * 2;
let isMoving = true;
let posX = 0;
let gameEnded = false;

// Countdown
// let countdownNumber = 3;
// countdownText.innerText = countdownNumber;
// let countdownInterval = setInterval(() => {
//   countdownNumber--;
//   countdownSound.play();
//   if (countdownNumber > 0) {
//     countdownText.innerText = countdownNumber;
//   } else if (countdownNumber === 0) {
//     countdownText.innerText = "GO!";
//   } else {
//     clearInterval(countdownInterval);
//     countdownOverlay.style.display = "none";
//     startGame();
//   }
// }, 1000);

countdownSound.volume = 1;
countdownSound.muted = false;

let countdownNumber = 3;
countdownText.innerText = countdownNumber;

// Mulai mainkan suara countdown saat angka pertama muncul


let countdownInterval = setInterval(() => {
  countdownNumber--;
  if (countdownNumber > 0) {
    countdownText.innerText = countdownNumber;
  } else if (countdownNumber === 0) {
    countdownText.innerText = "GO!";

  } else {
    clearInterval(countdownInterval);
    countdownOverlay.style.display = "none";
    countdownSound.play();
    startGame(); // mulai game setelah "GO!"
  }
}, 1000); // setiap 1 detik ganti angka

function startGame() {
  document.getElementById("timeLeft").innerText = duration;

  gameInterval = setInterval(() => {
    if (!isMoving || gameEnded) return;
    posX += speed;
    if (posX > window.innerWidth) posX = -100;
    object.style.left = posX + "px";
  }, 16);

  gameCountdown = setInterval(() => {
    if (duration <= 0) return endGame(false);
    duration--;
    document.getElementById("timeLeft").innerText = duration;
  }, 1000);
}

document.body.addEventListener("click", () => {
  if (gameEnded) return;
  tapSound.play();
  if (isMoving) {
    isMoving = false;
    const objectCenter = posX + 50;
    const screenCenter = window.innerWidth / 2;
    const tolerance = 2;
    if (Math.abs(objectCenter - screenCenter) <= tolerance) {
      document.body.style.backgroundColor = "#4CAF50"; // Ganti dengan warna sukses
      endGame(true);
    }
  } else {
    document.body.style.backgroundColor = "#F44336"; // Ganti dengan warna kesalahan
    isMoving = true;
  }
});

// function endGame(win) {
//   clearInterval(gameInterval);
//   clearInterval(gameCountdown);
//   gameEnded = true;
//   if (win) {
//     winSound.play();
//     startConfetti();
//     const reward = getRewardByLevel(level);
//     setTimeout(() => {
//       document.getElementById("modalTitle").textContent = "🎉 Kamu Menang!";
//       document.getElementById("modalText").textContent = `Hadiahmu: ${reward.text}`;
//       document.getElementById("modalReward").textContent = `Kode: ${reward.code}`;
//       document.getElementById("winModal").classList.remove("hidden");
//     }, 800);
//   } else {
//     loseSound.play();
//     setTimeout(() => {
//       document.getElementById("loseModal").classList.remove("hidden");
//     }, 800);
//   }
// }

// 
function endGame(win) {
  clearInterval(gameInterval);
  clearInterval(gameCountdown);
  gameEnded = true;

  if (win) {
    winSound.play();
    startConfetti();

    const reward = getRewardByLevel(level);

    // Delay beberapa detik sebelum munculkan modal
    setTimeout(() => {
      // Update modal menang
      document.getElementById("modalTitle").textContent = "🎉 Kamu Menang!";
      document.getElementById("modalText").textContent = `Hadiahmu: ${reward.text}`;
      document.getElementById("modalReward").textContent = `Kode: ${reward.code}`;
      // Pastikan modal win muncul
      document.getElementById("winModal").classList.remove("hidden");
      document.getElementById("winModal").classList.add("show");
    }, 1500); // modal muncul 1.5 detik setelah menang

  } else {
    loseSound.play();
    // Delay munculnya modal kalah
    setTimeout(() => {
      // Pastikan modal kalah muncul dengan benar
      document.getElementById("loseModal").classList.remove("hidden");
      document.getElementById("loseModal").classList.add("show");
    }, 600); // Modal muncul 0.6 detik setelah kalah
  }
}
function getRewardByLevel(level) {
  const rewards = {
    1: { text: "Es Teh Manis", code: "ESTEHMANIS", icon: "🥤" },
    2: { text: "1 Sate Ba", code: "SATEBA1", icon: "🍢" },
    3: { text: "1 Paket Soto Ba", code: "SOTOBA1", icon: "🍲" },
    4: { text: "1 Paket Rusuk Ba", code: "RUSUKBA1", icon: "🍖" }
  };
  return rewards[level] || { text: "Hadiah Spesial", code: "BONUS2025", icon: "🏰" };
}

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 5 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      p.y += p.d;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }
  let confettiAnim = setInterval(draw, 30);
  setTimeout(() => clearInterval(confettiAnim), 2000);
}

document.getElementById("btnBack").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("btnRetry").addEventListener("click", () => {
  window.location.reload();
});
