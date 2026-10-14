(() => {
  const byId = id => document.getElementById(id);
  byId('year').textContent = new Date().getFullYear();

  const copy = byId('copy-email');
  if (copy) copy.addEventListener('click', async () => {
    const email = document.querySelector('#contact-links a[href^="mailto:"]').getAttribute('href').slice(7);
    try {
      await navigator.clipboard.writeText(email);
      copy.textContent = '복사 완료 ✓';
      byId('contact-status').textContent = '이메일 주소가 복사되었습니다.';
      setTimeout(() => { copy.textContent = '이메일 복사'; }, 2000);
    } catch {
      byId('contact-status').textContent = '복사할 수 없습니다. 이메일 링크에서 주소를 확인해주세요.';
      copy.textContent = '복사 실패';
    }
  });

  const toggle = byId('theme-toggle');
  const updateTheme = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    byId('theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
    toggle.setAttribute('aria-label', dark ? '라이트 모드로 변경' : '다크 모드로 변경');
    toggle.setAttribute('aria-pressed', String(dark));
  };
  toggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('profile-theme', theme); } catch {}
    updateTheme();
  });
  updateTheme();

  const links = [...document.querySelectorAll('.navigation a')];
  let scheduled = false;
  const updateNavigation = () => {
    const threshold = innerWidth <= 780 ? 145 : 180;
    let current = links[0];
    for (const link of links) {
      if (document.querySelector(link.hash).getBoundingClientRect().top <= threshold) current = link;
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 5) current = links[links.length - 1];
    for (const link of links) {
      link.classList.toggle('active', link === current);
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  addEventListener('resize', updateNavigation);
  updateNavigation();
})();
