明实录网站维护说明（新版简化模板）

一、以后不要再直接编辑 articles/taizu-001.html 这类旧文章页。
这些旧文章页现在只负责跳转到新版 reader.html。
真正的文章内容放在 data/articles/ 文件夹里。

二、新版文件结构

reader.html
  全站唯一阅读页。目录、上一章、下一章、手机原文/翻译切换都会自动生成。

data/chapters.json
  全站目录。新增一卷时，只需要在这里登记一次。

data/articles/taizu-001-original.html
  卷一原文。

data/articles/taizu-001-translation.html
  卷一翻译。

data/articles/taizu-001-notes.html
  卷一注释，可空。

三、以后新增一卷的流程

假设你要新增卷六：

1. 在 data/articles/ 新建三个文件：
   taizu-006-original.html
   taizu-006-translation.html
   taizu-006-notes.html

2. 在 original 文件里写原文，例如：
   <p>第一段原文。</p>
   <p>第二段原文。</p>

3. 在 translation 文件里写翻译，例如：
   <p>第一段翻译。</p>
   <p>第二段翻译。</p>

4. 在 data/chapters.json 里加一项：
   {
     "id": "taizu-006",
     "title": "太祖实录 · 卷六 · 某年（某年）",
     "tocTitle": "卷六　某年（某年）",
     "status": "published",
     "original": "data/articles/taizu-006-original.html",
     "translation": "data/articles/taizu-006-translation.html",
     "notes": "data/articles/taizu-006-notes.html"
   }

注意：上一章、下一章、目录都不用手改。

四、如果某卷还没完成

在 data/chapters.json 里写：
"status": "draft"

这样目录里会显示，但不能点击。
完成后改成：
"status": "published"

五、提交上传

git status
git add .
git commit -m "更新太祖实录卷六"
git push

六、本地预览

新版 reader.html 会读取 data 文件。直接双击 HTML 文件时，浏览器可能不允许读取。
最稳的方法是上传到网站后看，或者在 VS Code 使用 Live Server。

入口示例：
reader.html?id=taizu-001
reader.html?id=taizu-004
