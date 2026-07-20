const root = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const progress = document.querySelector(".scroll-progress");
const navLinks = [...document.querySelectorAll(".nav-link")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setScrollProgress = () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress?.style.setProperty("--progress", String(Math.min(1, Math.max(0, ratio))));
};

const closeNav = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navPanel?.setAttribute("data-open", "false");
};

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navPanel?.setAttribute("data-open", String(!expanded));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
);

document.querySelectorAll("[data-reveal]").forEach((item) => {
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
      link.toggleAttribute("aria-current", isCurrent);
    });
  },
  { threshold: [0.2, 0.45, 0.7] }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const heroImage = document.querySelector(".hero-media img");
const parallaxHero = () => {
  if (!heroImage || prefersReducedMotion.matches) return;
  const offset = Math.min(90, window.scrollY * 0.08);
  heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
};

const renderContent = () => {
  const content = window.SIGOM_CONTENT;
  if (!content) return;

  const expertiseTarget = document.querySelector("[data-expertise-list]");
  if (expertiseTarget) {
    expertiseTarget.innerHTML = content.expertises
      .map(
        (item, index) => `
        <details class="expertise-item" ${index === 0 ? "open" : ""}>
          <summary>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${item.title}</strong>
          </summary>
          <p>${item.text}</p>
        </details>
      `
      )
      .join("");
  }

  const sectorTarget = document.querySelector("[data-sector-list]");
  if (sectorTarget) {
    sectorTarget.innerHTML = content.sectors
      .map((sector) => `<li>${sector}</li>`)
      .join("");
  }

  const referenceTarget = document.querySelector("[data-reference-list]");
  if (referenceTarget) {
    referenceTarget.innerHTML = content.references
      .map(
        (item) => `
        <article class="reference-card">
          <span>${item.type}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
      )
      .join("");
  }

  const newsTarget = document.querySelector("[data-news-list]");
  if (newsTarget) {
    newsTarget.innerHTML = content.news
      .map(
        (item) => `
        <article class="news-item">
          <span>${item.date}</span>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `
      )
      .join("");
  }
};

const contactForm = document.querySelector(".contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Demande Sig'Om - ${data.get("subject") || "Mission"}`);
  const body = encodeURIComponent(
    [
      `Nom : ${data.get("name") || ""}`,
      `Organisation : ${data.get("organisation") || ""}`,
      `Email : ${data.get("email") || ""}`,
      "",
      data.get("message") || ""
    ].join("\n")
  );
  window.location.href = `mailto:contact@sigom.fr?subject=${subject}&body=${body}`;
});

const update = () => {
  setHeaderState();
  setScrollProgress();
  parallaxHero();
};

renderContent();
update();
window.addEventListener("scroll", update, { passive: true });
window.addEventListener("resize", setScrollProgress);
