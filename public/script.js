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

let tokenizer;
let currentJapanese = '';
let currentRomaji = '';
let romajiChars = [];
let userInput = '';
let currentIndex = 0;
let timer;
let timeLimit = 30;

function loadTokenizerAndStart() {
  kuromoji.builder({ dicPath: "https://unpkg.com/kuromoji/dict/" }).build(function (err, tk) {
    if (err) {
      alert("形態素解析器の読み込みに失敗しました");
      return;
    }
    tokenizer = tk;
    startGame();
  });
}

document.getElementById("startButton").addEventListener("click", loadTokenizerAndStart);

document.getElementById("retryButton").addEventListener("click", loadTokenizerAndStart);

function convertToRomajiArray(text) {
  const tokens = tokenizer.tokenize(text);
  const romaji = [];
  for (let token of tokens) {
    let kana = token.reading || token.surface_form;
    let hira = wanakana.toHiragana(kana);
    for (let char of hira) {
      const r = getRomajiVariants(char);
      romaji.push(r);
    }
  }
  return romaji;
}

function getRomajiVariants(kana) {
  const variants = {
    'し': ['shi', 'si'],
    'ち': ['chi', 'ti'],
    'つ': ['tsu', 'tu'],
    'ふ': ['fu', 'hu'],
    'じ': ['ji', 'zi'],
    'ぢ': ['ji', 'di'],
    'づ': ['zu', 'du'],
    'っ': ['xtsu', 'ltu', 'ltsu', 'xtu', 'ttu'],
    'ぁ': ['la', 'xa'],
    'ぃ': ['li', 'xi'],
    'ぅ': ['lu', 'xu'],
    'ぇ': ['le', 'xe'],
    'ぉ': ['lo', 'xo'],
    'ゃ': ['lya', 'xya'],
    'ゅ': ['lyu', 'xyu'],
    'ょ': ['lyo', 'xyo']
  };
  return variants[kana] || [wanakana.toRomaji(kana)];
}

function startGame() {
  clearInterval(timer);
  currentJapanese = textSamples[Math.floor(Math.random() * textSamples.length)];
  document.getElementById("displayJapanese").textContent = currentJapanese;
  romajiChars = convertToRomajiArray(currentJapanese);
  currentRomaji = romajiChars.flat()[0];
  userInput = '';
  currentIndex = 0;
  document.getElementById("inputArea").value = '';
  document.getElementById("inputArea").disabled = false;
  document.getElementById("resultMessage").textContent = '';
  document.getElementById("retryButton").style.display = 'none';
  updateRomajiDisplay();
  startTimer();
  document.getElementById("inputArea").focus();
  document.getElementById("inputArea").addEventListener("input", onInput);
}

function updateRomajiDisplay() {
  let typed = '';
  let remaining = '';
  for (let i = 0; i < romajiChars.length; i++) {
    const options = romajiChars[i];
    const displayChar = options[0];
    if (i < currentIndex) {
      typed += `<span class="typed">${displayChar}</span>`;
    } else {
      remaining += displayChar;
    }
  }
  document.getElementById("romajiDisplay").innerHTML = typed + remaining;
}

function onInput() {
  const input = document.getElementById("inputArea").value.trim().toLowerCase();
  let i = 0;
  let idx = 0;
  while (idx < romajiChars.length && i < input.length) {
    const options = romajiChars[idx];
    let matched = false;
    for (let option of options) {
      if (input.startsWith(option, i)) {
        i += option.length;
        idx++;
        matched = true;
        break;
      }
    }
    if (!matched) break;
  }
  currentIndex = idx;
  updateRomajiDisplay();
  if (idx === romajiChars.length && i === input.length) {
    clearInterval(timer);
    gameSuccess();
  }
}

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("time").textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

function gameSuccess() {
  document.getElementById("accuracy").textContent = '100';
  document.getElementById("wpm").textContent = Math.round(romajiChars.flat().join('').length / 5 / (timeLimit - parseInt(document.getElementById("time").textContent)) * 60);
  setTimeout(startGame, 1000);
}

function gameOver() {
  document.getElementById("resultMessage").textContent = "時間切れです！";
  document.getElementById("retryButton").style.display = 'inline-block';
  document.getElementById("inputArea").disabled = true;
}
