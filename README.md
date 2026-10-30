# Nyx_Vale

Personal profile page. Static site, hosted on GitHub Pages.

## Setup

1. Create a repo (name it `<your-github-username>.github.io` for a clean URL, or anything else).
2. Upload everything in this folder, including the hidden `.github` folder.
3. Add your files to `assets/`: `avatar.jpg`, `bg.jpg`, `music.mp3` (see `assets/README.txt`).
4. Edit `config.js` for the tagline, location and links.
5. Repo **Settings > Pages**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`.

## Steam game count (updates daily)

1. In Steam: **Profile > Edit Profile > Privacy Settings** and set **Game details** to **Public**.
2. Get a free key at https://steamcommunity.com/dev/apikey
3. Repo **Settings > Secrets and variables > Actions > New repository secret**:
   name `STEAM_API_KEY`, value = your key.
4. Repo **Actions** tab > *Update Steam game count* > **Run workflow** (first run, so you don't wait a day).

If the vanity name lookup fails, add a second secret `STEAM_ID` with your 17-digit SteamID64.

Never put the API key in any file in the repo.
