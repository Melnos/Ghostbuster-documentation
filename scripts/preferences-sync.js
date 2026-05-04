(function () {
    var THEME_KEY = 'ghostbuster-theme';
    var LANG_KEY = 'ghostbuster-lang';
    var DEFAULT_THEME = 'light';
    var DEFAULT_LANG = 'en';
    var hintTimeout = null;
    var hintInterval = null;
    var HINT_VISIBLE_MS = 3000;
    var HINT_CYCLE_MS = 9000;

    function setTheme(theme) {
        var value = theme === 'dark' ? 'dark' : 'light';
        var html = document.documentElement;
        var body = document.body;
        if (html) {
            html.setAttribute('data-theme', value);
        }
        if (body) {
            body.setAttribute('data-theme', value);
        }
    }

    function setLanguage(lang) {
        var value = lang === 'fr' ? 'fr' : 'en';
        var html = document.documentElement;
        var body = document.body;
        if (html) {
            html.setAttribute('data-lang', value);
        }
        if (body) {
            body.setAttribute('data-lang', value);
        }
        setHtmlLang(value);
    }

    function setHtmlLang(lang) {
        var html = document.documentElement;
        if (html) {
            html.setAttribute('lang', lang === 'fr' ? 'fr' : 'en');
        }
    }

    function ensureThemeHintNode() {
        var existing = document.getElementById('themeHint');
        if (existing) {
            return existing;
        }

        var hint = document.createElement('span');
        hint.id = 'themeHint';
        hint.className = 'theme-hint';
        document.body.appendChild(hint);
        return hint;
    }

    function updateThemeHint() {
        var body = document.body;
        if (!body) {
            return;
        }

        var hint = ensureThemeHintNode();
        var isDark = body.getAttribute('data-theme') === 'dark';
        var lang = body.getAttribute('data-lang') === 'fr' ? 'fr' : 'en';

        if (isDark) {
            hint.textContent = lang === 'fr' ? 'Passer en mode clair' : 'Switch to light mode';
        } else {
            hint.textContent = lang === 'fr' ? 'Passer en mode sombre' : 'Switch to dark mode';
        }

        hint.classList.add('is-visible');
        if (hintTimeout) {
            window.clearTimeout(hintTimeout);
        }
        hintTimeout = window.setTimeout(function () {
            hint.classList.remove('is-visible');
        }, HINT_VISIBLE_MS);

        if (!hintInterval) {
            hintInterval = window.setInterval(function () {
                updateThemeHint();
            }, HINT_CYCLE_MS);
        }
    }

    function setIcons() {
        var themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = '👻';
        }

        var langIcon = document.getElementById('langIcon');
        if (langIcon) {
            langIcon.textContent = document.body.getAttribute('data-lang') === 'en' ? 'EN' : 'FR';
        }

        updateThemeHint();
    }

    function applySavedPreferences() {
        var body = document.body;
        if (!body) {
            return;
        }

        var savedTheme = localStorage.getItem(THEME_KEY);
        var savedLang = localStorage.getItem(LANG_KEY);

        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
        } else {
            setTheme(DEFAULT_THEME);
            localStorage.setItem(THEME_KEY, DEFAULT_THEME);
        }

        if (savedLang === 'fr' || savedLang === 'en') {
            setLanguage(savedLang);
        } else {
            setLanguage(DEFAULT_LANG);
            localStorage.setItem(LANG_KEY, DEFAULT_LANG);
        }

        setIcons();
    }

    function toggleThemePersisted() {
        var body = document.body;
        var nextTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem(THEME_KEY, nextTheme);
        setIcons();
    }

    function toggleLanguagePersisted() {
        var body = document.body;
        var nextLang = body.getAttribute('data-lang') === 'fr' ? 'en' : 'fr';
        setLanguage(nextLang);
        localStorage.setItem(LANG_KEY, nextLang);
        setIcons();
    }

    window.toggleTheme = toggleThemePersisted;
    window.toggleLanguage = toggleLanguagePersisted;

    applySavedPreferences();
})();
