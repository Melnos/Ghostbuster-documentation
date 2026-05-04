(function () {
    var THEME_KEY = 'ghostbuster-theme';
    var LANG_KEY = 'ghostbuster-lang';
    var MIGRATION_KEY = 'ghostbuster-preferences-v3';

    if (localStorage.getItem(MIGRATION_KEY) !== '1') {
        localStorage.setItem(THEME_KEY, 'light');
        localStorage.setItem(LANG_KEY, 'en');
        localStorage.setItem(MIGRATION_KEY, '1');
    }

    var theme = localStorage.getItem(THEME_KEY);
    var lang = localStorage.getItem(LANG_KEY);

    if (theme !== 'light' && theme !== 'dark') {
        theme = 'light';
    }

    if (lang !== 'fr' && lang !== 'en') {
        lang = 'en';
    }

    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    root.setAttribute('translate', 'no');

    function applyToBody() {
        var body = document.body;
        if (!body) {
            return false;
        }

        body.setAttribute('data-theme', theme);
        body.setAttribute('data-lang', lang);
        body.setAttribute('translate', 'no');
        return true;
    }

    if (!applyToBody() && typeof MutationObserver !== 'undefined') {
        var observer = new MutationObserver(function () {
            if (applyToBody()) {
                observer.disconnect();
            }
        });
        observer.observe(root, { childList: true });
    }
})();
