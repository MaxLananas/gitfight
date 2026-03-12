/*  api.js — github data fetching  */

const GH_API = 'https://api.github.com';

async function fetchUser(username) {
  const res = await fetch(`${GH_API}/users/${username}`);
  if (res.status === 404) throw new Error(`"${username}" not found`);
  if (res.status === 403) throw new Error('Rate limited — wait a minute and retry');
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  return res.json();
}

async function fetchRepos(username) {
  const res = await fetch(`${GH_API}/users/${username}/repos?per_page=100&sort=pushed`);
  if (!res.ok) return [];
  return res.json();
}

function buildStats(user, repos) {
  const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const forks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
  const langs = [...new Set(repos.map(r => r.language).filter(Boolean))];
  const age   = Math.max(1, Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / 3.156e10
  ));

  return {
    username:  user.login,
    avatar:    user.avatar_url,
    name:      user.name || user.login,
    repos:     user.public_repos || 0,
    stars,
    forks,
    followers: user.followers || 0,
    gists:     user.public_gists || 0,
    languages: langs.length,
    age
  };
}

async function getPlayerData(username) {
  const user  = await fetchUser(username.trim());
  const repos = await fetchRepos(username.trim());
  return buildStats(user, repos);
}
