const startBtn = document.querySelector(".button_start_game");
const quizBox = document.getElementById("quizBox");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");
const overlay = document.getElementById("overlay");

let currentQuestion = 0;
let score = 0;
let questions = [];
let isMuted = false;

// Φόρτωση και ανακάτεμα ερωτήσεων
fetch("static/questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data.sort(() => Math.random() - 0.5);
    });

startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide");
    setTimeout(() => {
        startBtn.style.display = "none";
        quizBox.classList.remove("hidden");
        setTimeout(() => quizBox.classList.add("show"), 50);
        loadQuestion();
    }, 500);
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
});

function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    answersEl.innerHTML = "";

    if (q.type === "true_false") {
        answersEl.classList.add("tf-container");
    } else {
        answersEl.classList.remove("tf-container");
    }

    q.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        if (q.type === "true_false") btn.classList.add("tf-button");
        btn.addEventListener("click", () => checkAnswer(index));
        answersEl.appendChild(btn);
    });
}

function checkAnswer(index) {
    const q = questions[currentQuestion];
    const buttons = answersEl.querySelectorAll("button");
    buttons.forEach(btn => btn.disabled = true);

    if (index === q.correct) {
        score++;
        buttons[index].style.backgroundColor = "#2ecc71";
        buttons[index].style.color = "white";
    } else {
        buttons[index].style.backgroundColor = "#e74c3c";
        buttons[index].style.color = "white";
        buttons[q.correct].style.backgroundColor = "#2ecc71";
        buttons[q.correct].style.color = "white";
    }
    setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionEl.textContent = "Τέλος Quiz! 🎉";
    answersEl.classList.remove("tf-container");
    answersEl.innerHTML = `
        <h2>Το σκορ σου είναι:</h2>
        <h1 class="score" style="color: #252563; font-size: 3rem;">${score} / ${questions.length}</h1>
        <button onclick="location.reload()" style="margin-top:20px; background:#252563; color:white; padding:12px 25px; border-radius:10px; border:none; cursor:pointer;">Παίξε ξανά</button>
    `;
    bgMusic.pause();
}

muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    isMuted ? bgMusic.pause() : bgMusic.play();
    muteBtn.textContent = isMuted ? "🔇 Unmute" : "🔊 Mute";
});

// QR Code Logic
const qrModal = document.getElementById('qr-modal');
document.getElementById('qr-open-btn').addEventListener('click', () => {
    qrModal.classList.remove('modal-hidden');
    new QRious({
        element: document.getElementById('qrcode'),
        value: window.location.href,
        size: 180,
        foreground: '#252563'
    });
});
document.getElementById('qr-close-btn').addEventListener('click', () => qrModal.classList.add('modal-hidden'));
window.addEventListener('click', (e) => { if (e.target === qrModal) qrModal.classList.add('modal-hidden'); });
