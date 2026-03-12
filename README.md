<div align="center">

# ⚔️ GitFight

**Pit two GitHub profiles against each other in an epic RPG-style battle!**

Enter two usernames → watch them fight across 6 rounds → share the result.

[🎮 **Play Now**](https://maxlananas.github.io/gitfight)

<img src="https://img.shields.io/badge/vanilla-HTML%2FCSS%2FJS-A78BFA?style=flat-square" />
<img src="https://img.shields.io/badge/dependencies-zero-10B981?style=flat-square" />
<img src="https://img.shields.io/github/license/maxlananas/gitfight?style=flat-square&color=A78BFA" />
<img src="https://img.shields.io/github/stars/maxlananas/gitfight?style=flat-square&color=f59e0b" />

</div>

---

## ⚡ How it works

1. Enter **two GitHub usernames**
2. Real stats are fetched from the GitHub API
3. **6 RPG rounds** compare different stats
4. The loser of each round **takes damage**
5. The last one standing **wins** 🏆

## 🥊 Battle Rounds

| # | Round | Stat Compared | Attack Name |
|---|---|---|---|
| 1 | 📦 Repository Rumble | Public repos | REPO SLAM |
| 2 | ⭐ Star Storm | Total stars | STAR BLAST |
| 3 | 👥 Follower Frenzy | Followers | FOLLOW WAVE |
| 4 | 🍴 Fork Fury | Total forks | FORK STRIKE |
| 5 | 🌐 Language Lash | Languages used | POLYGLOT PUNCH |
| 6 | 🏛️ Veteran's Valor | Account age | ANCIENT POWER |

## ✨ Features

- 🎮 Retro RPG battle animations
- 🔊 8-bit sound effects (Web Audio API)
- 📤 Share results (copies battle recap to clipboard)
- 🔗 Shareable URLs (`?p1=user1&p2=user2`)
- 🎊 Confetti on victory
- 📱 Fully responsive
- ⚡ Zero dependencies — pure HTML/CSS/JS
- 🔒 100% client-side — no backend

## 🚀 Run locally

```bash
git clone https://github.com/maxlananas/gitfight.git
cd gitfight
# open index.html in your browser, that's it
open index.html
```

No build step. No npm install. Just open the file.

## 🌐 Deploy

Push to GitHub and enable **GitHub Pages** (Settings → Pages → Source: `main`, folder: `/ (root)`).

Your site will be live at `https://yourusername.github.io/gitfight`

## ⚠️ Rate limits

The GitHub API allows **60 requests/hour** without authentication.
Each fight uses ~4 requests. If you hit the limit, wait a minute.

## 📄 License

MIT — do whatever you want with it.

---

<p align="center">
  <samp>Built with ⚔️ by <a href="https://github.com/maxlananas">MaxLananas</a></samp>
</p>
