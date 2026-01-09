// Theme and Language Management
class SiteManager {
  constructor() {
    this.init();
  }

  init() {
    this.initTheme();
    this.initLanguage();
    this.setupEventListeners();
    this.updateThemeIcons();
  }

  // Theme Management
  initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let theme = "auto";

    if (savedTheme) {
      theme = savedTheme;
    } else if (prefersDark) {
      theme = "auto";
    }

    this.setTheme(theme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateThemeIcons();
    this.updateFavicon();
  }

  updateThemeIcons() {
    const theme = document.documentElement.getAttribute("data-theme");
    const themeBtns = document.querySelectorAll(".theme-btn");

    themeBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.theme === theme) {
        btn.classList.add("active");
      }
    });
  }

  updateFavicon() {
    const theme = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const link = document.querySelector("link[rel*='icon']");

    let iconPath = "../../assets/favicons/favicon-light.svg";

    if (theme === "dark" || (theme === "auto" && prefersDark)) {
      iconPath = "../../assets/favicons/favicon-dark.svg";
    }

    if (link) {
      link.href = iconPath;
    }
  }

  // Language Management
  initLanguage() {
    const savedLang = localStorage.getItem("language");
    const browserLang = navigator.language || navigator.userLanguage || "";

    let lang = "en";

    if (savedLang) {
      lang = savedLang;
    } else if (browserLang.startsWith("ru")) {
      lang = "ru";
    }

    this.setLanguage(lang);
  }

  setLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("language", lang);
    this.updateContent(lang);
    this.updateLanguageButtons();
  }

  updateContent(lang) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = translations[lang][key];
        } else if (element.hasAttribute("title")) {
          element.title = translations[lang][key];
        } else if (element.hasAttribute("alt")) {
          element.alt = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });
  }

  updateLanguageButtons() {
    const lang = document.documentElement.getAttribute("lang");
    const langBtns = document.querySelectorAll(".lang-btn");

    langBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
      }
    });
  }

  // Event Listeners
  setupEventListeners() {
    // Theme dropdown
    const themeToggle = document.querySelector(".theme-toggle");
    const themeDropdown = document.querySelector(".theme-dropdown");

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        themeDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (
          !themeToggle.contains(e.target) &&
          !themeDropdown.contains(e.target)
        ) {
          themeDropdown.classList.remove("show");
        }
      });
    }

    // Language dropdown
    const langToggle = document.querySelector(".lang-toggle");
    const langDropdown = document.querySelector(".lang-dropdown");

    if (langToggle) {
      langToggle.addEventListener("click", () => {
        langDropdown.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (
          !langToggle.contains(e.target) &&
          !langDropdown.contains(e.target)
        ) {
          langDropdown.classList.remove("show");
        }
      });
    }

    // Theme buttons
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setTheme(btn.dataset.theme);
      });
    });

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setLanguage(btn.dataset.lang);
      });
    });

    // Navbar toggler for mobile
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarNav = document.querySelector(".navbar-nav");

    if (navbarToggler && navbarNav) {
      navbarToggler.addEventListener("click", () => {
        navbarNav.classList.toggle("active");
      });

      // Close navbar when clicking outside on mobile
      document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          if (
            !navbarToggler.contains(e.target) &&
            !navbarNav.contains(e.target)
          ) {
            navbarNav.classList.remove("active");
          }
        }
      });
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme");
        if (currentTheme === "auto") {
          this.updateThemeIcons();
          this.updateFavicon();
        }
      });
  }
}

// Project Filter (for projects.html)
class ProjectFilter {
  constructor() {
    this.init();
  }

  init() {
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.projectCards = document.querySelectorAll(".project-card");

    if (this.filterButtons.length > 0 && this.projectCards.length > 0) {
      this.setupFilter();
    }
  }

  setupFilter() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active button
        this.filterButtons.forEach((btn) => {
          btn.classList.remove("active");
          btn.classList.add("btn-outline");
        });

        button.classList.add("active");
        button.classList.remove("btn-outline");

        // Filter projects
        const filterValue = button.dataset.filter;

        this.projectCards.forEach((card) => {
          if (filterValue === "all" || card.dataset.category === filterValue) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize site manager
  window.siteManager = new SiteManager();

  // Initialize project filter if on projects page
  if (document.querySelector(".project-card")) {
    window.projectFilter = new ProjectFilter();
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });
});
