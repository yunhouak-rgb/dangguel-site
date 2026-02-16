/* 자동 생성:
   - blog_index.html : 글 목록 페이지
   - sitemap.xml     : 사이트맵
   - robots.txt      : 로봇 규칙 + 사이트맵 위치
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const BASE_URL = process.env.BASE_URL || "https://dangguel.netlify.app";

// 글 파일 규칙: blog_post_ 로 시작하는 파일을 "블로그 글"로 봅니다.
// 예) blog_post_company.html  -> URL: /blog_post_company
const POST_PREFIX = "blog_post_";

function listPostFiles() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(name => name.startsWith(POST_PREFIX))
    .filter(name => !name.startsWith("blog_index")); // 혹시 겹치면 제외
}

function slugFromFilename(filename) {
  // blog_post_xxx.html -> blog_post_xxx
  if (filename.toLowerCase().endsWith(".html")) return filename.slice(0, -5);
  return filename; // 확장자 없는 경우도 대비
}

function urlFromFilename(filename) {
  return `/${slugFromFilename(filename)}`;
}

function safeRead(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickFirstMatch(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : "";
}

function extractTitle(html) {
  // 1) h1 우선, 2) title fallback
  const h1 = pickFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1);
  const t = pickFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  return t ? stripTags(t) : "제목 없음";
}

function extractDescription(html) {
  // meta description 우선
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (m && m[1]) return m[1].trim();

  // 없으면 첫 p
  const p = pickFirstMatch(html, /<p[^>]*>([\s\S]*?)<\/p>/i);
  return p ? stripTags(p).slice(0, 120) : "";
}

function getLastModDate(filename) {
  // git 커밋 날짜(YYYY-MM-DD)를 우선 사용 (없으면 파일 수정일)
  try {
    const out = execSync(`git log -1 --format=%cs -- "${filename}"`, { encoding: "utf8" }).trim();
    if (out) return out;
  } catch (_) {}
  const stat = fs.statSync(path.join(ROOT, filename));
  return new Date(stat.mtime).toISOString().slice(0, 10);
}

function writeFile(name, content) {
  fs.writeFileSync(path.join(ROOT, name), content, "utf8");
  console.log(`generated: ${name}`);
}

function buildBlogIndex(posts) {
  const cards = posts.map(p => `
    <a href="${p.url}" class="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div class="text-sm text-slate-500">${p.date}</div>
      <div class="mt-2 text-xl font-extrabold text-slate-900">${escapeHtml(p.title)}</div>
      <div class="mt-2 text-slate-700">${escapeHtml(p.desc || "")}</div>
      <div class="mt-4 font-bold text-blue-700">자세히 보기 →</div>
    </a>
  `).join("\n");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>취업 꿀팁 - 당글 블로그</title>
  <meta name="description" content="자소서 작성법, 면접 준비, 기업 분석 등 취업 전략을 정리한 당글 블로그입니다." />
  <link rel="canonical" href="${BASE_URL}/blog_index" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="취업 꿀팁 - 당글 블로그" />
  <meta property="og:description" content="취업 전략 글 모음" />
  <meta property="og:url" content="${BASE_URL}/blog_index" />

  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900">
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <div class="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
      <a href="/" class="font-extrabold tracking-tight text-lg">당글</a>
      <nav class="flex items-center gap-3 text-sm">
        <a class="px-3 py-2 rounded-lg hover:bg-slate-100" href="/diagnosis">무료 진단</a>
        <a class="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200" href="/blog_index">취업 꿀팁</a>
        <a class="px-3 py-2 rounded-lg text-white bg-slate-900 hover:opacity-95" href="/">가이드북 구매</a>
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-5xl px-4 py-10">
    <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight">
      취업 꿀팁
    </h1>
    <p class="mt-3 text-slate-700">
      글을 올리면 목록과 사이트맵이 자동으로 갱신됩니다.
    </p>

    <section class="mt-8 grid gap-4 sm:grid-cols-2">
      ${cards || `<div class="text-slate-600">아직 글이 없습니다.</div>`}
    </section>

    <div class="mt-10 rounded-2xl p-6 bg-white border border-slate-200">
      <div class="font-extrabold text-lg">이제 막연한 준비는 그만</div>
      <div class="mt-2 text-slate-700">무료 진단으로 현재 상태부터 확인해보세요.</div>
      <div class="mt-4 flex gap-3 flex-col sm:flex-row">
        <a class="px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-center" href="/diagnosis">무료 진단 받기</a>
        <a class="px-4 py-3 rounded-xl bg-slate-100 font-bold text-center" href="/">가이드북 보기</a>
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600">
      © 2025 당글. Contact: yuncontest@naver.com
    </div>
  </footer>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildSitemap(urlItems) {
  const body = urlItems.map(item => `
  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
  </url>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

function main() {
  const files = listPostFiles();

  const posts = files.map(file => {
    const html = safeRead(file);
    return {
      file,
      url: urlFromFilename(file),
      title: extractTitle(html),
      desc: extractDescription(html),
      date: getLastModDate(file)
    };
  }).sort((a,b) => (b.date || "").localeCompare(a.date || ""));

  // 1) blog_index.html 생성
  writeFile("blog_index.html", buildBlogIndex(posts));

  // 2) sitemap.xml 생성 (홈 + 블로그 목록 + 각 글)
  const pages = [
    { loc: `${BASE_URL}/`, lastmod: getLastModDate("index.html") || new Date().toISOString().slice(0,10) },
    { loc: `${BASE_URL}/blog_index`, lastmod: new Date().toISOString().slice(0,10) },
    ...posts.map(p => ({ loc: `${BASE_URL}${p.url}`, lastmod: p.date }))
  ];
  writeFile("sitemap.xml", buildSitemap(pages));

  // 3) robots.txt 생성 (사이트맵 위치를 robots에 적어두면 구글이 찾을 수 있음) :contentReference[oaicite:1]{index=1}
  writeFile("robots.txt", `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`);
}

main();
