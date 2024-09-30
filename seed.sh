#!/bin/bash

# This should run as a cron job (every 30 minutes to update the webpage)
DATABASE_FILE="dotHub.sqlite"
JSON_FILE="repos.json"

# KRIETIV Thinking
# I really am a genius
escape_single_quotes() {
    echo "${1//\'/\'\'}"
}

create_tables() {
  sqlite3 "$DATABASE_FILE" << EOF
  CREATE TABLE IF NOT EXISTS repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    owner TEXT NOT NULL,
    description TEXT,
    stars INTEGER DEFAULT 0,
    last_updated DATETIME
  );

  CREATE TABLE IF NOT EXISTS configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS repository_configurations (
    repository_id INTEGER,
    configuration_id INTEGER,
    FOREIGN KEY (repository_id) REFERENCES repositories(id),
    FOREIGN KEY (configuration_id) REFERENCES configurations(id),
    PRIMARY KEY (repository_id, configuration_id)
  );
EOF
}

insert_repositories() {
  jq -c '.[]' "$JSON_FILE" | while read -r repo; do
    owner=$(jq -r '.owner' <<< "$repo")
    url=$(jq -r '.html_url' <<< "$repo")
    description=$(jq -r '.description' <<< "$repo")
    stars=$(jq -r '.stars' <<< "$repo")
    last_updated=$(jq -r '.last_updated' <<< "$repo")

    escaped_description=$(escape_single_quotes "$description")

    sqlite3 "$DATABASE_FILE" << EOF
    INSERT OR REPLACE INTO repositories (owner, url, description, stars, last_updated) 
    VALUES ('$owner', '$url', '$escaped_description', $stars, '$last_updated');
EOF
  done
}

detect_tech_stack() {
  local repo_slashed_name="$1"
  local repo_url="$2"
  local tech_stack=()
  
if [[ "$repo_url" == *github* ]]; then
    echo "URL is from GitHub."
    echo "Repo slashed name is $repo_slashed_name and full name is $repo_url."
    contents=$(gh api "repos/$repo_slashed_name/contents" | jq '.[].name')
    echo "Processing GitHub URL: $repo_slashed_name"

elif [[ "$repo_url" == *gitlab* ]]; then
    echo "URL is from GitLab."
    contents=$(curl --header "PRIVATE-TOKEN: $ACCESS_TOKEN" \
        "https://gitlab.com/api/v4/projects/$repo_slashed_name/repository/tree" | jq '.[].name')
    echo "Processing GitLab URL: $repo_slashed_name"

elif [[ "$repo_url" == *codeberg* ]]; then
    echo "URL is from Codeberg."
    contents=$(curl -X 'GET' \
        "https://codeberg.org/api/v1/repos/$repo_slashed_name/contents" \
        -H 'accept: application/json' | jq '.[].name')
    echo "Processing Codeberg URL: $repo_slashed_name"

else
    echo "URL is from an unknown platform."
fi
  for item in $contents; do
    case "$item" in
      *tmux*) tech_stack+=("tmux") ;;
      *hypr*) tech_stack+=("hypr") ;;
      *i3*) tech_stack+=("i3") ;;
      *sway*) tech_stack+=("sway") ;;
      *nvim* | *neovim*) tech_stack+=("neovim") ;;
      *vim*) tech_stack+=("vim") ;;
      *alacritty*) tech_stack+=("alacritty") ;;
      *kitty*) tech_stack+=("kitty") ;;
      *wezterm*) tech_stack+=("wezterm") ;;
      *zsh*) tech_stack+=("zsh") ;;
      *bash*) tech_stack+=("bash") ;;
      *fish*) tech_stack+=("fish") ;;
      *emacs*) tech_stack+=("emacs") ;;
      *polybar*) tech_stack+=("polybar") ;;
      *dunst*) tech_stack+=("dunst") ;;
      *picom*) tech_stack+=("picom") ;;
      *rofi*) tech_stack+=("rofi") ;;
      *conky*) tech_stack+=("conky") ;;
      *xmonad*) tech_stack+=("xmonad") ;;
      *awesome*) tech_stack+=("awesomeWM") ;;
      *qtile*) tech_stack+=("qtile") ;;
      *openbox*) tech_stack+=("openbox") ;;
      *bspwm*) tech_stack+=("bspwm") ;;
      *herbstluftwm*) tech_stack+=("herbstluftwm") ;;
      *fluxbox*) tech_stack+=("fluxbox") ;;
      *lxqt*) tech_stack+=("lxqt") ;;
      *cinnamon*) tech_stack+=("cinnamon") ;;
      *xfce*) tech_stack+=("xfce") ;;
      *gnome*) tech_stack+=("gnome") ;;
      *kde* | *plasma*) tech_stack+=("kde/plasma") ;;
      *nix*) tech_stack+=("nix") ;;
      *brew*) tech_stack+=("brew") ;;
      *vscode*) tech_stack+=("vscode") ;;
      *sublime*) tech_stack+=("sublime") ;;
      *zprofile*) tech_stack+=("zprofile") ;;
      *xprofile*) tech_stack+=("xprofile") ;;
      *waybar*) tech_stack+=("waybar") ;;
      *wofi*) tech_stack+=("wofi") ;;
    esac
  done

  if [ ${#tech_stack[@]} -eq 0 ]; then
    echo "No specific tech detected for $repo_slashed_name"
  else
    echo "Tech Stack for $repo_slashed_name: ${tech_stack[*]}"
    for stack in "${tech_stack[@]}"; do
      escaped_stack=$(escape_single_quotes "$stack")
      sqlite3 "$DATABASE_FILE" << EOF
      INSERT OR IGNORE INTO configurations (name) VALUES ('$escaped_stack');
      INSERT OR REPLACE INTO repository_configurations (repository_id, configuration_id)
      VALUES (
        (SELECT id FROM repositories WHERE url = '$repo_url'),
        (SELECT id FROM configurations WHERE name = '$escaped_stack')
      );
EOF
    done
  fi
}

create_tables
insert_repositories

jq -c '.[]' "$JSON_FILE" | while read -r json_line; do
  # for gitlab, project id is used to check contents of a repository
  project_id=$(jq -r '.project_id' <<< "$json_line")
  repo_url=$(jq -r '.html_url' <<< "$json_line")
  escaped_description=$(escape_single_quotes "$description")
  if [[ "$repo_url" == *github* ]]; then
    repo_slashed_name=$(echo "$repo_url" | sed -E 's|https://github.com/||')
  elif [[ "$repo_url" == *codeberg* ]]; then
    repo_slashed_name=$(echo "$repo_url" | sed -E 's|https://codeberg.org/||')
  elif [[ "$repo_url" == *gitlab* ]]; then
    repo_slashed_name=$(echo "$project_id")
  fi
  echo "Processing $repo_slashed_name..."
  echo "Repository name is $repo_url"
  detect_tech_stack "$repo_slashed_name" "$repo_url"
  echo ""
done 
