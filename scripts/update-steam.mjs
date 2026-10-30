// Fetches how many games the account owns and writes data/steam.json.
// Runs inside the GitHub Action; needs STEAM_API_KEY (repo secret).
import { writeFile } from "node:fs/promises";

const key = process.env.STEAM_API_KEY;
const vanity = process.env.STEAM_VANITY || "_shafin";
let steamId = process.env.STEAM_ID; // optional: skip vanity lookup if you set it

if (!key) {
  console.error("Missing STEAM_API_KEY secret.");
  process.exit(1);
}

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.split("?")[0]}`);
  return res.json();
};

if (!steamId) {
  const r = await get(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${encodeURIComponent(vanity)}`
  );
  if (r.response?.success !== 1) {
    throw new Error(`Could not resolve vanity URL "${vanity}". Set STEAM_ID instead.`);
  }
  steamId = r.response.steamid;
}

const owned = await get(
  `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_played_free_games=0&skip_unvetted_apps=0`
);

const count = owned.response?.game_count;
if (typeof count !== "number") {
  throw new Error(
    "Steam returned no game_count. Set Steam > Privacy Settings > Game details to Public."
  );
}

await writeFile(
  new URL("../data/steam.json", import.meta.url),
  JSON.stringify({ game_count: count, updated_at: new Date().toISOString() }, null, 2) + "\n"
);
console.log(`Owned games: ${count}`);
