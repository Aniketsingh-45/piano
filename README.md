# 🎹 Bollywood / Hindi Piano

A lightweight, interactive web-based piano tailored for playing Bollywood, Hindi, and Indian Classical melodies. It features visual Sargam (Indian musical scale) notations, interactive mouse and keyboard controls, a built-in synth, a practice library with preset patterns, and a custom song player that interprets Sargam/note-based inputs.

Built entirely using native Web technologies: **HTML5**, **CSS3**, and **Vanilla JavaScript** with the **Web Audio API**—no dependencies, no configuration, and zero audio-loading latency.

---

## 🌟 Features

*   **Interactive Playback**: Play notes using mouse clicks or keyboard mappings.
*   **Sargam & Western Notations**: Dual labels on the keys help you bridge Indian Classical notes (*Sa, Re, Ga, Ma, Pa, Dha, Ni*) with Western notes.
*   **Zero-Dependency Sound Generation**: Uses the Web Audio API to synthesize a clean, piano-like sound dynamically in the browser.
*   **Song Library (Practice)**: Load and play pre-programmed classical & popular practice loops such as Raga Yaman or Sufi patterns.
*   **Custom Song Player**: Input your own songs using Sargam or Western notes, adjust the tempo, and toggle loops.
*   **Flexible Parser**: Supports multiple formats for custom inputs (e.g., `Komal`, `Tivra`, flats `b`, sharps `#`, and rests `-`).

---

## 🎹 Keyboard Mappings

Play the piano keys using your physical keyboard. The mappings are as follows:

### White Keys (Natural Notes / Shuddha Swaras)

| Key | Keyboard Shortcut | Sargam Label | Note Name |
| :--- | :---: | :---: | :---: |
| **C4** | `A` | Sa | C4 |
| **D4** | `S` | Re | D4 |
| **E4** | `D` | Ga | E4 |
| **F4** | `F` | Ma | F4 |
| **G4** | `G` | Pa | G4 |
| **A4** | `H` | Dha | A4 |
| **B4** | `J` | Ni | B4 |
| **C5** | `K` | Sa' | C5 |

### Black Keys (Komal & Tivra Swaras)

| Key | Keyboard Shortcut | Sargam Label | Note Name |
| :--- | :---: | :---: | :---: |
| **C#4** | `W` | Komal Re | C#4 |
| **D#4** | `E` | Komal Ga | D#4 |
| **F#4** | `T` | Tivra Ma | F#4 |
| **G#4** | `Y` | Komal Dha | G#4 |
| **A#4** | `U` | Komal Ni | A#4 |

---

## 🎼 Song Player Syntax

The Custom Song Player parses text sequences to play melodies. You can separate notes with spaces or `|` characters (bar lines).

### Supported Formats

1.  **Sargam Notation**:
    *   *Shuddha (Natural)*: `Sa`, `Re`, `Ga`, `Ma`, `Pa`, `Dha`, `Ni`, `Sa'`
    *   *Komal (Flat)*: `Komal Re` (or `Reb`), `Komal Ga` (or `Gab`), `Komal Dha` (or `Dhab`), `Komal Ni` (or `Nib`)
    *   *Tivra (Sharp)*: `Tivra Ma` (or `Ma#`)
2.  **Short Sargam**:
    *   `s`, `r`, `g`, `m`, `p`, `d`, `n`, `s'`
3.  **Western Notes**:
    *   `C4`, `C#4`, `D4`, `D#4`, `E4`, `F4`, `F#4`, `G4`, `G#4`, `A4`, `A#4`, `B4`, `C5`
4.  **Rests / Pauses**:
    *   Use `-`, `_`, `rest`, or `pause` to insert a silent interval.

### Examples to Try

*   **Sargam Scale**:
    ```text
    Sa Re Ga Ma | Pa Dha Ni Sa'
    ```
*   **Romantic Flow (Practice)**:
    ```text
    Sa Re Ga Ma | Pa Ma Ga Re | Sa Re Ga Ma | Pa Dha Ni Sa'
    ```
*   **Raga Yaman (Classical Scale)**:
    ```text
    Sa Re Ga Tivra Ma Pa Dha Ni Sa' | Sa' Ni Dha Pa Tivra Ma Ga Re Sa
    ```
*   **Western Notes**:
    ```text
    C4 D4 E4 F4 | G4 A4 B4 C5
    ```

---

## 🛠️ How to Run

1.  Clone this repository or download the source files.
2.  Navigate to the directory in your file system.
3.  Double-click `index.html` to open it in your browser (Chrome, Firefox, Safari, Edge, etc.).
4.  Start playing! (No local server or build steps required).

---

## 💻 Tech Stack & Design

*   **Structure**: Semantic HTML5 layout.
*   **Styling**: Vanilla CSS3. Features a premium glassmorphic control dashboard (`backdrop-filter`), smooth key transitions, interactive visual flashing (`.active` keys), and a responsive modern background gradient (`#1e3c72` to `#2a5298`).
*   **Logic & Synthesizer**: Pure Vanilla JS. Rather than loading large static audio files, the synth uses the **Web Audio API** `OscillatorNode` (configured to `triangle` wave for a softer, piano-like tone) and a customized AD (Attack-Decay) envelope using a `GainNode` for smooth volume fade-outs:
    ```javascript
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    ```