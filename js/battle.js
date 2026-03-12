/*  battle.js — rpg battle engine  */

const ROUNDS = [
  { key: 'repos',     label: 'Repository Rumble',  emoji: '📦', attack: 'REPO SLAM'      },
  { key: 'stars',     label: 'Star Storm',         emoji: '⭐', attack: 'STAR BLAST'     },
  { key: 'followers', label: 'Follower Frenzy',    emoji: '👥', attack: 'FOLLOW WAVE'    },
  { key: 'forks',     label: 'Fork Fury',          emoji: '🍴', attack: 'FORK STRIKE'    },
  { key: 'languages', label: 'Language Lash',      emoji: '🌐', attack: 'POLYGLOT PUNCH' },
  { key: 'age',       label: "Veteran's Valor",    emoji: '🏛️', attack: 'ANCIENT POWER'  }
];

class Battle {
  constructor(s1, s2) {
    this.p1 = { ...s1, hp: 500, maxHp: 500 };
    this.p2 = { ...s2, hp: 500, maxHp: 500 };
    this.log = [];
  }

  /* damage scales with the gap between the two stats */
  _dmg(winner, loser) {
    const base = 45;
    const gap  = Math.min(Math.abs(winner - loser), 200);
    const bonus = Math.floor(gap * 0.35);
    const rand  = Math.floor(Math.random() * 25);
    return base + bonus + rand;
  }

  playRound(idx) {
    const r  = ROUNDS[idx];
    const v1 = this.p1[r.key];
    const v2 = this.p2[r.key];

    const entry = { round: r, v1, v2, winner: 0, dmg: 0 };

    if (v1 > v2) {
      entry.winner = 1;
      entry.dmg = this._dmg(v1, v2);
      this.p2.hp = Math.max(0, this.p2.hp - entry.dmg);
    } else if (v2 > v1) {
      entry.winner = 2;
      entry.dmg = this._dmg(v2, v1);
      this.p1.hp = Math.max(0, this.p1.hp - entry.dmg);
    } else {
      // draw — both take a small hit
      entry.dmg = 25;
      this.p1.hp = Math.max(0, this.p1.hp - 25);
      this.p2.hp = Math.max(0, this.p2.hp - 25);
    }

    this.log.push(entry);
    return entry;
  }

  getWinner() {
    if (this.p1.hp > this.p2.hp) return 1;
    if (this.p2.hp > this.p1.hp) return 2;
    return this.p1.stars >= this.p2.stars ? 1 : 2; // tiebreaker
  }
}
