// Import required modules
import { Octokit } from '@octokit/rest';
import axios from 'axios';
import { Pool } from 'pg';

// Environment variables (to be set in Vercel)
const GITLAB_ACCESS_TOKEN = process.env.GITLAB_ACCESS_TOKEN;
const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
const CODEBERG_API_KEY = process.env.CODEBERG_API_KEY;
const POSTGRES_URL = process.env.POSTGRES_URL;

// Initialize Octokit for GitHub API
const octokit = new Octokit({ auth: GITHUB_API_KEY });

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const logMessage = (message) => {
  console.log(`${new Date().toISOString()} - ${message}`);
};

async function fetchGitHubRepos(query, page) {
  try {
    const response = await octokit.rest.search.repos({
      q: query,
      per_page: 100,
      page: page
    });
    return response.data.items.map(repo => ({
      description: repo.description,
      html_url: repo.html_url,
      stars: repo.stargazers_count,
      last_updated: repo.updated_at,
      owner: repo.owner.login,
      project_id: repo.id
    }));
  } catch (error) {
    logMessage(`Error fetching GitHub repos: ${error.message}`);
    return [];
  }
}

async function fetchGitLabRepos(page) {
  try {
    const response = await axios.get(`https://gitlab.com/api/v4/projects`, {
      params: {
        search: 'dotfiles',
        per_page: 100,
        page: page
      },
      headers: {
        'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN
      }
    });
    return response.data.map(repo => ({
      description: repo.description,
      html_url: repo.web_url,
      stars: repo.star_count,
      last_updated: repo.last_activity_at,
      owner: repo.namespace.name,
      project_id: repo.id
    }));
  } catch (error) {
    logMessage(`Error fetching GitLab repos: ${error.message}`);
    return [];
  }
}

async function fetchCodebergRepos(page) {
  try {
    const response = await axios.get(`https://codeberg.org/api/v1/repos/search`, {
      params: {
        q: 'dotfiles',
        limit: 100,
        page: page
      },
      headers: {
        'Authorization': `token ${CODEBERG_API_KEY}`
      }
    });
    return response.data.data.map(repo => ({
      description: repo.description,
      html_url: repo.html_url,
      stars: repo.stars_count,
      last_updated: repo.updated_at,
      owner: repo.owner.username,
      project_id: repo.id
    }));
  } catch (error) {
    logMessage(`Error fetching Codeberg repos: ${error.message}`);
    return [];
  }
}

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS repositories (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL UNIQUE,
        owner TEXT NOT NULL,
        description TEXT,
        stars INTEGER DEFAULT 0,
        last_updated TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS configurations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS repository_configurations (
        repository_id INTEGER REFERENCES repositories(id),
        configuration_id INTEGER REFERENCES configurations(id),
        PRIMARY KEY (repository_id, configuration_id)
      );
    `);
  } finally {
    client.release();
  }
}

async function insertRepositories(repos) {
  const client = await pool.connect();
  try {
    for (const repo of repos) {
      await client.query(`
        INSERT INTO repositories (owner, url, description, stars, last_updated)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (url) DO UPDATE
        SET owner = EXCLUDED.owner,
            description = EXCLUDED.description,
            stars = EXCLUDED.stars,
            last_updated = EXCLUDED.last_updated;
      `, [repo.owner, repo.html_url, repo.description, repo.stars, repo.last_updated]);
    }
  } finally {
    client.release();
  }
}

async function detectTechStack(repoUrl) {
  const techMapping = {
    "tmux": "tmux", "hypr": "hypr", "i3": "i3", "sway": "sway", "nvim": "neovim",
    "neovim": "neovim", "vim": "vim", "alacritty": "alacritty", "kitty": "kitty",
    "wezterm": "wezterm", "zsh": "zsh", "bash": "bash", "fish": "fish",
    "emacs": "emacs", "polybar": "polybar", "dunst": "dunst", "picom": "picom",
    "rofi": "rofi", "conky": "conky", "xmonad": "xmonad", "awesome": "awesomeWM",
    "qtile": "qtile", "openbox": "openbox", "bspwm": "bspwm",
    "herbstluftwm": "herbstluftwm", "fluxbox": "fluxbox", "lxqt": "lxqt",
    "cinnamon": "cinnamon", "xfce": "xfce", "gnome": "gnome", "kde": "kde/plasma",
    "plasma": "kde/plasma", "nix": "nix", "brew": "brew", "vscode": "vscode",
    "sublime": "sublime", "zprofile": "zprofile", "xprofile": "xprofile",
    "waybar": "waybar", "wofi": "wofi"
  };

  let contents = [];
  if (repoUrl.includes('github.com')) {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: '' });
    contents = data.map(item => item.name);
  } else if (repoUrl.includes('gitlab.com')) {
    const projectId = repoUrl.split('/').pop();
    const response = await axios.get(`https://gitlab.com/api/v4/projects/${projectId}/repository/tree`, {
      headers: { 'PRIVATE-TOKEN': GITLAB_ACCESS_TOKEN }
    });
    contents = response.data.map(item => item.name);
  } else if (repoUrl.includes('codeberg.org')) {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    const response = await axios.get(`https://codeberg.org/api/v1/repos/${owner}/${repo}/contents`, {
      headers: { 'Authorization': `token ${CODEBERG_API_KEY}` }
    });
    contents = response.data.map(item => item.name);
  }

  const detectedTech = contents.reduce((acc, item) => {
    for (const [pattern, stack] of Object.entries(techMapping)) {
      if (item.includes(pattern)) {
        acc.add(stack);
      }
    }
    return acc;
  }, new Set());

  return Array.from(detectedTech);
}

async function updateConfigurations(repoUrl, techStack) {
  const client = await pool.connect();
  try {
    for (const tech of techStack) {
      await client.query(`
        INSERT INTO configurations (name) VALUES ($1)
        ON CONFLICT (name) DO NOTHING;
        
        INSERT INTO repository_configurations (repository_id, configuration_id)
        VALUES (
          (SELECT id FROM repositories WHERE url = $2),
          (SELECT id FROM configurations WHERE name = $1)
        )
        ON CONFLICT DO NOTHING;
      `, [tech, repoUrl]);
    }
  } finally {
    client.release();
  }
}

export default async function handler(req, res) {
  try {
    logMessage("Starting cron job");

    await createTables();

    const allRepos = [];
    for (let i = 1; i <= 10; i++) {
      allRepos.push(...await fetchGitHubRepos('dotfiles', i));
      allRepos.push(...await fetchGitHubRepos('dotfiles in:description', i));
      allRepos.push(...await fetchGitHubRepos('kitty in:name dotfiles in:name neovim in:name tmux in:name', i));
      allRepos.push(...await fetchGitHubRepos('dotfiles kitty neovim tmux in:name,description', i));
      allRepos.push(...await fetchGitLabRepos(i));
      allRepos.push(...await fetchCodebergRepos(i));
    }

    await insertRepositories(allRepos);

    for (const repo of allRepos) {
      const techStack = await detectTechStack(repo.html_url);
      await updateConfigurations(repo.html_url, techStack);
    }

    logMessage("Cron job completed successfully");
    res.status(200).json({ message: "Cron job completed successfully" });
  } catch (error) {
    logMessage(`Error in cron job: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
}
