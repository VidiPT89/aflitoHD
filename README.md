# 🚪 Aflito HD — The Secret Door Guessing Game

> A polished, animated remake of the classic "guess the number" game — pick a door, follow the heat, and find the secret number before your attempts run out.

**🎮 [Live Demo](https://vidipt89.github.io/aflitoHD/)**

"Jogo do Aflito" is a browser-based number guessing game built with vanilla HTML, CSS and JavaScript — no frameworks, no build step. The computer picks a secret number behind one of several "doors" and you have a limited number of attempts to find it. Every guess updates a live proximity meter (Cold → Hot) and tells you whether to aim higher or lower, while an animated attempt tracker, a running guess history and sound effects keep the tension up. Win and you get a confetti burst and a stats recap; run out of attempts and the door swings open to reveal the number anyway. The whole interface is fully bilingual, switching instantly between European Portuguese and English.

## 📦 What's Inside

- 🚪 Three difficulty levels — Easy (1–50, 10 tries), Normal (1–100, 8 tries), Hard (1–200, 6 tries)
- 🌡️ Live proximity meter with five heat levels (Freezing → Blazing) that fills and changes color as you get closer
- 🚦 Animated attempt tracker — a row of "door" pips that fill in as attempts are used
- 📜 Real-time guess history with slide-in animations, color-coded by hint (higher / lower / correct)
- 🏆 Best-score tracking per difficulty, saved locally, with a "new record" callout on the win screen
- 🎉 Canvas confetti burst on victory, card-shake feedback on defeat
- 🔊 Optional sound effects generated live with the Web Audio API — no audio files
- 🇵🇹 🇬🇧 One-click language toggle between European Portuguese and English, remembered between visits
- 🌌 Animated ambient background — drifting particles and soft gradient glows, fully canvas-based
- 📱 Fully responsive, keyboard-friendly (Enter to guess), accessible result announcements
- 🛡️ Input validation with an inline shake animation instead of intrusive alerts

## 🛠️ Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🏗️ Project Structure

```
aflitoHD/
├── index.html      # Page structure, difficulty picker, game card, win/lose modal
├── style.css       # Theme, layout, animations (glow, shake, confetti, transitions)
├── script.js       # Game logic, i18n, sound, confetti and ambient background
├── LICENSE         # MIT License
└── README.md
```

## ⚙️ Game Mechanics

```
New Game:
  secret = random integer in [min, max] for the selected difficulty
  attemptsUsed = 0

Each Guess:
  1. Validate input (must be a number within [min, max])
  2. Increment attemptsUsed, update the door tracker
  3. Compute proximity → update heat meter + label
  4. guess == secret        → win: confetti + stats modal
     guess < secret         → "Go higher" hint
     guess > secret         → "Go lower" hint
  5. attemptsUsed >= max AND not won → game over: reveal secret + stats modal
```

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/VidiPT89/aflitoHD.git

# 2. Open index.html in your browser
cd aflitoHD
open index.html    # macOS
# or: start index.html (Windows) / xdg-open index.html (Linux)

# 3. Pick a difficulty, guess a number and follow the heat meter
```

No build step, no dependencies — it's static HTML/CSS/JS and can also be served with any static file server (e.g. `python3 -m http.server`).

## 📝 Notes

- This is the "HD" remake of [aflito](https://github.com/VidiPT89/aflito), the original minimal version of the game — same core idea, rebuilt from scratch with a real interface, animations and extra features
- Language and sound preferences are stored in `localStorage`, so they persist between visits
- The secret number for the current game is logged to the browser console for quick manual testing

---

Developed by **David Arsénio Martins** — *"Vidi"*
