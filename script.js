// Theme and Language Management
class SiteManager {
  constructor() {
    this.init();
  }

  init() {
    this.initTheme();
    this.initLanguage();
    this.setupEventListeners();
    this.updateThemeButtons();
    this.updateLanguageButtons();
    this.updateFavicon();
    this.updateLogo();
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
    this.updateThemeButtons();
    this.updateFavicon();
    this.updateLogo();
    this.updateThemeCSSVariables();
  }

  getEffectiveTheme() {
    const theme = document.documentElement.getAttribute("data-theme");

    if (theme === "auto") {
      // Check browser preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDark ? "dark" : "light";
    }
    return theme;
  }

  updateThemeCSSVariables() {
    // Force CSS to recalculate based on effective theme
    const effectiveTheme = this.getEffectiveTheme();
    const tempAttribute = "data-temp-theme";

    // Temporarily set the effective theme to trigger CSS updates
    document.documentElement.setAttribute(tempAttribute, effectiveTheme);

    // Force reflow to ensure CSS updates
    document.body.offsetHeight;

    // Remove temporary attribute
    document.documentElement.removeAttribute(tempAttribute);
  }

  updateThemeButtons() {
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

    // Invert: dark theme gets light favicon, light theme gets dark favicon
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

    // Update dates and other dynamic content
    this.updateDynamicContent(lang);
  }

  updateDynamicContent(lang) {
    // Update dates based on language
    const dateElements = document.querySelectorAll("[data-i18n-date]");
    dateElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-date");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    // Update languages list
    const langElements = document.querySelectorAll("[data-i18n-lang]");
    langElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-lang");
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
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
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      if (currentTheme === "auto") {
        this.updateFavicon();
        this.updateLogo();
        this.updateThemeCSSVariables();
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
