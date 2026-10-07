(function () {
    var topbar = document.getElementById('topbar');
    var burger = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    var allNavAnchors = navLinks.querySelectorAll('a');
    var sections = document.querySelectorAll('section, footer, header');
    var ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                scrollHandler();
                ticking = false;
            });
            ticking = true;
        }
    }

    function scrollHandler() {
        if (window.scrollY > 40) {
            topbar.classList.add('topbar--scrolled');
        } else {
            topbar.classList.remove('topbar--scrolled');
        }
        reveal();
    }

    function reveal() {
        var els = document.querySelectorAll('.reveal');
        var vh = window.innerHeight;
        els.forEach(function (el) {
            if (el.getBoundingClientRect().top < vh - 60) {
                el.classList.add('reveal--visible');
            }
        });
    }

    function openNav() {
        burger.classList.add('topbar__burger--open');
        navLinks.classList.add('topbar__links--open');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        burger.classList.remove('topbar__burger--open');
        navLinks.classList.remove('topbar__links--open');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
        if (navLinks.classList.contains('topbar__links--open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    allNavAnchors.forEach(function (a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            closeNav();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        if (!a.closest('.topbar__links')) {
            a.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href && href.length > 1) {
                    e.preventDefault();
                    var el = document.querySelector(href);
                    if (el) {
                        window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
                    }
                }
            });
        }
    });

    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('topbar__links--open')) {
            if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
                closeNav();
            }
        }
    });

    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    function assignReveals() {
        document.querySelectorAll('.section-title').forEach(function (el) {
            el.classList.add('reveal');
        });

        var manifesto = document.querySelector('.manifesto');
        if (manifesto) manifesto.classList.add('reveal', 'reveal--d1');

        document.querySelectorAll('.detail-row').forEach(function (el, i) {
            el.classList.add('reveal', 'reveal--d' + Math.min(i + 1, 3));
        });

        document.querySelectorAll('.tools-group').forEach(function (el, i) {
            el.classList.add('reveal', 'reveal--d' + Math.min(i + 1, 3));
        });

        document.querySelectorAll('.project-row').forEach(function (el, i) {
            el.classList.add('reveal', 'reveal--d' + Math.min(i + 1, 3));
        });

        var splitPortrait = document.querySelector('.split__portrait');
        if (splitPortrait) splitPortrait.classList.add('reveal');

        var footerGrid = document.querySelector('.footer__grid');
        if (footerGrid) footerGrid.classList.add('reveal');

        var footerBottom = document.querySelector('.footer__bottom');
        if (footerBottom) footerBottom.classList.add('reveal', 'reveal--d1');
    }

    assignReveals();
    window.addEventListener('scroll', onScroll);
    scrollHandler();
})();
