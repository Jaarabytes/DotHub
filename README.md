# DotHub

Get access to the best dotfiles and configurations across Github

[Visit us](https://DotHub.vercel.app/)

## Donations

To Donate: [click here](https://DotHub.vercel.app/donate)

Help me. Thinking deserves rewards

# Development

## How ?

First, install [gh](https://github.com/cli/cli) to query and use the [Github API](https://docs.github.com/en/rest/quickstart?apiVersion=2022-11-28). Also, install jq

`repos.json` - `gh api "search/repositories?q=dotfiles+in:name" --paginate --jq '.items[] | {name: .name, html_url: .html_url, description: .description, stars: .stargazers_url, last_updated: .updated_at}' | jq -s "." > repos.json`

`urls.txt` - `jq '.[] | .html_url' repos.json`

## Installation

Prerequisites:
- API Keys, described in the `.env.example` file

Run the following commands:
```
git clone git@github.com:Jaarabytes/DotHub.git
cd DotHub
mv .env.example .env
npm install 
npm run dev
```

## Contributions

- Fork the repository
- Create a branch
- Resolve the bug/ add the feature
- Open for a pull request

**NOTE**: Make the pull request message short and concise **PLEASE**.

## Docker

The image is located [here](https://hub.docker.com/repository/docker/jaarabytes/DotHub)

Run this:
```
docker pull jaarabytes/DotHub:general
```
Thank you!

## TODO

- Add welcome to the rice field mf to the readme
- Add welcome to the rice field mf to the readme
- Add welcome to the rice field mf to the readme
