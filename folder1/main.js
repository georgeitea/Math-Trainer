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
/* JSON load */
fetch("static/questions.json")
    .then(res => res.json())
    .then(data => {
        questions = data;
    });

/* START */
startBtn.addEventListener("click", () => {
    startBtn.classList.add("hide");

    overlay.classList.add("active");

    setTimeout(() => {
        startBtn.style.display = "none";
        quizBox.classList.remove("hidden");

        setTimeout(() => {
            quizBox.classList.add("show");
        }, 50);

        loadQuestion();
    }, 500);

    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
});

/* LOAD */
function loadQuestion() {
    const q = questions[currentQuestion];

    questionEl.textContent = q.question;
    answersEl.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;

        btn.addEventListener("click", () => checkAnswer(index));

        answersEl.appendChild(btn);
    });
}

/* CHECK */
function checkAnswer(index) {
    const q = questions[currentQuestion];
    const buttons = answersEl.querySelectorAll("button");

    buttons.forEach(btn => btn.disabled = true);

    if (index === q.correct) {
        score++;
        buttons[index].style.backgroundColor = "green";
    } else {
        buttons[index].style.backgroundColor = "red";
        buttons[q.correct].style.backgroundColor = "green";
    }

    setTimeout(nextQuestion, 1200);
}

/* NEXT */
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

/* RESULT */
function showResult() {
    questionEl.textContent = "Τέλος Quiz! 🎉";
    answersEl.innerHTML = `
        <h2>Το σκορ σου είναι:</h2>
        <h1 class="score">${score} / ${questions.length}</h1>
    `;

    bgMusic.pause();
    bgMusic.currentTime = 0;
}

/* MUTE */
muteBtn.addEventListener("click", () => {
    if (!isMuted) {
        bgMusic.pause();
        muteBtn.textContent = "🔇 Unmute";
        isMuted = true;
    } else {
        bgMusic.play().catch(() => {});
        muteBtn.textContent = "🔊 Mute";
        isMuted = false;
    }
});
