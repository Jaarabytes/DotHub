# DotHub

Get access to the best dotfiles and configurations across Github

[Visit us](https://DotHub.vercel.app/)

[![Welcome to the rice field MF](https://nocamels.com/wp-content/uploads/2022/12/a-1-1024x576.jpg)](https://www.youtube.com/watch?v=RuofJYG2yak)

## Donations

To Donate: [click here](https://DotHub.vercel.app/donate)

Help me. Thinking deserves rewards

# Development

## How ?

First, install [gh](https://github.com/cli/cli) to query and use the [Github API](https://docs.github.com/en/rest/quickstart?apiVersion=2022-11-28). Also, install jq

repos.json 
```
gh api "search/repositories?q=dotfiles+in:name&per_page=1000&page=2" --jq '.items[] | {name: .owner.login, html_url: .html_url, description: .description, stars: .stargazers_count, last_updated: .updated_at}' | jq -s "." > repos.json
```

urls.txt

```
jq '.[] | .html_url' repos.json > urls.txt
```

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

If you feel like seeding the database again. 
```
chmod +x seed.sh && bash seed.sh
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

- ~Add welcome to the rice field mf to the readme~
- Add more github repositories to the db (search based on repository description)
- Add codeberg repositories
