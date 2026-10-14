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
        var scrollY = window.scrollY;
        if (scrollY > 40) {
            topbar.classList.add('topbar--scrolled');
        } else {
            topbar.classList.remove('topbar--scrolled');
        }
        updateScrollProgress();
        reveal();
    }

    function updateScrollProgress() {
        var bar = document.getElementById('scrollProgress');
        if (!bar) return;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = Math.min(progress, 100) + '%';
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

    function initTiltEffect() {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        var tiltElements = document.querySelectorAll('.js-tilt');

        tiltElements.forEach(function (el) {
            el.style.transformStyle = 'preserve-3d';
            el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -6;
                var rotateY = ((x - centerX) / centerX) * 6;

                el.style.transform = 'perspective(800px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    function initTabTitleEffect() {
        var originalTitle = document.title;
        var awayTitle = 'Görüşmek üzere · Barış Kıymetli';

        window.addEventListener('blur', function () {
            document.title = awayTitle;
        });

        window.addEventListener('focus', function () {
            document.title = originalTitle;
        });
    }

    function initFloatingIconsCanvas() {
        var canvas = document.getElementById('floatingIconsCanvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var container = canvas.parentElement;

        var width = 0;
        var height = 0;

        function resize() {
            var rect = container.getBoundingClientRect();
            width = rect.width + 60;
            height = rect.height + 60;
            canvas.width = width;
            canvas.height = height;
        }
        resize();
        window.addEventListener('resize', resize);

        var tools = [
            { type: 'figma', w: 46, h: 68 },
            { type: 'ps', w: 54, h: 54 },
            { type: 'ai', w: 54, h: 54 },
            { type: 'xd', w: 54, h: 54 },
            { type: 'vs', w: 56, h: 56 },
            { type: 'html', w: 50, h: 56 },
            { type: 'css', w: 50, h: 56 },
            { type: 'js', w: 52, h: 52 }
        ];

        var particles = tools.map(function (tool) {
            var radius = Math.max(tool.w, tool.h) * 0.55;
            return {
                tool: tool,
                x: radius + 20 + Math.random() * (width - radius * 2 - 40),
                y: radius + 20 + Math.random() * (height - radius * 2 - 40),
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                radius: radius,
                rotation: (Math.random() - 0.5) * 0.25,
                vRot: (Math.random() - 0.5) * 0.005
            };
        });

        function updatePhysics() {
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.vRot;

                if (p.x - p.radius < 0) {
                    p.x = p.radius;
                    p.vx *= -1;
                } else if (p.x + p.radius > width) {
                    p.x = width - p.radius;
                    p.vx *= -1;
                }

                if (p.y - p.radius < 0) {
                    p.y = p.radius;
                    p.vy *= -1;
                } else if (p.y + p.radius > height) {
                    p.y = height - p.radius;
                    p.vy *= -1;
                }

                for (var j = i + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var dx = p2.x - p.x;
                    var dy = p2.y - p.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var minDist = p.radius + p2.radius + 6;

                    if (dist < minDist && dist > 0) {
                        var angle = Math.atan2(dy, dx);
                        var sin = Math.sin(angle);
                        var cos = Math.cos(angle);

                        var vx1 = p.vx * cos + p.vy * sin;
                        var vy1 = p.vy * cos - p.vx * sin;
                        var vx2 = p2.vx * cos + p2.vy * sin;
                        var vy2 = p2.vy * cos - p2.vx * sin;

                        p.vx = vx2 * cos - vy1 * sin;
                        p.vy = vy1 * cos + vx2 * sin;
                        p2.vx = vx1 * cos - vy2 * sin;
                        p2.vy = vy2 * cos + vx1 * sin;

                        var overlap = 0.5 * (minDist - dist);
                        p.x -= overlap * cos;
                        p.y -= overlap * sin;
                        p2.x += overlap * cos;
                        p2.y += overlap * sin;
                    }
                }
            }
        }

        function drawPureLogo(type) {
            ctx.save();

            if (type === 'figma') {
                var s = 10;
                ctx.fillStyle = '#F24E1E';
                ctx.beginPath();
                ctx.arc(-s, -s * 2, s, Math.PI * 0.5, Math.PI * 1.5);
                ctx.rect(-s, -s * 3, s, s * 2);
                ctx.fill();

                ctx.fillStyle = '#FF7262';
                ctx.beginPath();
                ctx.arc(s, -s * 2, s, Math.PI * 1.5, Math.PI * 0.5);
                ctx.rect(0, -s * 3, s, s * 2);
                ctx.fill();

                ctx.fillStyle = '#A259FF';
                ctx.beginPath();
                ctx.arc(-s, 0, s, Math.PI * 0.5, Math.PI * 1.5);
                ctx.rect(-s, -s, s, s * 2);
                ctx.fill();

                ctx.fillStyle = '#1ABCFE';
                ctx.beginPath();
                ctx.arc(0, 0, s, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#0ACF83';
                ctx.beginPath();
                ctx.arc(-s, s * 2, s, Math.PI * 0.5, Math.PI * 1.5);
                ctx.arc(-s, s * 2, s, 0, Math.PI * 0.5);
                ctx.lineTo(-s, s * 3);
                ctx.lineTo(0, s * 3);
                ctx.lineTo(0, s);
                ctx.lineTo(-s, s);
                ctx.fill();
            } else if (type === 'ps') {
                ctx.fillStyle = '#001E36';
                ctx.strokeStyle = '#31A8FF';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(-25, -25, 50, 50, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#31A8FF';
                ctx.font = '800 24px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Ps', 0, 2);
            } else if (type === 'ai') {
                ctx.fillStyle = '#330000';
                ctx.strokeStyle = '#FF9A00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(-25, -25, 50, 50, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#FF9A00';
                ctx.font = '800 24px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Ai', 0, 2);
            } else if (type === 'xd') {
                ctx.fillStyle = '#2E001E';
                ctx.strokeStyle = '#FF61F6';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(-25, -25, 50, 50, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#FF61F6';
                ctx.font = '800 24px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Xd', 0, 2);
            } else if (type === 'vs') {
                ctx.fillStyle = '#007ACC';
                ctx.beginPath();
                ctx.moveTo(-16, -18);
                ctx.lineTo(18, 0);
                ctx.lineTo(-16, 18);
                ctx.lineTo(-6, 0);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '800 13px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('VS', 0, 0);
            } else if (type === 'html') {
                ctx.fillStyle = '#E44D26';
                ctx.beginPath();
                ctx.moveTo(-22, -26);
                ctx.lineTo(22, -26);
                ctx.lineTo(17, 20);
                ctx.lineTo(0, 26);
                ctx.lineTo(-17, 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#F16529';
                ctx.beginPath();
                ctx.moveTo(0, -22);
                ctx.lineTo(18, -22);
                ctx.lineTo(14, 18);
                ctx.lineTo(0, 22);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '900 18px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('5', 0, 2);
            } else if (type === 'css') {
                ctx.fillStyle = '#1572B6';
                ctx.beginPath();
                ctx.moveTo(-22, -26);
                ctx.lineTo(22, -26);
                ctx.lineTo(17, 20);
                ctx.lineTo(0, 26);
                ctx.lineTo(-17, 20);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#33A9DC';
                ctx.beginPath();
                ctx.moveTo(0, -22);
                ctx.lineTo(18, -22);
                ctx.lineTo(14, 18);
                ctx.lineTo(0, 22);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#FFFFFF';
                ctx.font = '900 18px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('3', 0, 2);
            } else if (type === 'js') {
                ctx.fillStyle = '#F7DF1E';
                ctx.beginPath();
                ctx.roundRect(-24, -24, 48, 48, 6);
                ctx.fill();

                ctx.fillStyle = '#000000';
                ctx.font = '800 22px "Syne", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('JS', 2, 2);
            }

            ctx.restore();
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                drawPureLogo(p.tool.type);

                ctx.restore();
            }
        }

        function loop() {
            updatePhysics();
            draw();
            requestAnimationFrame(loop);
        }

        loop();
    }

    assignReveals();
    initCustomCursor();
    initProjectFollower();
    initEmailCopy();
    initTiltEffect();
    initTabTitleEffect();
    initFloatingIconsCanvas();
    window.addEventListener('scroll', onScroll);
    scrollHandler();
})();
