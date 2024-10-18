#!/bin/sh


# Environment variables (consider moving these to a separate .env file)
GITLAB_ACCESS_TOKEN=""
GITHUB_API_KEY=""
CODEBERG_API_KEY=""
POSTGRES_URL=""
JSON_FILE="repos.json"
BACKUP_DIR="db_backup"
LOG_FILE="seed.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

install_dependencies() {
    local dependencies=("jq" "curl" "gh")
    
    for dep in "${dependencies[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_message "Installing $dep..."
            case "$(uname -s)" in
                Linux*)
                    if [ -f /etc/debian_version ]; then
                        sudo apt-get update && sudo apt-get install -y "$dep"
                    elif [ -f /etc/arch-release ]; then
                        sudo pacman -Syu --noconfirm "$dep"
                    elif command -v nix-env &> /dev/null; then
                        nix-env -iA nixpkgs."$dep"
                    else
                        log_message "Unsupported Linux distribution. Please install $dep manually."
                        exit 1
                    fi
                    ;;
                Darwin*)
                    brew install "$dep"
                    ;;
                *)
                    log_message "Unsupported operating system. Please install $dep manually."
                    exit 1
                    ;;
            esac
        fi
    done
}


# Updates repos.json file
update_json() {
  # Define the common jq filter for parsing the JSON response
  jq_filter='.items[] | {
      description: .description,
      html_url: .html_url,
      stars: .stargazers_count,
      last_updated: .updated_at,
      owner: .owner.login,
      project_id: .id
  }'
#  TODO: Increase to 20
  for i in {1..10}; do
    # Fetch GitHub repositories
    gh api "search/repositories?q=dotfiles&per_page=100&page=$i" | jq "$jq_filter" >> 1repos.json
    gh api "search/repositories?q=dotfiles+in:description&per_page=100&page=$i" | jq "$jq_filter" >> 1repos.json
    gh api "search/repositories?q=kitty+in:name+dotfiles+in:name+neovim+in:name+tmux+in:name&per_page=100&page=$i" | jq "$jq_filter" >> 1repos.json
    gh api "search/repositories?q=dotfiles+kitty+neovim+tmux+in:name,description&per_page=100&page=$i" | jq "$jq_filter" >> 1repos.json

    # Fetch GitLab repositories
    curl -s "https://gitlab.com/api/v4/projects?search=dotfiles&per_page=100&page=$i" | jq '.[] | {
        description: .description,
        html_url: .web_url,
        stars: .star_count,
        last_updated: .last_activity_at,
        owner: .namespace.name,
        project_id: .id
    }' >> 1repos.json

    # Fetch Codeberg repositories
    curl -s "https://codeberg.org/api/v1/repos/search?q=dotfiles&limit=100&page=$i" | jq '.data[] | {
        description: .description,
        html_url: .html_url,
        stars: .stars_count,
        last_updated: .updated_at,
        owner: .owner.username,
        project_id: .id
    }' >> 1repos.json
  done

  jq -s '.' 1repos.json > repos.json
  echo "Done with updating the JSON"
}

# Function to execute PostgreSQL queries
execute_query() {
    psql "$POSTGRES_URL" -c "$1"
}

create_tables() {
    execute_query "
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
    );"
}

insert_repositories() {
    jq -c '.[]' "$JSON_FILE" | while read -r repo; do
        owner=$(jq -r '.owner' <<< "$repo")
        url=$(jq -r '.html_url' <<< "$repo")
        description=$(jq -r '.description' <<< "$repo" | sed "s/'/''/g")
        stars=$(jq -r '.stars' <<< "$repo")
        last_updated=$(jq -r '.last_updated' <<< "$repo")

        execute_query "
        INSERT INTO repositories (owner, url, description, stars, last_updated)
        VALUES ('$owner', '$url', '$description', $stars, '$last_updated')
        ON CONFLICT (url) DO UPDATE
        SET owner = EXCLUDED.owner,
            description = EXCLUDED.description,
            stars = EXCLUDED.stars,
            last_updated = EXCLUDED.last_updated;"
    done
}

detect_tech_stack() {
    local repo_slashed_name="$1"
    local repo_url="$2"
    local tech_stack=()
    local contents=""

    case "$repo_url" in
        *github*)
            contents=$(gh api "repos/$repo_slashed_name/contents" | jq -r '.[].name')
            log_message "Processing GitHub URL: $repo_slashed_name"
            ;;
        *gitlab*)
            contents=$(curl --header "PRIVATE-TOKEN: $GITLAB_ACCESS_TOKEN" \
                "https://gitlab.com/api/v4/projects/$repo_slashed_name/repository/tree" | jq -r '.[].name')
            log_message "Processing GitLab URL: $repo_slashed_name"
            ;;
        *codeberg*)
            contents=$(curl -X 'GET' \
                "https://codeberg.org/api/v1/repos/$repo_slashed_name/contents" \
                -H 'accept: application/json' | jq -r '.[].name')
            log_message "Processing Codeberg URL: $repo_slashed_name"
            ;;
        *)
            log_message "Unknown platform for URL: $repo_url"
            return
            ;;
    esac

    local tech_mapping=(
        "tmux:tmux" "hypr:hypr" "i3:i3" "sway:sway" "nvim:neovim" "neovim:neovim" "vim:vim"
        "alacritty:alacritty" "kitty:kitty" "wezterm:wezterm" "zsh:zsh" "bash:bash" "fish:fish"
        "emacs:emacs" "polybar:polybar" "dunst:dunst" "picom:picom" "rofi:rofi" "conky:conky"
        "xmonad:xmonad" "awesome:awesomeWM" "qtile:qtile" "openbox:openbox" "bspwm:bspwm"
        "herbstluftwm:herbstluftwm" "fluxbox:fluxbox" "lxqt:lxqt" "cinnamon:cinnamon"
        "xfce:xfce" "gnome:gnome" "kde:kde/plasma" "plasma:kde/plasma" "nix:nix" "brew:brew"
        "vscode:vscode" "sublime:sublime" "zprofile:zprofile" "xprofile:xprofile"
        "waybar:waybar" "wofi:wofi"
    )

    for item in $contents; do
        for tech in "${tech_mapping[@]}"; do
            IFS=':' read -r pattern stack <<< "$tech"
            if [[ "$item" == *"$pattern"* ]]; then
                tech_stack+=("$stack")
            fi
        done
    done

    if [ ${#tech_stack[@]} -eq 0 ]; then
        log_message "No specific tech detected for $repo_slashed_name"
    else
        log_message "Tech Stack for $repo_slashed_name: ${tech_stack[*]}"
        for stack in "${tech_stack[@]}"; do
            stack=$(echo "$stack" | sed "s/'/''/g")
            execute_query "
            INSERT INTO configurations (name) VALUES ('$stack')
            ON CONFLICT (name) DO NOTHING;
            
            INSERT INTO repository_configurations (repository_id, configuration_id)
            VALUES (
                (SELECT id FROM repositories WHERE url = '$repo_url'),
                (SELECT id FROM configurations WHERE name = '$stack')
            )
            ON CONFLICT DO NOTHING;"
        done
    fi
}

main() {
    log_message "Starting seed script"
    install_dependencies
    update_json
    create_tables
    insert_repositories

    jq -c '.[]' "$JSON_FILE" | while read -r json_line; do
        repo_url=$(jq -r '.html_url' <<< "$json_line")
        project_id=$(jq -r '.project_id' <<< "$json_line")
        
        case "$repo_url" in
            *github*)
                repo_slashed_name=${repo_url#https://github.com/}
                ;;
            *gitlab*)
                repo_slashed_name=$project_id
                ;;
            *codeberg*)
                repo_slashed_name=${repo_url#https://codeberg.org/}
                ;;
            *)
                log_message "Unknown platform for URL: $repo_url"
                continue
                ;;
        esac

        detect_tech_stack "$repo_slashed_name" "$repo_url"
    done

    log_message "Seed script completed"
}

main
