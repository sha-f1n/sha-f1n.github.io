(() => {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const ICON = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/${slug}.svg`;

  /* ---------- content ---------- */
  document.title = S.name;
  $("name").textContent = S.name;
  $("tagline").textContent = S.tagline;
  $("where").innerHTML =
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>` +
    `<span></span>`;
  $("where").querySelector("span").textContent = S.location;

  // Avatar: image if it loads, otherwise the first letter of the name.
  $("avatarFallback").textContent = S.name.charAt(0).toUpperCase();
  const av = new Image();
  av.onload = () => {
    $("avatar").style.backgroundImage = `url("${S.avatar}")`;
    $("avatarFallback").remove();
  };
  av.src = S.avatar;

  // Background photo (shown in grayscale) if present; CSS moon otherwise.
  const bg = new Image();
  bg.onload = () => {
    $("photo").style.backgroundImage = `url("${S.background}")`;
    $("photo").classList.add("on");
  };
  bg.src = S.background;

  // Steam card + social row
  $("steamCard").href = S.steamProfile;
  $("steamIcon").innerHTML = `<img src="${ICON("steam")}" alt="" width="24" height="24">`;

  const links = $("links");
  S.socials.forEach((s) => {
    const a = document.createElement("a");
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = s.label;
    a.setAttribute("aria-label", s.label);
    const img = document.createElement("img");
    img.src = ICON(s.slug);
    img.alt = "";
    a.appendChild(img);
    links.appendChild(a);
  });

  /* ---------- steam count ---------- */
  fetch("data/steam.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((d) => {
      if (typeof d.game_count === "number") {
        $("steamCount").textContent = d.game_count.toLocaleString("en-US");
      }
      if (d.updated_at) {
        const days = Math.floor((Date.now() - new Date(d.updated_at)) / 864e5);
        $("steamUpdated").textContent =
          days <= 0 ? "updated today" : days === 1 ? "updated yesterday" : `updated ${days} days ago`;
      }
    })
    .catch(() => {});

  /* ---------- music + enter gate ---------- */
  const audio = $("audio");
  const sound = $("sound");
  let hasMusic = false;
  audio.volume = S.musicVolume ?? 0.35;
  audio.addEventListener("canplaythrough", () => { hasMusic = true; }, { once: true });
  audio.src = S.music;

  $("gate").addEventListener("click", () => {
    $("gate").classList.add("gone");
    document.body.classList.add("entered");
    audio.play().then(() => { sound.hidden = false; }).catch(() => {});
  });

  sound.addEventListener("click", () => {
    const mute = !audio.muted;
    audio.muted = mute;
    sound.classList.toggle("muted", mute);
    sound.setAttribute("aria-label", mute ? "Unmute music" : "Mute music");
  });

  /* ---------- drifting snow ---------- */
  const cv = $("snow");
  if (cv && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = cv.getContext("2d");
    let w, h, flakes;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * dpr;
      h = cv.height = innerHeight * dpr;
      const n = Math.round((innerWidth * innerHeight) / 24000);
      flakes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 1.6 + 0.6) * dpr,
        vy: (Math.random() * 0.25 + 0.08) * dpr,
        vx: (Math.random() * 0.2 - 0.05) * dpr,
        a: Math.random() * 0.5 + 0.25
      }));
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.x += f.vx; f.y += f.vy;
        if (f.y > h) { f.y = -4; f.x = Math.random() * w; }
        if (f.x > w) f.x = 0;
        ctx.globalAlpha = f.a;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };
    addEventListener("resize", size);
    size();
    tick();
  }
})();
