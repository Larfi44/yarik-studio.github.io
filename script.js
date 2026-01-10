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
    this.updateThemeToggleText();
    this.updateLanguageToggleText();
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
    }

    this.setTheme(theme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.updateThemeIcons();
    this.updateFavicon();
    this.updateThemeToggleText();
    this.updateLogo();
  }

  getEffectiveTheme() {
    const theme = document.documentElement.getAttribute("data-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "auto") {
      return prefersDark ? "dark" : "light";
    }
    return theme;
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
    const theme = this.getEffectiveTheme();
    const link = document.querySelector("link[rel*='icon']");

    // If browser/effective theme is light, use dark favicon (for contrast)
    // If browser/effective theme is dark, use light favicon (for contrast)
    let iconPath = "../assets/favicons/favicon-dark.svg";

    if (theme === "dark") {
      iconPath = "../assets/favicons/favicon-light.svg";
    }

    if (link) {
      link.href = iconPath;
    }
  }

  updateLogo() {
    const logo = document.querySelector(".logo-large");
    if (!logo) return;

    const theme = this.getEffectiveTheme();

    if (theme === "light") {
      logo.src = "../assets/logos/logo-yarikstudio-dark.svg";
    } else {
      logo.src = "../assets/logos/logo-yarikstudio-light.svg";
    }
  }

  updateThemeToggleText() {
    const theme = document.documentElement.getAttribute("data-theme");
    const themeToggle = document.querySelector(".theme-toggle .current-theme");
    if (!themeToggle) return;

    const lang = document.documentElement.getAttribute("lang");
    const themeText = {
      auto: translations[lang]?.["theme.auto"] || "Auto",
      light: translations[lang]?.["theme.light"] || "Light",
      dark: translations[lang]?.["theme.dark"] || "Dark",
    };

    themeToggle.textContent = themeText[theme];
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
    this.updateLanguageToggleText();
    this.updateThemeToggleText();
  }

  updateContent(lang) {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        const translation = translations[lang][key];

        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = translation;
        } else if (element.hasAttribute("title")) {
          element.title = translation;
        } else if (element.hasAttribute("alt")) {
          element.alt = translation;
        } else if (element.tagName === "IMG") {
          // Don't change image src for logos
          if (!element.classList.contains("logo-large")) {
            element.alt = translation;
          }
        } else {
          // Handle HTML content
          if (translation.includes("<br>")) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
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

  updateLanguageToggleText() {
    const lang = document.documentElement.getAttribute("lang");
    const langToggle = document.querySelector(".lang-toggle .current-lang");
    if (!langToggle) return;

    const langText = {
      en: translations[lang]?.["language.english"] || "English",
      ru: translations[lang]?.["language.russian"] || "Russian",
    };

    langToggle.textContent = langText[lang];
  }

  // Event Listeners
  setupEventListeners() {
    // Theme dropdown
    const themeToggle = document.querySelector(".theme-toggle");
    const themeDropdown = document.querySelector(".theme-dropdown");

    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle("show");
      });
    }

    // Language dropdown
    const langToggle = document.querySelector(".lang-toggle");
    const langDropdown = document.querySelector(".lang-dropdown");

    if (langToggle) {
      langToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle("show");
      });
    }

    // Theme buttons
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setTheme(btn.dataset.theme);
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
        });
      });
    });

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setLanguage(btn.dataset.lang);
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
        });
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

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
      });
    });

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme");
        if (currentTheme === "auto") {
          this.updateFavicon();
          this.updateLogo();
          this.updateThemeToggleText();
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
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
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
});
