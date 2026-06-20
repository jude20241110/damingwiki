(async function(){
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  const input = document.getElementById('q');
  const info = document.getElementById('resultInfo');
  const box = document.getElementById('results');
  if (input) input.value = q;
  if (!q) { info.textContent = '请输入关键词进行搜索。'; return; }

  const VERSION = String(Date.now());
  const noCache = url => `${url}${url.includes('?') ? '&' : '?'}v=${VERSION}`;
  const stripHTML = html => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  try {
    info.textContent = '正在搜索……';
    const data = await fetch(noCache('data/chapters.json'), { cache: 'no-store' }).then(r => r.json());
    const chapters = data.books.flatMap(book => book.chapters)
      .filter(ch => ch.status !== 'draft' && ch.status !== 'disabled');
    const keys = q.toLowerCase().split(/\s+/).filter(Boolean);
    const results = [];

    for (const ch of chapters) {
      const [ori, trans] = await Promise.all([
        fetch(noCache(ch.original), { cache: 'no-store' }).then(r => r.text()).catch(() => ''),
        fetch(noCache(ch.translation), { cache: 'no-store' }).then(r => r.text()).catch(() => '')
      ]);
      const text = `${ch.title} ${ch.tocTitle || ''} ${stripHTML(ori)} ${stripHTML(trans)}`;
      const hay = text.toLowerCase();
      if (keys.every(k => hay.includes(k))) {
        const pos = Math.max(0, hay.indexOf(keys[0]) - 40);
        results.push({ title: ch.title, url: `reader.html?id=${encodeURIComponent(ch.id)}`, snippet: text.slice(pos, pos + 140) });
      }
    }

    info.textContent = `搜索“${q}”，找到 ${results.length} 条结果。`;
    if (!results.length) { box.innerHTML = '<p class="empty">没有找到结果。你可以换一个关键词。</p>'; return; }
    box.innerHTML = results.map(item => `<a class="result-item" href="${item.url}"><h2>${item.title}</h2><p>${item.snippet}...</p></a>`).join('');
  } catch (err) {
    console.error(err);
    info.textContent = '搜索数据读取失败。';
    box.innerHTML = '<p class="empty">如果是在本地直接打开文件，请使用 VS Code 的 Live Server 或上传到网站后再测试。</p>';
  }
})();
