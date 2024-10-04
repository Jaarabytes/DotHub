#!/bin/sh

# Environment variables (consider moving these to a separate .env file)
GITLAB_ACCESS_TOKEN=""
GITHUB_API_KEY=""
CODEBERG_API_KEY=""

DATABASE_FILE="dotHub.sqlite"
JSON_FILE="repos.json"
BACKUP_DIR="db_backup"
LOG_FILE="seed.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

install_dependencies() {
    local dependencies=("jq" "curl" "sqlite3" "gh")
    
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

# I hate SQL injections
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
        description=$(escape_single_quotes "$(jq -r '.description' <<< "$repo")")
        stars=$(jq -r '.stars' <<< "$repo")
        last_updated=$(jq -r '.last_updated' <<< "$repo")

        sqlite3 "$DATABASE_FILE" << EOF
        INSERT OR REPLACE INTO repositories (owner, url, description, stars, last_updated) 
        VALUES ('$owner', '$url', '$description', $stars, '$last_updated');
EOF
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

backup_database() {
    mkdir -p "$BACKUP_DIR"
    local backup_file="$BACKUP_DIR/dotHub_$(date +%Y%m%d_%H%M%S).sqlite"
    cp "$DATABASE_FILE" "$backup_file"
    log_message "Database backed up to $backup_file"
}

main() {
    log_message "Starting seed script"
    install_dependencies
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

    backup_database
    log_message "Seed script completed"
}

main
