const tocHTML = `
  <div class="toc-head">
    <strong>目录</strong>
    <button id="closeToc">×</button>
  </div>

  <details open>
    <summary>太祖实录</summary>
    <a href="taizu-001.html">卷一　辛卯岁至甲午岁（1351—1354）</a>
    <a href="taizu-002.html">卷二　乙未岁（1355）</a>
    <a href="taizu-003.html">卷三　乙未岁（1355）</a>
     <a href="taizu-003.html">卷四　丙申岁（1356）</a>
    <span class="toc-disabled">卷五　正在更新中</span>
  </details>
`;

const tocPanel = document.getElementById("tocPanel");

if (tocPanel) {
  tocPanel.innerHTML = tocHTML;

  const currentFile = location.pathname.split("/").pop();
  const links = tocPanel.querySelectorAll("a");

  links.forEach(link => {
    if (link.getAttribute("href") === currentFile) {
      link.classList.add("current");
    }
  });
}