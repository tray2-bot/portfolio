/* ==========================================================================
   Main interactivity for portfolio (NO THEME TOGGLE VERSION)
   ========================================================================== */

(() => {
  "use strict";

  /* ---------------------------
     Helper utilities
     --------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------
     Mobile nav toggle
     --------------------------- */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  navToggle.addEventListener("click", () => {
    const visible = navMenu.getAttribute("data-visible") === "true";
    navMenu.setAttribute("data-visible", String(!visible));
    navToggle.setAttribute("aria-expanded", String(!visible));
  });

  $$(".nav-link").forEach((a) =>
    a.addEventListener("click", () => {
      navMenu.setAttribute("data-visible", "false");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------------------------
     Smooth scroll for anchors
     --------------------------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (href === "#" || href === "#!") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

// ==========================
// Dynamic Projects
// ==========================

const projects = [
  {
    title: 'Responsive Portfolio Website',
    desc: 'A clean, modern, fully responsive portfolio built with HTML, CSS, and JavaScript.',
    img: 'img/project1.jpg',
    live: '#',
    repo: '#'
  },
  {
    title: 'Business Landing Page',
    desc: 'A professional landing page designed for small businesses with strong UI and branding.',
    img: 'img/project2.jpg',
    live: '#',
    repo: '#'
  },
  {
    title: 'E-commerce Product Grid',
    desc: 'Smooth product layout interface with hover animations and clean visuals.',
    img: 'img/project3.jpg',
    live: '#',
    repo: '#'
  },
  {
    title: 'Dashboard Prototype',
    desc: 'Interactive dashboard with charts, tables, and clear data hierarchy for users.',
    img: 'img/project4.jpg',
    live: '#',
    repo: '#'
  },
  {
    title: 'Blog Template',
    desc: 'Minimalist and readable blog template built for fast loading and accessibility.',
    img: 'img/project5.jpg',
    live: '#',
    repo: '#'
  },
  {
    title: 'Interactive Quiz App',
    desc: 'A fun, interactive quiz application built using JavaScript with dynamic feedback.',
    img: 'img/project6.jpg',
    live: '#',
    repo: '#'
  }
];

// Render projects
const projectsGrid = document.getElementById('projectsGrid');

projects.forEach(project => {
  const card = document.createElement('div');
  card.className = 'project-card';

  card.innerHTML = `
    <div class="project-img">
      <img src="${project.img}" alt="${project.title}">
    </div>
    <div class="project-content">
      <h3>${project.title}</h3>
      <p>${project.desc}</p>
      <a href="${project.live}" class="project-btn" target="_blank">View Live</a>
      <a href="${project.repo}" class="project-btn" target="_blank">View Code</a>
    </div>
  `;

  projectsGrid.appendChild(card);
});

  function renderProjects(data) {
    projectsGrid.innerHTML = "";
    const frag = document.createDocumentFragment();
    data.forEach((p) => frag.appendChild(createProjectCard(p)));
    projectsGrid.appendChild(frag);
  }

  renderProjects(projects);

  /* ---------------------------
     Project filtering
     --------------------------- */
  const filterBtns = $$(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.dataset.filter;

      if (filter === "all") {
        renderProjects(projects);
      } else {
        renderProjects(projects.filter((p) => p.tech.includes(filter)));
      }
    });
  });

  /* ---------------------------
     Modal system
     --------------------------- */
  const modal = $("#projectModal");
  const modalImg = $("#modalImg");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalTech = $("#modalTech");
  const modalLive = $("#modalLive");
  const modalCode = $("#modalCode");
  let lastFocus = null;

  function openModal(p) {
    lastFocus = document.activeElement;

    modalImg.src = p.img;
    modalImg.alt = `${p.title} screenshot`;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalTech.textContent = "Tech: " + p.tech.join(", ");
    modalLive.href = p.live || "#";
    modalCode.href = p.repo || "#";

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  }

  projectsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".open-project");
    if (!btn) return;
    const p = projects.find((x) => x.id === btn.dataset.id);
    if (p) openModal(p);
  });

  $("[data-modal-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  /* ---------------------------
     Contact form
     --------------------------- */
  const form = $("#contactForm");
  const formStatus = $("#formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      const spam = $("#website").value.trim();

      if (spam) return;

      if (!name || !email || !message) {
        formStatus.hidden = false;
        formStatus.textContent = "Please fill all fields.";
        formStatus.style.color = "#ff8b8b";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.hidden = false;
        formStatus.textContent = "Enter a valid email.";
        formStatus.style.color = "#ff8b8b";
        return;
      }

      formStatus.hidden = false;
      formStatus.style.color = "#4caf50";
      formStatus.textContent = "Opening your mail client...";

      const subject = encodeURIComponent(`Portfolio: Message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

      window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------------------------
     Footer year auto-update
     --------------------------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

})();