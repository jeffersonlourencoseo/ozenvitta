document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const bar1 = toggle?.querySelector('[data-bar="1"]');
  const bar2 = toggle?.querySelector('[data-bar="2"]');
  const bar3 = toggle?.querySelector('[data-bar="3"]');
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu?.classList.remove('translate-x-full');
    overlay?.classList.remove('opacity-0', 'pointer-events-none');
    overlay?.classList.add('opacity-100', 'pointer-events-auto');
    toggle?.setAttribute('aria-expanded', 'true');

    bar1?.classList.add('rotate-45', 'translate-y-[7px]');
    bar2?.classList.add('opacity-0');
    bar3?.classList.add('-rotate-45', '-translate-y-[7px]');

    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    menu?.classList.add('translate-x-full');
    overlay?.classList.remove('opacity-100', 'pointer-events-auto');
    overlay?.classList.add('opacity-0', 'pointer-events-none');
    toggle?.setAttribute('aria-expanded', 'false');

    bar1?.classList.remove('rotate-45', 'translate-y-[7px]');
    bar2?.classList.remove('opacity-0');
    bar3?.classList.remove('-rotate-45', '-translate-y-[7px]');

    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', function () {
    if (isOpen) closeMenu();
    else openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  menu?.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
});
