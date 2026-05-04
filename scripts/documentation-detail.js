function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        if (icon) {
            icon.textContent = '👻';
        }
    } else {
        body.setAttribute('data-theme', 'dark');
        if (icon) {
            icon.textContent = '👻';
        }
    }
}

function toggleLanguage() {
    const body = document.body;
    const icon = document.getElementById('langIcon');
    if (body.getAttribute('data-lang') === 'fr') {
        body.setAttribute('data-lang', 'en');
        if (icon) {
            icon.textContent = 'EN';
        }
    } else {
        body.setAttribute('data-lang', 'fr');
        if (icon) {
            icon.textContent = 'FR';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            if (!img.dataset.fallbackApplied) {
                img.dataset.fallbackApplied = 'true';
                img.src = 'images/placeholder.svg';
            }
        });
    });
});
