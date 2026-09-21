/* ==========================================================================
   Muhammad Syach Fayrus — personal website
   Plain JavaScript, no libraries. Sections:
     1. Header state (blur when scrolling)
     2. Mobile navigation
     3. Scroll reveals
     4. Active link in the navigation
     5. Video lightbox
   ========================================================================== */

(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const body = document.body;

  /* ---------- 1. Header state ---------- */
  // Adds .is-scrolled once the page moves, which turns on the blur in CSS.
  let scrollQueued = false;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    scrollQueued = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        window.requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
  updateHeader();


  /* ---------- 2. Mobile navigation ---------- */
  const desktopQuery = window.matchMedia("(min-width: 861px)");

  const setNav = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.classList.toggle("no-scroll", open);
  };

  toggle.addEventListener("click", () => {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close after choosing a link
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNav(false);
  });

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setNav(false);
      toggle.focus();
    }
  });

  // If the window grows past the mobile breakpoint, reset the menu
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setNav(false);
  });


  /* ---------- 3. Scroll reveals ---------- */
  // Elements with .reveal, .reveal-lines or .img-reveal get .is-visible when they
  // enter the viewport. The hidden starting state lives in style.css and only
  // applies when JavaScript is available.
  const revealTargets = document.querySelectorAll(".reveal, .reveal-lines, .img-reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }


  /* ---------- 4. Active link in the navigation ---------- */
  // "Contact" in the menu points at #connect, and the closing #contact block
  // belongs to the same link.
  const linkFor = {};
  nav.querySelectorAll("a[href^='#']").forEach((link) => {
    linkFor[link.getAttribute("href").slice(1)] = link;
  });
  linkFor.contact = linkFor.connect;

  const setCurrent = (id) => {
    nav.querySelectorAll("a").forEach((link) => link.removeAttribute("aria-current"));
    if (id && linkFor[id]) linkFor[id].setAttribute("aria-current", "true");
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      // A thin band across the middle of the screen decides which section is "current"
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

    // Nothing is highlighted while the hero is on screen
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY < 160) setCurrent(null);
      },
      { passive: true }
    );
  }


  /* ---------- 5. Video lightbox ---------- */
  // Clicking a .film__trigger opens the shared <dialog id="lightbox">.
  // The video only starts loading after the click, so the page stays light.
  //
  // Local file:  <button data-video="assets/videos/cinematic-01.mp4" ...>
  // YouTube/Vimeo instead (for files too big for GitHub): add data-embed="https://www.youtube.com/embed/VIDEO_ID"
  const box = document.getElementById("lightbox");
  const triggers = document.querySelectorAll(".film__trigger");

  if (box && typeof box.showModal === "function") {
    const video = document.getElementById("lightbox-video");
    const embedWrap = document.getElementById("lightbox-embed");
    const errorMsg = document.getElementById("lightbox-error");
    const titleEl = document.getElementById("lightbox-title");
    const metaEl = document.getElementById("lightbox-meta");
    const closeBtn = box.querySelector(".lightbox__close");
    let lastTrigger = null;

    // Stop playback and release the file
    const resetMedia = () => {
      video.pause();
      video.removeAttribute("src");
      video.removeAttribute("poster");
      video.load();
      embedWrap.textContent = ""; // removes any iframe, which stops its playback
      embedWrap.hidden = true;
      errorMsg.hidden = true;
      video.hidden = false;
    };

    const showError = () => {
      video.hidden = true;
      embedWrap.hidden = true;
      errorMsg.hidden = false;
    };

    const openLightbox = (trigger) => {
      const { video: src, poster, title, meta, embed } = trigger.dataset;
      lastTrigger = trigger;

      resetMedia();
      titleEl.textContent = title || "";
      metaEl.textContent = meta || "";

      if (embed) {
        // External player: works for YouTube and Vimeo embed URLs
        const iframe = document.createElement("iframe");
        iframe.title = title ? `Video: ${title}` : "Video player";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.src = embed + (embed.includes("?") ? "&" : "?") + "autoplay=1&mute=1&muted=1";
        embedWrap.appendChild(iframe);
        embedWrap.hidden = false;
        video.hidden = true;
      } else if (src) {
        video.poster = poster || "";
        video.muted = true; // starts silent; the viewer chooses to unmute
        video.src = src;
      } else {
        showError();
      }

      box.showModal();
      body.classList.add("no-scroll");

      if (!embed && src) {
        const playing = video.play();
        if (playing && typeof playing.catch === "function") playing.catch(() => {});
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
    });

    // Missing or unsupported file: say so instead of showing a black box
    video.addEventListener("error", () => {
      if (box.open && video.getAttribute("src")) showError();
    });

    closeBtn.addEventListener("click", () => box.close());

    // Clicking the dark area around the player closes it (the dialog fills the screen)
    box.addEventListener("click", (event) => {
      if (event.target === box) box.close();
    });

    // Fires for the close button, the backdrop and the Escape key
    box.addEventListener("close", () => {
      resetMedia();
      body.classList.remove("no-scroll");
      if (lastTrigger) lastTrigger.focus();
    });
  } else {
    // Very old browsers without <dialog>: open the video in a new tab instead
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const target = trigger.dataset.embed || trigger.dataset.video;
        if (target) window.open(target, "_blank", "noopener");
      });
    });
  }
})();
/* ========================================
   MUSIC PLAYER
======================================== */

const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicTitle = document.getElementById("musicTitle");
const musicNext = document.getElementById("musicNext");

const playlist = [
  {
    title: "Surabaya",
    artist: "Crayon Case",
    src: "assets/audio/surabaya.mp3"
  },
  {
    title: "Because",
    artist: "Crayon Case",
    src: "assets/audio/because.mp3"
  },
  {
    title: "Gravits",
    artist: "Crayon Case",
    src: "assets/audio/gravits.mp3"
  }
];

let currentSong = 0;

function loadSong(index) {
  currentSong = index;

  music.src = playlist[currentSong].src;
  musicTitle.textContent = playlist[currentSong].title;

  music.load();
}

function playSong() {
  music.play()
    .then(() => {
      musicIcon.textContent = "Ⅱ";
      musicToggle.setAttribute("aria-label", "Pause music");
    })
    .catch((error) => {
      console.log("Music tidak dapat diputar:", error);
    });
}

function pauseSong() {
  music.pause();

  musicIcon.textContent = "▶";
  musicToggle.setAttribute("aria-label", "Play music");
}

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

musicNext.addEventListener("click", () => {
  currentSong = (currentSong + 1) % playlist.length;

  loadSong(currentSong);
  playSong();
});

music.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % playlist.length;

  loadSong(currentSong);
  playSong();
});

/* Volume */
music.volume = 0.25;

/* Load lagu pertama */
loadSong(0);