(() => {
  const header = document.querySelector("[data-site-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entities[character];
    });

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    header?.classList.remove("is-menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Ouvrir le menu");
    navPanel?.setAttribute("data-open", "false");
  };

  const openNav = () => {
    document.body.classList.add("nav-open");
    header?.classList.add("is-menu-open");
    navToggle?.setAttribute("aria-expanded", "true");
    navToggle?.setAttribute("aria-label", "Fermer le menu");
    navPanel?.setAttribute("data-open", "true");
  };

  const toggleNav = () => {
    const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  };

  const getNavLinks = () => [...document.querySelectorAll(".nav-link")];

  const renderProjects = () => {
    const projectsSection = document.querySelector("[data-projects-section]");
    const projectsNav = document.querySelector("[data-projects-nav]");
    const projectList = document.querySelector("[data-project-list]");
    const projects = Array.isArray(window.SIGOM_CONTENT?.projects)
      ? window.SIGOM_CONTENT.projects.filter((project) => project?.published === true)
      : [];

    if (!projectsSection || !projectList || projects.length === 0) {
      projectsSection?.setAttribute("hidden", "");
      projectsNav?.setAttribute("hidden", "");
      return;
    }

    projectsSection.removeAttribute("hidden");
    projectsNav?.removeAttribute("hidden");
    projectList.innerHTML = projects
      .map((project) => {
        const deliverables = Array.isArray(project.deliverables)
          ? project.deliverables.filter(Boolean)
          : [];
        const image = project.image
          ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}" loading="lazy">`
          : "";
        const deliverablesMarkup = deliverables.length
          ? `<ul>${deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
          : "";

        return `
          <article class="project-card">
            ${image}
            <div class="project-card-content">
              <p class="project-meta">${escapeHtml(project.typology)} · ${escapeHtml(project.location)}</p>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.context)}</p>
              <p><strong>Mission :</strong> ${escapeHtml(project.mission)}</p>
              ${deliverablesMarkup}
              <p class="project-status">${escapeHtml(project.status)}</p>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const initAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href")?.slice(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target || target.hasAttribute("hidden")) return;

        event.preventDefault();
        closeNav();
        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start"
        });
        window.history.pushState(null, "", `#${targetId}`);
      });
    });
  };

  const initNavigation = () => {
    navToggle?.addEventListener("click", toggleNav);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }

      if (event.key !== "Tab" || navToggle?.getAttribute("aria-expanded") !== "true") return;

      const focusableItems = [navToggle, ...navPanel.querySelectorAll("a[href]")]
        .filter((item) => item && !item.closest("[hidden]"));
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });
  };

  const initActiveNavigation = () => {
    const sections = [...document.querySelectorAll("main section[id]:not([hidden])")];
    const navLinks = getNavLinks();

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

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
      {
        rootMargin: "-35% 0px -48% 0px",
        threshold: [0.12, 0.3, 0.52]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  const initReveal = () => {
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  };

  const initForm = () => {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    form.setAttribute("novalidate", "novalidate");
    const status = form.querySelector("[data-form-status]");

    const getFieldLabel = (field) =>
      field.closest(".field")?.querySelector(".field-label")?.textContent?.trim() || field.name;

    const setFieldError = (field, message) => {
      const wrapper = field.closest(".field");
      if (!wrapper) return;

      let error = wrapper.querySelector(".field-error");
      if (!error) {
        error = document.createElement("span");
        error.className = "field-error";
        error.id = `${field.name}-error`;
        wrapper.append(error);
      }

      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", error.id);
      error.hidden = false;
      error.textContent = message;
    };

    const clearFieldError = (field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
      const error = field.closest(".field")?.querySelector(".field-error");
      if (error) {
        error.hidden = true;
        error.textContent = "";
      }
    };

    const showStatus = (message) => {
      if (!status) return;
      status.hidden = !message;
      status.textContent = message;
    };

    const validate = () => {
      const fields = [...form.querySelectorAll("input, select, textarea")];
      const errors = [];

      fields.forEach((field) => {
        clearFieldError(field);
        const value = String(field.value || "").trim();

        if (field.hasAttribute("required") && !value) {
          const message = "Ce champ est nécessaire pour qualifier votre demande.";
          setFieldError(field, message);
          errors.push(getFieldLabel(field));
          return;
        }

        if (field.type === "email" && value && !field.validity.valid) {
          const message = "Indiquez une adresse e-mail valide.";
          setFieldError(field, message);
          errors.push(getFieldLabel(field));
        }
      });

      if (errors.length > 0) {
        showStatus(`Veuillez compléter ou corriger : ${errors.join(", ")}.`);
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
        return false;
      }

      showStatus("");
      return true;
    };

    form.addEventListener("input", (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        clearFieldError(event.target);
      }
    });

    form.addEventListener("change", (event) => {
      if (event.target instanceof HTMLSelectElement) {
        clearFieldError(event.target);
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) return;

      const data = new FormData(form);
      const requestType = data.get("requestType") || "Demande";
      const subject = encodeURIComponent(`Demande Sig’Om - ${requestType}`);
      const body = encodeURIComponent(
        [
          `Nom : ${data.get("name") || ""}`,
          `Organisation : ${data.get("organization") || ""}`,
          `Adresse e-mail : ${data.get("email") || ""}`,
          `Téléphone : ${data.get("phone") || ""}`,
          `Typologie de bâtiment : ${data.get("buildingType") || ""}`,
          `Localisation du projet : ${data.get("location") || ""}`,
          `Nature de la demande : ${requestType}`,
          `Échéance souhaitée : ${data.get("timeline") || ""}`,
          "",
          "Message :",
          data.get("message") || "",
          "",
          "Documents disponibles :",
          data.get("documents") || ""
        ].join("\n")
      );

      showStatus("Votre messagerie va s'ouvrir pour finaliser l'envoi.");
      window.location.href = `mailto:contact@sigom.fr?subject=${subject}&body=${body}`;
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      setHeaderState();
      ticking = false;
    });
  };

  renderProjects();
  initAnchors();
  initNavigation();
  initActiveNavigation();
  initReveal();
  initForm();
  setHeaderState();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
