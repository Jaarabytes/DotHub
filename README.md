# Dotfilia

Get access to the best dotfiles and ocnfigurations across Github

[Visit us](https://dotfilia.vercel.app/)

## How it works

Dotfilia periodically indexes GitHub for dotfiles-related repositories, saves it in a SQLite database, and serves it.

## Donations

To Donate: [click here](https://dotfilia.netlify.app/donate)

Help me. Thinking deserves rewards

## Installation

Prerequisites:
- API Keys, described in the `.env.example` file

Run the following commands:
```
git clone git@github.com:Jaarabytes/dotfilia.git
cd dotfilia
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

The image is located [here](https://hub.docker.com/repository/docker/jaarabytes/dotfilia)

Run this:
```
docker pull jaarabytes/dotfilia:general
```
Thank you!
