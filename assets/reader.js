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

  function setFont(){ document.documentElement.style.setProperty('--reader-scale', scale); }
  tocBtn?.addEventListener('click', ()=> tocPanel.classList.remove('hidden'));
  closeToc?.addEventListener('click', ()=> tocPanel.classList.add('hidden'));
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
})();
