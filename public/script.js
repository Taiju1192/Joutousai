const textSamples = [
  "今日はいい天気ですね。",
  "プログラミングを練習しよう。",
  "明日は友達と映画を見に行きます。",
  "図書館で静かに本を読みましょう。",
  "早起きは三文の徳と言われています。"
];

let startTime;
let timerInterval;
let currentJapanese = '';
let currentRomaji = '';

const customKanaMapping = {
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  つ: ['tsu', 'tu'], し: ['shi', 'si'], じ: ['ji', 'zi'],
  ぁ: ['xa', 'la'], ぃ: ['xi', 'li'], ぅ: ['xu', 'lu'], ぇ: ['xe', 'le'], ぉ: ['xo', 'lo'],
  っ: ['xtsu', 'ltu', 'ltsu']
};

function startGame() {
  currentJapanese = textSamples[Math.floor(Math.random() * textSamples.length)];
  currentRomaji = wanakana.toRomaji(currentJapanese);

  document.getElementById("displayJapanese").textContent = currentJapanese;
  document.getElementById("displayRomaji").textContent = currentRomaji;

  document.getElementById("inputArea").value = '';
  document.getElementById("accuracy").textContent = '-';
  document.getElementById("wpm").textContent = '-';
  document.getElementById("time").textContent = '0';

  startTime = new Date();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);

  document.getElementById("inputArea").addEventListener('input', checkTyping);
}

function updateTime() {
  const elapsed = Math.floor((new Date() - startTime) / 1000);
  document.getElementById("time").textContent = elapsed;
}

function checkTyping() {
  const input = document.getElementById("inputArea").value.trim().toLowerCase();
  const target = currentRomaji.toLowerCase();

  if (input === target) {
    clearInterval(timerInterval);
    const totalTime = (new Date() - startTime) / 1000;
    const wpm = Math.round((target.length / 5) / (totalTime / 60));
    const accuracy = Math.round((compareAccuracy(input, target)) * 100);

    document.getElementById("accuracy").textContent = accuracy;
    document.getElementById("wpm").textContent = wpm;
  }
}

function compareAccuracy(input, target) {
  let correct = 0;
  for (let i = 0; i < Math.min(input.length, target.length); i++) {
    if (input[i] === target[i]) correct++;
  }
  return correct / target.length;
}
