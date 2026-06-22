/*
 * Konte Studio — UX enhancements
 * 1) Lightweight semi-transparent custom cursor (GPU-accelerated, desktop only)
 * 2) Hover/touch prefetch of internal pages for near-instant navigation
 * Designed to add zero perceptible input lag: a single rAF loop that idles when
 * the pointer is still, transform-only writes, and passive listeners.
 */
(function () {
    'use strict';

    /* ---------- 1. Custom cursor ---------- */
    function initCursor() {
        // Only on devices with a precise pointer (real mouse) — skip touch/mobile.
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.documentElement.classList.add('has-custom-cursor');
        document.body.appendChild(cursor);

        var targetX = window.innerWidth / 2;
        var targetY = window.innerHeight / 2;
        var curX = targetX;
        var curY = targetY;
        var rafId = null;

        function render() {
            // Ease toward the pointer for a soft, premium trailing feel.
            curX += (targetX - curX) * 0.2;
            curY += (targetY - curY) * 0.2;
            cursor.style.transform = 'translate3d(' + (curX - 12) + 'px,' + (curY - 12) + 'px,0)';
            // Stop the loop once we've effectively caught up — no idle rAF burn.
            if (Math.abs(targetX - curX) > 0.1 || Math.abs(targetY - curY) > 0.1) {
                rafId = requestAnimationFrame(render);
            } else {
                rafId = null;
            }
        }

        window.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
            if (rafId === null) rafId = requestAnimationFrame(render);
        }, { passive: true });

        // Grow softly over interactive elements.
        var HOVER_SEL = 'a, button, .list-item, .gallery-image-container, .logo-text';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest && e.target.closest(HOVER_SEL)) cursor.classList.add('hover');
        }, { passive: true });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest && e.target.closest(HOVER_SEL)) cursor.classList.remove('hover');
        }, { passive: true });

        // Fade out when the pointer leaves the window.
        document.addEventListener('mouseleave', function () { cursor.classList.add('hidden'); });
        document.addEventListener('mouseenter', function () { cursor.classList.remove('hidden'); });
    }

    /* ---------- 2. Prefetch internal pages on intent ---------- */
    function initPrefetch() {
        var prefetched = {};
        function prefetch(url) {
            if (!url || prefetched[url]) return;
            prefetched[url] = true;
            var link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }
        function isInternal(a) {
            return a && a.href && a.hostname === window.location.hostname &&
                /\.html?($|[?#])/.test(a.getAttribute('href') || '');
        }
        // On hover (desktop) or touchstart (mobile) we have ~100-300ms of intent
        // before the click — enough to fetch the next page in the background.
        document.addEventListener('mouseover', function (e) {
            var a = e.target.closest && e.target.closest('a');
            if (isInternal(a)) prefetch(a.href);
        }, { passive: true });
        document.addEventListener('touchstart', function (e) {
            var a = e.target.closest && e.target.closest('a');
            if (isInternal(a)) prefetch(a.href);
        }, { passive: true });
    }

    function init() {
        initCursor();
        initPrefetch();
    }

    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init);
})();
