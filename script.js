// Note frequencies (Hz)
const NOTES = {
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13,
  "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00,
  "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
  "C5": 523.25
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = "triangle"; // Piano-like sound
  oscillator.frequency.value = frequency;

  // Envelope (attack-decay) for a softer piano feel
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
}

const keys = document.querySelectorAll(".key");
const sargamSequence = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
const playSargamButton = document.getElementById("play-sargam");
const songInput = document.getElementById("song-input");
const tempoInput = document.getElementById("tempo");
const playSongButton = document.getElementById("play-song");
const stopSongButton = document.getElementById("stop-song");
const clearSongButton = document.getElementById("clear-song");
const presetSelect = document.getElementById("preset-select");
const loadPresetButton = document.getElementById("load-preset");
const playPresetButton = document.getElementById("play-preset");
const loopSongToggle = document.getElementById("loop-song");
const songError = document.getElementById("song-error");
const REST = "__REST__";
let scheduledTimeouts = [];
let loopTimeoutId = null;

const PRESETS = {
  romantic: {
    label: "Romantic Flow (Practice)",
    pattern: "Sa Re Ga Ma | Pa Ma Ga Re | Sa Re Ga Ma | Pa Dha Ni Sa'"
  },
  sufi: {
    label: "Sufi Loop (Practice)",
    pattern: "Sa Re Sa | Ma Pa Ma | Ga Re Sa | Pa Ma Ga -"
  },
  yaman: {
    label: "Raga Yaman Scale (Practice)",
    pattern: "Sa Re Ga Tivra Ma Pa Dha Ni Sa' | Sa' Ni Dha Pa Tivra Ma Ga Re Sa"
  }
};

// Click support
keys.forEach(key => {
  key.addEventListener("click", () => {
    const note = key.dataset.note;
    playNote(NOTES[note]);
    flash(key);
  });
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = document.querySelector(`.key[data-key="${e.key.toUpperCase()}"]`);
  if (key && !key.classList.contains("active")) {
    const note = key.dataset.note;
    playNote(NOTES[note]);
    flash(key);
  }
});

function playSequence(sequence, intervalMs = 350) {
  clearScheduled();
  sequence.forEach((note, index) => {
    const timeoutId = setTimeout(() => {
      if (note !== REST) {
        playNote(NOTES[note]);
        const key = document.querySelector(`.key[data-note="${note}"]`);
        if (key) flash(key);
      }
    }, intervalMs * index);
    scheduledTimeouts.push(timeoutId);
  });

  if (loopSongToggle?.checked) {
    const totalDuration = intervalMs * sequence.length;
    loopTimeoutId = setTimeout(() => {
      playSequence(sequence, intervalMs);
    }, totalDuration);
  }
}

function clearScheduled() {
  scheduledTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  scheduledTimeouts = [];
  if (loopTimeoutId) {
    clearTimeout(loopTimeoutId);
    loopTimeoutId = null;
  }
}

function tokenizeSongInput(input) {
  const rawTokens = input.split(/[\s,|]+/).filter(Boolean);
  const tokens = [];
  for (let i = 0; i < rawTokens.length; i += 1) {
    const current = rawTokens[i];
    const lower = current.toLowerCase();
    if ((lower === "komal" || lower === "tivra") && i + 1 < rawTokens.length) {
      tokens.push(`${lower}${rawTokens[i + 1]}`);
      i += 1;
    } else {
      tokens.push(current);
    }
  }
  return tokens;
}

function komalNote(base) {
  const normalized = base.replace(/[^a-z]/g, "");
  if (normalized === "re" || normalized === "r") return "C#4";
  if (normalized === "ga" || normalized === "g") return "D#4";
  if (normalized === "dha" || normalized === "dh" || normalized === "d") return "G#4";
  if (normalized === "ni" || normalized === "n") return "A#4";
  return null;
}

function tivraNote(base) {
  const normalized = base.replace(/[^a-z]/g, "");
  if (normalized === "ma" || normalized === "m") return "F#4";
  return null;
}

function parseToken(token) {
  const raw = token.toLowerCase().trim();
  if (!raw) return null;
  if (raw === "-" || raw === "_" || raw === "rest" || raw === "pause") {
    return REST;
  }
  const cleaned = raw.replace(/[^a-z0-9#']/g, "");
  if (!cleaned) return null;

  const upper = cleaned.toUpperCase();
  if (NOTES[upper]) return upper;

  if (cleaned === "sa'" || cleaned === "s'" || cleaned === "sa5" || cleaned === "s5") {
    return "C5";
  }

  if (cleaned.startsWith("komal")) {
    return komalNote(cleaned.replace(/^komal/, ""));
  }

  if (cleaned.startsWith("k")) {
    return komalNote(cleaned.replace(/^k/, ""));
  }

  if (cleaned.startsWith("tivra")) {
    return tivraNote(cleaned.replace(/^tivra/, ""));
  }

  if (cleaned === "ma#" || cleaned === "m#") {
    return "F#4";
  }

  if (cleaned.endsWith("b")) {
    return komalNote(cleaned.slice(0, -1));
  }

  const sargamMap = {
    sa: "C4",
    re: "D4",
    ga: "E4",
    ma: "F4",
    pa: "G4",
    dha: "A4",
    ni: "B4"
  };

  if (sargamMap[cleaned]) return sargamMap[cleaned];

  const sargamShortMap = {
    s: "C4",
    r: "D4",
    g: "E4",
    m: "F4",
    p: "G4",
    d: "A4",
    n: "B4"
  };

  if (sargamShortMap[cleaned]) return sargamShortMap[cleaned];

  return null;
}

function parseSongInput(input) {
  const tokens = tokenizeSongInput(input);
  if (!tokens.length) {
    return { notes: [], error: "Enter some Sargam or note names to play." };
  }

  const notes = [];
  for (const token of tokens) {
    const note = parseToken(token);
    if (note === REST) {
      notes.push(REST);
      continue;
    }
    if (!note || !NOTES[note]) {
      return { notes: [], error: `Unknown token: "${token}"` };
    }
    notes.push(note);
  }
  return { notes, error: "" };
}

function getTempo() {
  const tempo = Number.parseInt(tempoInput?.value, 10);
  if (!Number.isFinite(tempo)) return 320;
  return Math.min(Math.max(tempo, 140), 800);
}

function playFromText(text) {
  const { notes, error } = parseSongInput(text);
  if (songError) {
    songError.textContent = error;
  }
  if (!notes.length) {
    return;
  }
  playSequence(notes, getTempo());
}

function loadPreset() {
  if (!presetSelect || !songInput) return;
  const preset = PRESETS[presetSelect.value];
  if (!preset) return;
  songInput.value = preset.pattern;
  if (songError) {
    songError.textContent = "";
  }
}

function flash(key) {
  key.classList.add("active");
  setTimeout(() => key.classList.remove("active"), 150);
}

if (playSargamButton) {
  playSargamButton.addEventListener("click", () => {
    playSequence(sargamSequence);
  });
}

if (playSongButton && songInput) {
  playSongButton.addEventListener("click", () => {
    playFromText(songInput.value);
  });
}

if (stopSongButton) {
  stopSongButton.addEventListener("click", () => {
    clearScheduled();
  });
}

if (clearSongButton && songInput) {
  clearSongButton.addEventListener("click", () => {
    songInput.value = "";
    if (songError) {
      songError.textContent = "";
    }
    clearScheduled();
  });
}

if (loadPresetButton) {
  loadPresetButton.addEventListener("click", () => {
    loadPreset();
  });
}

if (playPresetButton) {
  playPresetButton.addEventListener("click", () => {
    loadPreset();
    if (songInput) {
      playFromText(songInput.value);
    }
  });
}
