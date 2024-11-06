const questions = {
  easy: {
    addition: [
      { question: 'What is 2 + 2?', options: [3, 4, 5, 6], answer: 4 },
      { question: 'What is 7 + 5?', options: [11, 12, 13, 14], answer: 12 },
      { question: 'What is 9 + 6?', options: [14, 15, 16, 17], answer: 15 }
    ],
    subtraction: [
      { question: 'What is 5 - 2?', options: [2, 3, 4, 5], answer: 3 },
      { question: 'What is 10 - 7?', options: [2, 3, 4, 5], answer: 3 },
      { question: 'What is 15 - 6?', options: [8, 9, 10, 11], answer: 9 }
    ],
    multiplication: [
      { question: 'What is 3 * 3?', options: [6, 7, 8, 9], answer: 9 },
      { question: 'What is 6 * 2?', options: [10, 11, 12, 13], answer: 12 },
      { question: 'What is 4 * 5?', options: [18, 19, 20, 21], answer: 20 }
    ],
    division: [
      { question: 'What is 12 / 4?', options: [2, 3, 4, 5], answer: 3 },
      { question: 'What is 8 / 2?', options: [3, 4, 5, 6], answer: 4 },
      { question: 'What is 9 / 3?', options: [2, 3, 4, 5], answer: 3 }
    ]
  },
  medium: {
    addition: [
      { question: 'What is 12 + 15?', options: [25, 26, 27, 28], answer: 27 },
      { question: 'What is 20 + 17?', options: [36, 37, 38, 39], answer: 37 },
      { question: 'What is 33 + 19?', options: [51, 52, 53, 54], answer: 52 }
    ],
    subtraction: [
      { question: 'What is 25 - 13?', options: [11, 12, 13, 14], answer: 12 },
      { question: 'What is 30 - 18?', options: [11, 12, 13, 14], answer: 12 },
      { question: 'What is 45 - 23?', options: [21, 22, 23, 24], answer: 22 }
    ],
    multiplication: [
      { question: 'What is 12 * 12?', options: [140, 144, 148, 152], answer: 144 },
      { question: 'What is 15 * 8?', options: [110, 115, 120, 125], answer: 120 },
      { question: 'What is 14 * 7?', options: [96, 98, 100, 102], answer: 98 }
    ],
    division: [
      { question: 'What is 48 / 6?', options: [6, 7, 8, 9], answer: 8 },
      { question: 'What is 56 / 8?', options: [5, 6, 7, 8], answer: 7 },
      { question: 'What is 81 / 9?', options: [8, 9, 10, 11], answer: 9 }
    ]
  },
  hard: {
    addition: [
      { question: 'What is 127 + 389?', options: [514, 516, 518, 520], answer: 516 },
      { question: 'What is 238 + 564?', options: [798, 800, 802, 804], answer: 802 },
      { question: 'What is 763 + 135?', options: [896, 898, 900, 902], answer: 898 }
    ],
    subtraction: [
      { question: 'What is 754 - 389?', options: [362, 363, 364, 365], answer: 365 },
      { question: 'What is 842 - 576?', options: [264, 266, 268, 270], answer: 266 },
      { question: 'What is 629 - 394?', options: [234, 235, 236, 237], answer: 235 }
    ],
    multiplication: [
      { question: 'What is 23 * 19?', options: [432, 437, 441, 445], answer: 437 },
      { question: 'What is 37 * 26?', options: [958, 962, 966, 970], answer: 962 },
      { question: 'What is 44 * 32?', options: [1380, 1408, 1412, 1416], answer: 1408 }
    ],
    division: [
      { question: 'What is 144 / 12?', options: [10, 11, 12, 13], answer: 12 },
      { question: 'What is 169 / 13?', options: [11, 12, 13, 14], answer: 13 },
      { question: 'What is 256 / 16?', options: [14, 15, 16, 17], answer: 16 }
    ]
  }
};

let score = 0;
let timeLeft = 90;
let timerInterval;
let isPaused = false;
let leaderboard = [];

document.getElementById('startButton').onclick = startGame;
document.getElementById('resetButton').onclick = resetGame;
document.getElementById('pauseButton').onclick = pauseGame;
document.getElementById('resumeButton').onclick = resumeGame;
document.getElementById('theme').onchange = toggleTheme;

window.onload = function() {
  loadLeaderboard();
};

function startGame() {
  const difficulty = document.getElementById('difficulty').value;
  const customTimer = document.getElementById('customTimer').value;
  timeLeft = customTimer ? parseInt(customTimer) : (difficulty === 'easy' ? 90 : (difficulty === 'medium' ? 60 : 30));
  
  score = 0;
  document.getElementById('score').innerText = 'Score: ' + score;
  document.getElementById('timer').innerText = 'Time left: ' + timeLeft + 's';
  nextQuestion();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  startGame();
}

function pauseGame() {
  isPaused = true;
  clearInterval(timerInterval);
  disableOptions();
}

function resumeGame() {
  if (isPaused) {
    isPaused = false;
    enableOptions();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if (!isPaused) {
    timeLeft--;
    document.getElementById('timer').innerText = 'Time left: ' + timeLeft + 's';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('Time is up! Your final score is: ' + score);
      updateLeaderboard(score);
    }
  }
}

function nextQuestion() {
  const difficulty = document.getElementById('difficulty').value;
  let category = document.getElementById('category').value;

  if (category === 'random') {
    const categories = Object.keys(questions[difficulty]);
    category = categories[Math.floor(Math.random() * categories.length)];
  }

  const randomIndex = Math.floor(Math.random() * questions[difficulty][category].length);
  const questionObj = questions[difficulty][category][randomIndex];
  document.getElementById('question').innerText = questionObj.question;
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  questionObj.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.onclick = () => checkAnswer(option, questionObj.answer);
    optionsDiv.appendChild(button);
  });
}

function checkAnswer(selected, correct) {
  if (!isPaused) {
    const sound = document.getElementById(selected === correct ? 'correctSound' : 'incorrectSound');
    const soundSetting = document.getElementById('sound').value;
    if (soundSetting === 'on') {
      sound.play();
    }
    if (selected === correct) {
      score++;
      document.getElementById('score').innerText = 'Score: ' + score;
      alert('Correct!');
    } else {
      alert('Wrong answer. Try again!');
    }
    nextQuestion();
  }
}

function disableOptions() {
  const options = document.querySelectorAll('#options button');
  options.forEach(option => {
    option.disabled = true;
  });
}

function enableOptions() {
  const options = document.querySelectorAll('#options button');
  options.forEach(option => {
    option.disabled = false;
  });
}

function toggleTheme() {
  const theme = document.getElementById('theme').value;
  document.body.className = theme === 'dark' ? 'dark-theme' : '';
}

function updateLeaderboard(newScore) {
  leaderboard.push(newScore);
  leaderboard.sort((a, b) => b - a);
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  leaderboard.slice(0, 5).forEach((score, index) => {
    const li = document.createElement('li');
    li.innerText = `#${index + 1}: ${score}`;
    leaderboardList.appendChild(li);
  });
  
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const storedLeaderboard = localStorage.getItem('leaderboard');
  if (storedLeaderboard) {
    leaderboard = JSON.parse(storedLeaderboard);
    updateLeaderboard();
  }
}

