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
    this.setupDropdownBehavior();
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

    // Determine base path for GitHub Pages vs local
    const isGitHubPages = window.location.hostname.includes("github.io");
    const basePath = isGitHubPages ? "/YOUR-REPO-NAME/" : "/";

    // Remove trailing slash if present
    const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

    if (theme === "light") {
      logo.src = `${cleanBase}/assets/logos/logo-yarikstudio-dark.svg`;
    } else {
      logo.src = `${cleanBase}/assets/logos/logo-yarikstudio-light.svg`;
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

    // Update search placeholder
    const searchInput = document.querySelector(".search-input");
    if (searchInput && translations[lang]?.["projects.search_placeholder"]) {
      searchInput.placeholder =
        translations[lang]["projects.search_placeholder"];
    }

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

  // Dropdown Behavior Fix
  setupDropdownBehavior() {
    const themeToggle = document.querySelector(".theme-toggle");
    const themeDropdown = document.querySelector(".theme-dropdown");
    const langToggle = document.querySelector(".lang-toggle");
    const langDropdown = document.querySelector(".lang-dropdown");

    if (themeToggle && themeDropdown && langToggle && langDropdown) {
      // Close language dropdown when opening theme dropdown
      themeToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (langDropdown.classList.contains("show")) {
          langDropdown.classList.remove("show");
        }
        themeDropdown.classList.toggle("show");
      });

      // Close theme dropdown when opening language dropdown
      langToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (themeDropdown.classList.contains("show")) {
          themeDropdown.classList.remove("show");
        }
        langDropdown.classList.toggle("show");
      });
    }
  }

  // Event Listeners
  setupEventListeners() {
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
    document.addEventListener("click", (e) => {
      // Don't close if clicking on dropdown toggle buttons
      if (!e.target.closest(".dropdown-toggle")) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
        });
      }
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
        this.filterProjects(filterValue);
      });
    });
  }

  filterProjects(filterValue) {
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

    // Update search if active
    if (window.projectSearch) {
      window.projectSearch.updateVisibleProjects();
    }
  }
}

// Project Search (for projects.html)
class ProjectSearch {
  constructor() {
    this.searchInput = document.querySelector(".search-input");
    this.searchClear = document.querySelector(".search-clear");
    this.searchResultsInfo = document.querySelector(".search-results-info");
    this.searchCount = document.querySelector(".search-count");
    this.noResults = document.querySelector(".no-results");
    this.projectCards = document.querySelectorAll(".project-card");

    if (this.searchInput && this.projectCards.length > 0) {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.updateVisibleProjects();
  }

  setupEventListeners() {
    // Search input events
    this.searchInput.addEventListener("input", () => {
      this.performSearch();
      this.updateClearButton();
    });

    // Search button click
    const searchBtn = document.querySelector(".search-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        this.performSearch();
        this.searchInput.focus();
      });
    }

    // Clear search button
    if (this.searchClear) {
      this.searchClear.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    // Press Enter to search
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });
  }

  performSearch() {
    const searchTerm = this.searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
      this.clearSearch();
      return;
    }

    let visibleCount = 0;
    const activeFilter =
      document.querySelector(".filter-btn.active")?.dataset.filter || "all";

    this.projectCards.forEach((card) => {
      const title =
        card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const description =
        card.querySelector(".card-text")?.textContent.toLowerCase() || "";
      const category = card.dataset.category;

      const matchesSearch =
        title.includes(searchTerm) || description.includes(searchTerm);
      const matchesFilter = activeFilter === "all" || category === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
        visibleCount++;
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });

    this.updateSearchResults(visibleCount);
  }

  clearSearch() {
    this.searchInput.value = "";
    this.updateClearButton();

    // Show all projects based on current filter
    const activeFilter =
      document.querySelector(".filter-btn.active")?.dataset.filter || "all";

    this.projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = activeFilter === "all" || category === activeFilter;

      if (shouldShow) {
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

    this.hideSearchResults();
  }

  updateClearButton() {
    if (this.searchClear) {
      if (this.searchInput.value.trim() !== "") {
        this.searchClear.classList.remove("hidden");
      } else {
        this.searchClear.classList.add("hidden");
      }
    }
  }

  updateSearchResults(count) {
    if (this.searchResultsInfo && this.searchCount) {
      this.searchCount.textContent = count;
      this.searchResultsInfo.classList.remove("hidden");

      // Show/hide no results message
      if (this.noResults) {
        if (count === 0) {
          this.noResults.classList.remove("hidden");
        } else {
          this.noResults.classList.add("hidden");
        }
      }
    }
  }

  hideSearchResults() {
    if (this.searchResultsInfo) {
      this.searchResultsInfo.classList.add("hidden");
    }
    if (this.noResults) {
      this.noResults.classList.add("hidden");
    }
  }

  updateVisibleProjects() {
    // Re-apply search if there's a search term
    if (this.searchInput.value.trim() !== "") {
      this.performSearch();
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize site manager
  window.siteManager = new SiteManager();

  // Initialize project filter if on projects page
  if (document.querySelector(".project-card")) {
    window.projectFilter = new ProjectFilter();
    window.projectSearch = new ProjectSearch();
  }
});
