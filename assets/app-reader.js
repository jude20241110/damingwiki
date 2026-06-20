(() => {
  const VERSION = String(Date.now()); // 每次读取最新目录和文章，避免缓存卡住更新。
  const qs = new URLSearchParams(location.search);
  const wantedId = qs.get('id');

  const els = {
    pageTitle: document.getElementById('pageTitle'),
    title: document.getElementById('articleTitle'),
    loading: document.getElementById('loadingMessage'),
    grid: document.getElementById('articleGrid'),
    original: document.getElementById('originalText'),
    translation: document.getElementById('translationText'),
    notesWrap: document.getElementById('notesWrap'),
    notesBtn: document.getElementById('notesBtn'),
    notesText: document.getElementById('notesText'),
    chapterNav: document.getElementById('chapterNav'),
    tocPanel: document.getElementById('tocPanel'),
    tocBtn: document.getElementById('tocBtn'),
    themeBtn: document.getElementById('themeBtn'),
    smallFont: document.getElementById('smallFont'),
    largeFont: document.getElementById('largeFont'),
  };

  let scale = Number(localStorage.getItem('readerScale') || '1');

  function noCache(url) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${VERSION}`;
  }

  async function fetchText(url) {
    const res = await fetch(noCache(url), { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url} 读取失败：${res.status}`);
    return await res.text();
  }

  async function fetchJSON(url) {
    const res = await fetch(noCache(url), { cache: 'no-store' });
    if (!res.ok) throw new Error(`${url} 读取失败：${res.status}`);
    return await res.json();
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  }

  function publishedChapters(book) {
    return book.chapters.filter(ch => ch.status !== 'draft' && ch.status !== 'disabled');
  }

  function readerURL(id) {
    return `reader.html?id=${encodeURIComponent(id)}`;
  }

  function buildToc(data, currentId) {
    const html = [
      '<div class="toc-head"><strong>目录</strong><button id="closeToc" aria-label="关闭目录">×</button></div>'
    ];
    data.books.forEach(book => {
      html.push('<details open>');
      html.push(`<summary>${escapeHTML(book.title)}</summary>`);
      book.chapters.forEach(ch => {
        if (ch.status === 'draft' || ch.status === 'disabled') {
          html.push(`<span class="toc-disabled">${escapeHTML(ch.tocTitle || ch.title)}</span>`);
        } else {
          const current = ch.id === currentId ? ' class="current"' : '';
          html.push(`<a${current} href="${readerURL(ch.id)}">${escapeHTML(ch.tocTitle || ch.title)}</a>`);
        }
      });
      html.push('</details>');
    });
    els.tocPanel.innerHTML = html.join('');
    els.tocPanel.querySelector('#closeToc')?.addEventListener('click', () => els.tocPanel.classList.add('hidden'));
  }

  function makeButton(ch, label, disabled) {
    if (!ch || disabled) return `<a class="chapter-btn disabled" href="#">${label}</a>`;
    return `<a class="chapter-btn" href="${readerURL(ch.id)}">${label}</a>`;
  }

  function buildChapterNav(book, current) {
    const list = publishedChapters(book);
    const idx = list.findIndex(ch => ch.id === current.id);
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    els.chapterNav.innerHTML = `${makeButton(prev, '‹ 上一章', !prev)}${makeButton(next, '下一章 ›', !next)}`;
    buildMobileNav(prev, next);
  }

  function buildMobileNav(prev, next) {
    if (document.querySelector('.mobile-reader-nav')) return;
    const nav = document.createElement('nav');
    nav.className = 'mobile-reader-nav';
    nav.innerHTML = `
      <button class="mobile-nav-item" type="button" id="mobileTocBtn">目录</button>
      ${prev ? `<a class="mobile-nav-item" href="${readerURL(prev.id)}">上一章</a>` : '<span class="mobile-nav-item disabled">上一章</span>'}
      ${next ? `<a class="mobile-nav-item" href="${readerURL(next.id)}">下一章</a>` : '<span class="mobile-nav-item disabled">下一章</span>'}
      <a class="mobile-nav-item" href="index.html">首页</a>
    `;
    document.querySelector('.reader-header')?.after(nav);
    nav.querySelector('#mobileTocBtn')?.addEventListener('click', () => els.tocPanel.classList.remove('hidden'));
  }

  function bindReaderTools() {
    els.tocBtn?.addEventListener('click', () => els.tocPanel.classList.remove('hidden'));
    els.themeBtn?.addEventListener('click', () => {
      document.body.classList.toggle('night');
      localStorage.setItem('readerNight', document.body.classList.contains('night') ? '1' : '0');
    });
    if (localStorage.getItem('readerNight') === '1') document.body.classList.add('night');

    function setFont() {
      document.documentElement.style.setProperty('--reader-scale', scale);
      localStorage.setItem('readerScale', String(scale));
    }
    els.smallFont?.addEventListener('click', () => { scale = Math.max(0.85, scale - 0.08); setFont(); });
    els.largeFont?.addEventListener('click', () => { scale = Math.min(1.35, scale + 0.08); setFont(); });
    setFont();

    els.notesBtn?.addEventListener('click', () => {
      els.notesWrap.classList.toggle('collapsed');
      els.notesBtn.textContent = els.notesWrap.classList.contains('collapsed') ? '显示注释' : '隐藏注释';
    });

    document.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.dataset.view;
        document.body.classList.toggle('mobile-show-original', view === 'original');
        document.body.classList.toggle('mobile-show-translation', view === 'translation');
        document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function findChapter(data, id) {
    for (const book of data.books) {
      const ch = book.chapters.find(item => item.id === id);
      if (ch) return { book, ch };
    }
    const firstBook = data.books[0];
    return { book: firstBook, ch: publishedChapters(firstBook)[0] };
  }

  async function load() {
    bindReaderTools();
    try {
      const data = await fetchJSON('data/chapters.json');
      const { book, ch } = findChapter(data, wantedId);
      buildToc(data, ch.id);
      buildChapterNav(book, ch);

      els.title.textContent = ch.title;
      document.title = ch.title;

      if (ch.status === 'draft' || ch.status === 'disabled') {
        els.loading.textContent = '这一卷正在更新中。';
        return;
      }

      const [originalHTML, translationHTML, notesHTML] = await Promise.all([
        fetchText(ch.original),
        fetchText(ch.translation),
        ch.notes ? fetchText(ch.notes) : Promise.resolve('<p>暂无注释。</p>')
      ]);

      els.original.innerHTML = originalHTML;
      els.translation.innerHTML = translationHTML;
      els.notesText.innerHTML = notesHTML;
      els.loading.hidden = true;
      els.grid.hidden = false;
      els.notesWrap.hidden = false;
    } catch (err) {
      console.error(err);
      els.loading.innerHTML = `
        <p>文章读取失败。</p>
        <p>如果你是在电脑本地直接双击打开文件，这是正常的：新版模板需要通过网站服务器读取文章数据。</p>
        <p>请上传到网站后测试，或在 VS Code 使用 Live Server 打开。</p>
      `;
    }
  }

  load();
})();
