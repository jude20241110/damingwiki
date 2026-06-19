(function(){
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  const input = document.getElementById('q');
  const info = document.getElementById('resultInfo');
  const box = document.getElementById('results');
  if (input) input.value = q;
  if (!q) { info.textContent = '请输入关键词进行搜索。'; return; }
  const keys = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = (window.SEARCH_INDEX || []).filter(item => {
    const hay = (item.title + ' ' + item.text).toLowerCase();
    return keys.every(k => hay.includes(k));
  });
  info.textContent = `搜索“${q}”，找到 ${results.length} 条结果。`;
  if (!results.length) { box.innerHTML = '<p class="empty">没有找到结果。你可以换一个关键词。</p>'; return; }
  box.innerHTML = results.map(item => {
    const snippet = item.text.slice(0, 110);
    return `<a class="result-item" href="${item.url}"><h2>${item.title}</h2><p>${snippet}...</p></a>`;
  }).join('');
})();
