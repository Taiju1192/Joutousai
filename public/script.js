const textSamples = [
  "今日はいい天気ですね",
  "明日友達と遊園地に行きます",
  "毎日少しずつ練習しましょう",
  "朝ごはんをしっかり食べましょう",
  "プログラミングは楽しいです",
  "漢字も混ざった文章で練習できます",
  "集中して画面を見つめてください",
  "タイピングのコツは繰り返しです",
  "静かな場所で練習すると効果的です",
  "好きな音楽を聞きながらタイピングする人もいます"
];

let currentJapanese = '';
let currentRomaji = '';
let inputLength = 0;
let timer;
let timeLimit = 30;

function startGame() {
  resetState();

  currentJapanese = textSamples[Math.floor(Math.random() * textSamples.length)];
  const noPeriod = currentJapanese.replace(/。/g, ''); // 「。」削除
  currentRomaji = wanakana.toRomaji(noPeriod);
  
  document.getElementById("displayJapanese").textContent = noPeriod;
  updateRomajiDisplay();

  startTimer();
  document.getElementById("inputArea").addEventListener('input', onInput);
}

function resetState() {
  clearInterval(timer);
  inputLength = 0;
  document.getElementById("inputArea").value = '';
  document.getElementById("romajiDisplay").innerHTML = '';
  document.getElementById("resultMessage").textContent = '';
  document.getElementById("time").textContent = timeLimit;
  document.getElementById("wpm").textContent = '-';
  document.getElementById("accuracy").textContent = '-';
  document.getElementById("retryButton").style.display = 'none';
}

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("time").textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOver(false);
    }
  }, 1000);
}

function updateRomajiDisplay() {
  const typed = `<span class="typed">${currentRomaji.slice(0, inputLength)}</span>`;
  const remaining = currentRomaji.slice(inputLength);
  document.getElementById("romajiDisplay").innerHTML = typed + remaining;
}

function onInput() {
  const userInput = document.getElementById("inputArea").value.toLowerCase();

  if (!currentRomaji.startsWith(userInput)) {
    document.getElementById("inputArea").style.backgroundColor = '#ffe5e5';
  } else {
    document.getElementById("inputArea").style.backgroundColor = '#fff8f0';
    inputLength = userInput.length;
    updateRomajiDisplay();

    if (userInput === currentRomaji) {
      clearInterval(timer);
      gameOver(true);
    }
  }
}

function gameOver(success) {
  document.getElementById("inputArea").removeEventListener('input', onInput);

  if (success) {
    const elapsed = timeLimit - parseInt(document.getElementById("time").textContent);
    const wpm = Math.round((currentRomaji.length / 5) / (elapsed / 60));
    document.getElementById("wpm").textContent = wpm;
    document.getElementById("accuracy").textContent = '100';
    setTimeout(startGame, 1000); // 自動で次へ
  } else {
    document.getElementById("resultMessage").textContent = "時間切れです！";
    document.getElementById("retryButton").style.display = 'inline-block';
  }
}
