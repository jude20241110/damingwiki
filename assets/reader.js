(function(){
  const tocBtn = document.getElementById('tocBtn');
  const tocPanel = document.getElementById('tocPanel');
  const closeToc = document.getElementById('closeToc');
  const notesWrap = document.getElementById('notesWrap');
  const notesBtn = document.getElementById('notesBtn');
  const themeBtn = document.getElementById('themeBtn');
  const smallFont = document.getElementById('smallFont');
  const largeFont = document.getElementById('largeFont');
  let scale = 1;

  function openToc(){ tocPanel?.classList.remove('hidden'); }
  function closeTocPanel(){ tocPanel?.classList.add('hidden'); }
  function setFont(){ document.documentElement.style.setProperty('--reader-scale', scale); }

  tocBtn?.addEventListener('click', openToc);
  closeToc?.addEventListener('click', closeTocPanel);

  notesBtn?.addEventListener('click', ()=>{
    notesWrap.classList.toggle('collapsed');
    notesBtn.textContent = notesWrap.classList.contains('collapsed') ? '显示注释' : '隐藏注释';
  });

  themeBtn?.addEventListener('click', ()=>{
    document.body.classList.toggle('night');
    themeBtn.textContent = document.body.classList.contains('night') ? '日间模式' : '夜间模式';
  });

  smallFont?.addEventListener('click', ()=>{ scale = Math.max(0.88, scale - 0.06); setFont(); });
  largeFont?.addEventListener('click', ()=>{ scale = Math.min(1.28, scale + 0.06); setFont(); });

  /* 手机阅读：单栏显示，只在“原文 / 翻译”之间切换 */
  const textGrid = document.querySelector('.text-grid');
  const textBlocks = document.querySelectorAll('.text-grid .text-block');

  if (textGrid && textBlocks.length >= 2) {
    textBlocks[0].classList.add('original-block');
    textBlocks[1].classList.add('translation-block');

    const mobileTabs = document.createElement('div');
    mobileTabs.className = 'mobile-tabs';
    mobileTabs.innerHTML = `
      <button class="mobile-tab" data-view="original" type="button">原文</button>
      <button class="mobile-tab" data-view="translation" type="button">翻译</button>
    `;
    textGrid.before(mobileTabs);

    const savedView = localStorage.getItem('reader-mobile-view') || 'translation';

    function setMobileView(view){
      const finalView = view === 'original' ? 'original' : 'translation';
      document.body.classList.remove('mobile-show-original', 'mobile-show-translation');
      document.body.classList.add(`mobile-show-${finalView}`);
      localStorage.setItem('reader-mobile-view', finalView);

      mobileTabs.querySelectorAll('.mobile-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === finalView);
      });
    }

    mobileTabs.addEventListener('click', (event) => {
      const btn = event.target.closest('.mobile-tab');
      if (!btn) return;
      setMobileView(btn.dataset.view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    setMobileView(savedView);
  }

  /* 手机顶部导航：目录 / 上一章 / 下一章 / 首页 */
  const header = document.querySelector('.reader-header');
  const chapterLinks = document.querySelectorAll('.chapter-nav .chapter-btn');

  if (header && !document.querySelector('.mobile-reader-nav')) {
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-reader-nav';

    const prev = chapterLinks[0];
    const next = chapterLinks[1];

    function navItemFromChapterLink(link, text){
      if (!link || link.classList.contains('disabled') || link.getAttribute('href') === '#') {
        return `<span class="mobile-nav-item disabled">${text}</span>`;
      }
      return `<a class="mobile-nav-item" href="${link.getAttribute('href')}">${text}</a>`;
    }

    mobileNav.innerHTML = `
      <button class="mobile-nav-item" id="mobileTocBtn" type="button">目录</button>
      ${navItemFromChapterLink(prev, '上一章')}
      ${navItemFromChapterLink(next, '下一章')}
      <a class="mobile-nav-item" href="../index.html">首页</a>
    `;

    header.after(mobileNav);
    document.getElementById('mobileTocBtn')?.addEventListener('click', openToc);
  }
})();
