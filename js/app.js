/*  app.js — dom glue, animations, confetti  */

const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---- sound (web audio, no files) ---- */
const Sound = (() => {
  let ctx;
  const init = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); };

  function tone(freq, dur, type = 'square') {
    init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  return {
    hit()  { tone(180, 0.12); },
    ko()   { tone(300, 0.15); setTimeout(() => tone(200, 0.15), 150); setTimeout(() => tone(120, 0.3), 300); },
    win()  { [523,659,784,1047].forEach((f,i) => setTimeout(() => tone(f, 0.25, 'sine'), i * 130)); }
  };
})();

/* ---- screen management ---- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

/* ---- hp bar color ---- */
function hpColor(pct) {
  if (pct > 50) return 'var(--green)';
  if (pct > 25) return 'var(--yellow)';
  return 'var(--red)';
}

function updateHP(battle) {
  const p1pct = (battle.p1.hp / battle.p1.maxHp) * 100;
  const p2pct = (battle.p2.hp / battle.p2.maxHp) * 100;

  $('#hp1').style.width      = p1pct + '%';
  $('#hp1').style.background = hpColor(p1pct);
  $('#hpn1').textContent     = Math.round(battle.p1.hp);

  $('#hp2').style.width      = p2pct + '%';
  $('#hp2').style.background = hpColor(p2pct);
  $('#hpn2').textContent     = Math.round(battle.p2.hp);
}

/* ---- play one round ---- */
async function animateRound(battle, idx) {
  const entry = battle.playRound(idx);
  const r = entry.round;

  // announce round
  $('#round-num').textContent  = `ROUND ${idx + 1}`;
  $('#round-name').textContent = `${r.emoji} ${r.label}`;
  $('#attack-text').textContent = '';
  $('#stat-cmp').innerHTML = '';
  await wait(700);

  // show stat comparison
  const s1 = `<span class="${entry.winner === 1 ? 'win' : entry.winner === 2 ? 'lose' : 'draw'}">${entry.v1}</span>`;
  const s2 = `<span class="${entry.winner === 2 ? 'win' : entry.winner === 1 ? 'lose' : 'draw'}">${entry.v2}</span>`;
  $('#stat-cmp').innerHTML = `${s1}  vs  ${s2}`;
  await wait(600);

  // attack
  const atkEl = $('#attack-text');
  atkEl.textContent = entry.winner ? `💥 ${r.attack} 💥` : '⚡ DRAW ⚡';
  atkEl.classList.remove('pop');
  void atkEl.offsetWidth;          // reflow trick
  atkEl.classList.add('pop');
  Sound.hit();

  // shake loser
  if (entry.winner) {
    const loser = entry.winner === 1 ? '#fighter-2' : '#fighter-1';
    $(loser).classList.add('hit');
    setTimeout(() => $(loser).classList.remove('hit'), 450);
  }

  await wait(400);
  updateHP(battle);
  await wait(900);
}

/* ---- confetti ---- */
function launchConfetti() {
  const c = $('#confetti');
  const ctx = c.getContext('2d');
  c.width  = innerWidth;
  c.height = innerHeight;

  const colors = ['#a78bfa','#ef4444','#3b82f6','#10b981','#f59e0b','#ec4899'];
  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * c.width,
    y: -10 - Math.random() * 120,
    w: Math.random() * 8 + 4,
    h: Math.random() * 4 + 2,
    dx: (Math.random() - .5) * 3.5,
    dy: Math.random() * 2.5 + 1.8,
    rot: Math.random() * 360,
    dr: (Math.random() - .5) * 8,
    col: colors[Math.floor(Math.random() * colors.length)]
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    let alive = false;
    for (const p of pieces) {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.04;
      p.rot += p.dr;
      if (p.y < c.height + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) frame = requestAnimationFrame(draw);
  }
  draw();
  return () => cancelAnimationFrame(frame);
}

/* ---- result screen ---- */
function showResult(battle) {
  const w = battle.getWinner();
  const winner = w === 1 ? battle.p1 : battle.p2;

  $('#winner-av').src        = winner.avatar;
  $('#winner-name').textContent = `@${winner.username}`;
  $('#rh1').textContent = battle.p1.username;
  $('#rh2').textContent = battle.p2.username;

  const tbody = $('#recap-body');
  tbody.innerHTML = '';

  for (const e of battle.log) {
    const tr = document.createElement('tr');
    const wClass = cls => e.winner === 0 ? 'draw' : cls;
    tr.innerHTML = `
      <td>${e.round.emoji} ${e.round.label}</td>
      <td class="${wClass(e.winner === 1 ? 'round-winner' : 'round-loser')}">${e.v1}</td>
      <td class="${wClass(e.winner === 2 ? 'round-winner' : 'round-loser')}">${e.v2}</td>
      <td class="${e.winner === 0 ? 'draw' : 'round-winner'}">${e.winner === 0 ? 'Draw' : (e.winner === 1 ? battle.p1.username : battle.p2.username)}</td>
    `;
    tbody.appendChild(tr);
  }

  showScreen('#result');
  Sound.win();
  launchConfetti();

  // update url for sharing
  const url = new URL(location);
  url.searchParams.set('p1', battle.p1.username);
  url.searchParams.set('p2', battle.p2.username);
  history.replaceState(null, '', url);
}

/* ---- main flow ---- */
let currentBattle = null;

async function startFight(u1, u2) {
  $('#error').textContent = '';
  showScreen('#loading');

  try {
    const [d1, d2] = await Promise.all([getPlayerData(u1), getPlayerData(u2)]);

    // setup arena
    $('#av1').src          = d1.avatar;
    $('#name1').textContent = d1.username;
    $('#av2').src          = d2.avatar;
    $('#name2').textContent = d2.username;

    currentBattle = new Battle(d1, d2);
    updateHP(currentBattle);

    // clear arena text
    $('#round-num').textContent  = '';
    $('#round-name').textContent = '';
    $('#attack-text').textContent = '';
    $('#stat-cmp').innerHTML = '';

    showScreen('#arena');
    await wait(600);

    // play rounds
    for (let i = 0; i < ROUNDS.length; i++) {
      await animateRound(currentBattle, i);
      if (currentBattle.p1.hp <= 0 || currentBattle.p2.hp <= 0) {
        Sound.ko();
        await wait(600);
        break;
      }
    }

    await wait(400);
    showResult(currentBattle);

  } catch (err) {
    showScreen('#intro');
    $('#error').textContent = err.message;
  }
}

/* ---- events ---- */
$('#fight-form').addEventListener('submit', e => {
  e.preventDefault();
  const u1 = $('#input-p1').value.trim();
  const u2 = $('#input-p2').value.trim();
  if (!u1 || !u2) return;
  if (u1.toLowerCase() === u2.toLowerCase()) {
    $('#error').textContent = "Pick two different users!";
    return;
  }
  startFight(u1, u2);
});

$('#btn-rematch').addEventListener('click', () => {
  if (!currentBattle) return;
  startFight(currentBattle.p1.username, currentBattle.p2.username);
});

$('#btn-new').addEventListener('click', () => {
  showScreen('#intro');
  $('#input-p1').value = '';
  $('#input-p2').value = '';
  $('#input-p1').focus();
});

$('#btn-share').addEventListener('click', () => {
  const b = currentBattle;
  const w = b.getWinner();
  const winner = w === 1 ? b.p1 : b.p2;
  const loser  = w === 1 ? b.p2 : b.p1;

  const text = [
    `⚔️ GitFight Result!`,
    `🏆 @${winner.username} defeated @${loser.username}`,
    ``,
    ...b.log.map(e => `${e.round.emoji} ${e.round.label}: ${e.v1} vs ${e.v2}`),
    ``,
    `🎮 ${location.href}`
  ].join('\n');

  navigator.clipboard.writeText(text).then(() => {
    $('#btn-share').textContent = '✅ Copied!';
    setTimeout(() => $('#btn-share').textContent = '📤 Share', 2000);
  });
});

/* ---- url params auto-fill ---- */
(() => {
  const p = new URLSearchParams(location.search);
  if (p.get('p1')) $('#input-p1').value = p.get('p1');
  if (p.get('p2')) $('#input-p2').value = p.get('p2');
  if (p.get('p1') && p.get('p2')) startFight(p.get('p1'), p.get('p2'));
})();
