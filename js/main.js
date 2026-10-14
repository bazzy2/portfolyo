(function () {
    var topbar = document.getElementById('topbar');
    var burger = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    var allNavAnchors = navLinks.querySelectorAll('a');
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

    function initCustomCursor() {
        var dot = document.getElementById('cursorDot');
        var ring = document.getElementById('cursorRing');
        if (!dot || !ring || window.matchMedia('(pointer: coarse)').matches) return;

        var mouseX = 0;
        var mouseY = 0;
        var ringX = 0;
        var ringY = 0;
        var hasMoved = false;

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';

            if (!hasMoved) {
                dot.style.opacity = '1';
                ring.style.opacity = '1';
                ringX = mouseX;
                ringY = mouseY;
                hasMoved = true;
            }
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';

            requestAnimationFrame(animateRing);
        }
        animateRing();

        var interactives = document.querySelectorAll('a, button, .project-row, .ticker');
        interactives.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                ring.classList.add('custom-cursor-ring--hover');
            });
            el.addEventListener('mouseleave', function () {
                ring.classList.remove('custom-cursor-ring--hover');
            });
        });
    }

    function initProjectFollower() {
        var preview = document.getElementById('projectPreview');
        if (!preview || window.matchMedia('(pointer: coarse)').matches) return;

        var targetX = 0;
        var targetY = 0;
        var currentX = 0;
        var currentY = 0;
        var isHovering = false;

        window.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function animateFollower() {
            if (isHovering) {
                currentX += (targetX - currentX) * 0.2;
                currentY += (targetY - currentY) * 0.2;
                preview.style.left = currentX + 'px';
                preview.style.top = currentY + 'px';
            }
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        document.querySelectorAll('.project-row').forEach(function (row) {
            row.addEventListener('mouseenter', function () {
                var title = this.getAttribute('data-preview') || '';
                var sub = this.getAttribute('data-preview-sub') || '';

                preview.innerHTML = '<span class="project-preview-title">' + title + '</span>' +
                                    '<span class="project-preview-sub">' + sub + '</span>';
                preview.classList.add('project-preview-follow--visible');
                isHovering = true;
            });

            row.addEventListener('mouseleave', function () {
                preview.classList.remove('project-preview-follow--visible');
                isHovering = false;
            });
        });
    }

    function initEmailCopy() {
        var btn = document.getElementById('copyEmailBtn');
        var badge = document.getElementById('copyBadge');
        if (!btn || !badge) return;

        btn.addEventListener('click', function () {
            var email = 'bariskiymetli123@outlook.com';

            function showSuccess() {
                badge.textContent = 'Kopyalandı ✓';
                badge.classList.add('copy-badge--copied');
                setTimeout(function () {
                    badge.textContent = 'Kopyala';
                    badge.classList.remove('copy-badge--copied');
                }, 2200);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(showSuccess);
            } else {
                var temp = document.createElement('textarea');
                temp.value = email;
                document.body.appendChild(temp);
                temp.select();
                document.execCommand('copy');
                document.body.removeChild(temp);
                showSuccess();
            }
        });
    }

    assignReveals();
    initCustomCursor();
    initProjectFollower();
    initEmailCopy();
    window.addEventListener('scroll', onScroll);
    scrollHandler();
})();
