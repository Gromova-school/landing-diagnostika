(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.getElementById("nav-menu");

  function setNavOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMenu.classList.toggle("is-open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.contains("is-open");
      setNavOpen(!isOpen);
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    var headerCta = document.querySelector(".header-cta");
    if (headerCta) {
      headerCta.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    });
  }

  document.querySelectorAll("[data-placeholder-link]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.alert(
        "Ссылка на оплату будет добавлена позже. Пока это временная заглушка."
      );
    });
  });
})();

// Reveal each second-screen element once; content is visible without this script.
(function () {
  var section = document.querySelector('.readiness, .diagnostic-process');
  if (!section || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.readiness [data-readiness-reveal], .diagnostic-process [data-readiness-reveal]').forEach(function (element) {
    observer.observe(element);
    element.classList.add('reveal-ready');
  });
})();
// Connect labels to normalized points on the unchanged barrel artwork.
(function () {
  var root = document.querySelector('.readiness__composition');
  if (!root) return;
  var image = root.querySelector('img');
  var svg = root.querySelector('svg');
  var cards = root.querySelectorAll('.readiness__card');
  var points = [[.235,.285],[.335,.40],[.655,.34],[.58,.47],[.79,.47]];
  var ns = 'http://www.w3.org/2000/svg';
  var groups = [];
  cards.forEach(function (card) {
    var group = document.createElementNS(ns, 'g');
    group.appendChild(document.createElementNS(ns, 'path'));
    group.appendChild(document.createElementNS(ns, 'circle'));
    svg.appendChild(group);
    groups.push(group);
  });
  function draw() {
    var box = root.getBoundingClientRect();
    var picture = image.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    cards.forEach(function (card, index) {
      var rect = card.getBoundingClientRect();
      var left = index < 2;
      var x = (left ? rect.right : rect.left) - box.left;
      var y = rect.top - box.top + 22;
      var endX = picture.left - box.left + picture.width * points[index][0];
      var endY = picture.top - box.top + picture.height * points[index][1];
      var elbow = left ? x + 12 : x - 12;
      groups[index].querySelector('path').setAttribute('d', 'M ' + x + ' ' + y + ' H ' + elbow + ' L ' + endX + ' ' + endY);
      var dot = groups[index].querySelector('circle');
      dot.setAttribute('cx', endX);
      dot.setAttribute('cy', endY);
      dot.setAttribute('r', 5);
      var revealed = card.classList.contains('is-revealed');
      groups[index].style.opacity = card.classList.contains('reveal-ready') && !revealed ? '0' : '1';
      groups[index].style.transition = 'opacity 700ms ease';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) groups[index].style.transition = 'none';
    });
  }
  root.addEventListener('animationend', draw);
  image.addEventListener('load', draw);
  window.addEventListener('resize', draw);
  if ('ResizeObserver' in window) new ResizeObserver(draw).observe(root);
  new MutationObserver(draw).observe(root, {subtree: true, attributes: true, attributeFilter: ['class']});
  if (document.fonts) document.fonts.ready.then(draw);
  draw();
})();
// Native dialog supplies focus containment and Escape dismissal.
(function () {
  var section = document.querySelector('.report-preview');
  if (!section) return;
  var dialog = section.querySelector('dialog');
  var enlarged = dialog.querySelector('img');
  var trigger;
  section.querySelectorAll('.report-preview__zoom').forEach(function (button) {
    button.addEventListener('click', function () {
      trigger = button;
      var image = button.querySelector('img');
      enlarged.src = image.getAttribute('src');
      enlarged.alt = image.alt;
      dialog.showModal();
      dialog.querySelector('.report-lightbox__scroll').scrollTo(0, 0);
      document.documentElement.classList.add('report-lightbox-open');
    });
  });
  dialog.querySelector('button').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    var rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    document.documentElement.classList.remove('report-lightbox-open');
    if (trigger) trigger.focus({preventScroll: true});
  });
})();