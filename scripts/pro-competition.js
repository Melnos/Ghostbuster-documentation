(function () {
    function addMobileBottomNav() {
        const nav = document.getElementById('navbar');
        const links = nav ? nav.querySelector('.nav-links') : null;
        if (!nav || !links || document.querySelector('.mobile-bottom-nav')) {
            return;
        }

        const iconByHref = {
            'index.html': 'fa-house',
            'equipe.html': 'fa-users',
            'robot.html': 'fa-robot',
            'documentation.html': 'fa-book-open',
            'roadmap.html': 'fa-map',
            'contact.html': 'fa-envelope',
            'index.html#contact': 'fa-envelope'
        };

        const currentPath = window.location.pathname.toLowerCase();
        const dock = document.createElement('nav');
        dock.className = 'mobile-bottom-nav';
        dock.setAttribute('aria-label', 'Mobile navigation');

        links.querySelectorAll('a').forEach(function (anchor) {
            const href = anchor.getAttribute('href') || '#';
            const key = href.toLowerCase();

            const item = document.createElement('a');
            item.className = 'mobile-bottom-nav-item';
            item.href = href;

            if (currentPath.endsWith(key)) {
                item.classList.add('active');
            }

            const frNode = anchor.querySelector('.lang-fr');
            const enNode = anchor.querySelector('.lang-en');
            const frText = frNode ? frNode.textContent.trim() : anchor.textContent.trim();
            const enText = enNode ? enNode.textContent.trim() : anchor.textContent.trim();
            const iconClass = iconByHref[key] || 'fa-circle';

            item.innerHTML = [
                '<i class="fas ' + iconClass + '" aria-hidden="true"></i>',
                '<span class="lang-fr">' + frText + '</span>',
                '<span class="lang-en">' + enText + '</span>'
            ].join('');

            dock.appendChild(item);
        });

        document.body.appendChild(dock);
        document.body.classList.add('has-mobile-bottom-nav');
    }

    function addScrollEffects() {
        const nav = document.getElementById('navbar');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        let lastY = window.scrollY;
        let dropTimer = null;

        const onScroll = function () {
            const currentY = window.scrollY;

            if (nav) {
                if (currentY > 20) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }

            if (isMobile) {
                if (currentY > lastY + 6 && currentY > 80) {
                    document.body.classList.add('mobile-nav-hidden');
                    document.body.classList.remove('mobile-nav-dropping');
                    if (dropTimer) {
                        window.clearTimeout(dropTimer);
                        dropTimer = null;
                    }
                } else if (currentY < lastY - 6) {
                    const wasHidden = document.body.classList.contains('mobile-nav-hidden');
                    document.body.classList.remove('mobile-nav-hidden');

                    if (wasHidden) {
                        document.body.classList.add('mobile-nav-dropping');
                        if (dropTimer) {
                            window.clearTimeout(dropTimer);
                        }
                        dropTimer = window.setTimeout(function () {
                            document.body.classList.remove('mobile-nav-dropping');
                            dropTimer = null;
                        }, 420);
                    }
                }
            }

            lastY = currentY;
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function revealOnScroll() {
        const candidates = document.querySelectorAll(
            'section, .team-card, .membre-item, .info-card, .phase-content, .detail-card, .doc-section, .doc-card, .tech-item, .contact-info-card, .contact-form-card, .specs-category'
        );

        if (!('IntersectionObserver' in window)) {
            candidates.forEach(function (item) {
                item.classList.add('reveal-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        candidates.forEach(function (item) {
            item.classList.add('reveal-on-scroll');
            observer.observe(item);
        });
    }

    function addVoteCta() {
        const isDocDetailPage = document.body.classList.contains('doc-detail-page');
        if (isDocDetailPage) {
            return;
        }

        if (document.querySelector('.vote-cta')) {
            return;
        }

        const cta = document.createElement('a');
        cta.className = 'vote-cta';
        cta.href = 'https://eventslink.diginets.site/vote-nominee.php?slug=olympiade-de-robotique-ucao-2026-69af11ed33d40&candidat=team-ghostbuster';
        cta.innerHTML = '<span class="lang-fr">Votez GhostBuster</span><span class="lang-en">Vote GhostBuster</span>';
        document.body.appendChild(cta);
    }

    function getCompetitionDate() {
        const now = new Date();
        const year = now.getFullYear();
        let target = new Date(year, 5, 6, 0, 0, 0, 0);
        if (now > target) {
            target = new Date(year + 1, 5, 6, 0, 0, 0, 0);
        }
        return target;
    }

    function addCountdownWidget() {
        if (document.querySelector('.countdown-widget')) {
            return;
        }

        const path = window.location.pathname.toLowerCase();
        const isHomePage = path.endsWith('/index.html') || path.endsWith('/');
        if (!isHomePage) {
            return;
        }

        const target = getCompetitionDate();
        const widget = document.createElement('aside');
        widget.className = 'countdown-widget';
        widget.innerHTML = [
            '<div class="countdown-title">',
            '<span class="lang-fr">Cap sur le concours du 6 juin</span>',
            '<span class="lang-en">Countdown to June 6 contest</span>',
            '</div>',
            '<div class="countdown-grid">',
            '<div class="countdown-item"><span class="countdown-value" data-unit="days">0</span><span class="countdown-label">Jours</span></div>',
            '<div class="countdown-item"><span class="countdown-value" data-unit="hours">0</span><span class="countdown-label">Heures</span></div>',
            '<div class="countdown-item"><span class="countdown-value" data-unit="minutes">0</span><span class="countdown-label">Minutes</span></div>',
            '<div class="countdown-item"><span class="countdown-value" data-unit="seconds">0</span><span class="countdown-label">Secondes</span></div>',
            '</div>'
        ].join('');

        const heroContent = document.querySelector('.hero-content');
        const mainContent = document.querySelector('.main-content');

        if (heroContent) {
            widget.classList.add('in-hero');
            heroContent.appendChild(widget);
        } else if (mainContent) {
            widget.classList.add('in-main');
            mainContent.insertBefore(widget, mainContent.firstChild);
        } else {
            widget.classList.add('in-main');
            document.body.insertBefore(widget, document.body.firstChild);
        }

        function setValue(unit, value) {
            const node = widget.querySelector('[data-unit="' + unit + '"]');
            if (node) {
                node.textContent = String(value).padStart(2, '0');
            }
        }

        function tick() {
            const now = new Date();
            const distance = Math.max(target.getTime() - now.getTime(), 0);

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            setValue('days', days);
            setValue('hours', hours);
            setValue('minutes', minutes);
            setValue('seconds', seconds);
        }

        tick();
        window.setInterval(tick, 1000);
    }

    function addShareQr() {
        if (document.querySelector('.share-fab')) {
            return;
        }

        const pageUrl = window.location.href;
        const pageTitle = document.title;
        const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=' + encodeURIComponent(pageUrl);

        const fab = document.createElement('button');
        fab.className = 'share-fab';
        fab.type = 'button';
        fab.title = 'Partager cette page';
        fab.setAttribute('aria-label', 'Partager cette page');
        fab.innerHTML = '<i class="fas fa-share-alt"></i>';

        const panel = document.createElement('div');
        panel.className = 'share-panel';
        panel.innerHTML = [
            '<h4><span class="lang-fr">Partager ce projet</span><span class="lang-en">Share this project</span></h4>',
            '<div class="share-actions">',
            '<button type="button" data-action="copy"><i class="fas fa-link"></i> <span class="lang-fr">Copier</span><span class="lang-en">Copy</span></button>',
            '<button type="button" data-action="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>',
            '<button type="button" data-action="linkedin"><i class="fab fa-linkedin-in"></i> LinkedIn</button>',
            '<button type="button" data-action="twitter"><i class="fab fa-twitter"></i> Twitter</button>',
            '<a href="mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + encodeURIComponent(pageUrl) + '"><i class="fas fa-envelope"></i> Email</a>',
            '<a href="' + qrUrl + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-download"></i> QR Code</a>',
            '</div>',
            '<div class="share-qr">',
            '<img src="' + qrUrl + '" alt="QR code de partage">',
            '<p><span class="lang-fr">Scannez pour ouvrir cette page</span><span class="lang-en">Scan to open this page</span></p>',
            '</div>'
        ].join('');

        function closePanel() {
            panel.classList.remove('open');
        }

        fab.addEventListener('click', function () {
            panel.classList.toggle('open');
        });

        panel.addEventListener('click', function (event) {
            const target = event.target.closest('[data-action]');
            if (!target) {
                return;
            }

            const action = target.getAttribute('data-action');
            const shareText = 'Découvrez le projet de robotique GhostBuster !';
            
            if (action === 'whatsapp') {
                window.open('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + pageUrl), '_blank');
            } else if (action === 'linkedin') {
                window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl), '_blank');
            } else if (action === 'twitter') {
                window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(pageUrl), '_blank');
            } else if (action === 'copy' && navigator.clipboard) {
                navigator.clipboard.writeText(pageUrl).then(function () {
                    const originalText = target.innerHTML;
                    target.innerHTML = '<i class="fas fa-check"></i> OK';
                    window.setTimeout(function () {
                        target.innerHTML = originalText;
                    }, 1500);
                });
            }
        });

        document.addEventListener('click', function (event) {
            if (!panel.contains(event.target) && !fab.contains(event.target)) {
                closePanel();
            }
        });

        document.body.appendChild(fab);
        document.body.appendChild(panel);
    }

    document.addEventListener('DOMContentLoaded', function () {
        addMobileBottomNav();
        addScrollEffects();
        revealOnScroll();
        addVoteCta();
        addCountdownWidget();
        addShareQr();
    });
})();
