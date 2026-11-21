(() => {
  const SONGS = [
    {
      id: "plan-a",
      title: "Plan A",
      artist: "Paulo Londra",
      src: "music/Paulo Londra - Plan A.mp3",
    },
    {
      id: "condenado",
      title: "Condenado para el millón",
      artist: "Paulo Londra",
      src: "music/Paulo Londra - Condenado Para El Millon.mp3",
    },
    {
      id: "homerun",
      title: "Homerun",
      artist: "Paulo Londra",
      src: "music/Paulo Londra - Homerun.mp3",
    },
  ];

  const player = document.getElementById("player");
  const songModal = document.getElementById("song-modal");
  const songList = document.getElementById("song-list");
  const songModalTitle = document.getElementById("song-modal-title");
  const songModalEyebrow = document.getElementById("song-modal-eyebrow");
  const mainPage = document.getElementById("main-page");
  const letterOverlay = document.getElementById("letter-overlay");
  const btnChangeSong = document.getElementById("btn-change-song");
  const btnOpenLetter = document.getElementById("btn-open-letter");
  const btnBackMain = document.getElementById("btn-back-main");
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  /** @type {'entry' | 'change' | 'letter'} */
  let modalMode = "entry";
  let hasEntered = false;
  let stars = [];
  let rafId = 0;
  let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stopAudio() {
    player.pause();
    player.currentTime = 0;
    player.removeAttribute("src");
    player.load();
  }

  function playSong(song) {
    player.src = song.src;
    player.loop = true;
    const playPromise = player.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* Autplay bloqueado: el clic del usuario ya ocurrió; reintento silencioso */
      });
    }
  }

  function openSongModal(mode) {
    modalMode = mode;

    if (mode === "entry") {
      songModalEyebrow.textContent = "Primero, elige la banda sonora";
      songModalTitle.textContent = "¿Qué canción de Paulo Londra quieres escuchar?";
    } else if (mode === "change") {
      songModalEyebrow.textContent = "Cambia la música";
      songModalTitle.textContent = "Elige otra canción";
    } else {
      songModalEyebrow.textContent = "Antes de abrir tu carta";
      songModalTitle.textContent = "¿Con qué canción quieres leerla?";
    }

    songModal.classList.add("is-open");
    songModal.removeAttribute("hidden");
  }

  function closeSongModal() {
    songModal.classList.remove("is-open");
  }

  function showMain() {
    mainPage.hidden = false;
    mainPage.classList.remove("is-hidden");
    document.body.style.overflow = "";
  }

  function openLetter() {
    letterOverlay.hidden = false;
    letterOverlay.classList.remove("is-hidden");
    letterOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    letterOverlay.scrollTop = 0;
  }

  function closeLetter() {
    letterOverlay.hidden = true;
    letterOverlay.classList.add("is-hidden");
    letterOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    stopAudio();
  }

  function onSongChosen(song) {
    closeSongModal();

    if (modalMode === "entry") {
      hasEntered = true;
      showMain();
      playSong(song);
      return;
    }

    if (modalMode === "change") {
      playSong(song);
      return;
    }

    // letter
    openLetter();
    playSong(song);
  }

  function renderSongButtons() {
    songList.innerHTML = "";
    SONGS.forEach((song, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "song-btn";
      btn.innerHTML = `
        <span class="song-btn__index">${index + 1}</span>
        <span>
          <strong>${song.title}</strong>
          <span>${song.artist}</span>
        </span>
      `;
      btn.addEventListener("click", () => onSongChosen(song));
      songList.appendChild(btn);
    });
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const PARTICLE_COLORS = [
    [255, 255, 255],
    [255, 210, 225],
    [255, 143, 179],
    [240, 201, 138],
    [217, 184, 232],
  ];

  function createStars() {
    const count = Math.min(85, Math.floor(window.innerWidth / 10));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.5 + 0.18,
      s: Math.random() * 0.28 + 0.05,
      tw: Math.random() * Math.PI * 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
      star.tw += 0.012;
      star.y -= star.s;
      if (star.y < -4) {
        star.y = window.innerHeight + 4;
        star.x = Math.random() * window.innerWidth;
      }

      const alpha = star.a * (0.65 + Math.sin(star.tw) * 0.35);
      const [r, g, b] = star.color;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
      ctx.arc(star.x - 0.4, star.y - 0.4, star.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(drawParticles);
  }

  function initParticles() {
    if (reduceMotion) return;
    resizeCanvas();
    createStars();
    cancelAnimationFrame(rafId);
    drawParticles();
  }

  btnChangeSong.addEventListener("click", () => {
    openSongModal("change");
  });

  btnOpenLetter.addEventListener("click", () => {
    stopAudio();
    openSongModal("letter");
  });

  btnBackMain.addEventListener("click", () => {
    closeLetter();
  });

  window.addEventListener("resize", () => {
    if (reduceMotion) return;
    resizeCanvas();
    createStars();
  });

  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (event) => {
      reduceMotion = event.matches;
      if (reduceMotion) {
        cancelAnimationFrame(rafId);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      } else {
        initParticles();
      }
    });

  renderSongButtons();
  openSongModal("entry");
  initParticles();
})();
