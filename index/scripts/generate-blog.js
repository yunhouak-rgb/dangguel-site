const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const BASE_URL = process.env.BASE_URL || "https://dangguel.netlify.app";

const NAV_ITEMS = [
  { href: "/diagnosis", label: "무료 진단", key: "diagnosis" },
  { href: "/blog/company-analysis", label: "기업이해", key: "companyUnderstanding" },
  { href: "/blog/interview", label: "면접", key: "interview" },
  { href: "/blog/cover-letter", label: "자소서", key: "coverLetter" },
  { href: "/blog/mind-care", label: "마음관리", key: "mindCare" },
  { href: "/#ebook", label: "가이드북", key: "guidebook", cta: true }
];

const TOPICS = {
  companyUnderstanding: {
    slug: "company-analysis",
    title: "기업이해",
    heroTitle: "기업을 제대로 이해해야 자소서와 면접이 흔들리지 않습니다",
    description:
      "기업 정보 나열이 아니라, 왜 지원하는지와 어디에 기여할지를 선명하게 만드는 글을 모았습니다.",
    beginnerGuide: [
      "산업, 회사, 직무를 한 줄로 연결해 보면 지원 기준이 훨씬 또렷해집니다.",
      "기업이해는 자소서용 조사로 끝나는 것이 아니라 면접 답변까지 이어져야 의미가 있습니다.",
      "회사 소개를 복사하는 대신 나와 맞는 이유를 정리해야 읽는 흐름이 살아납니다."
    ],
    ctaTitle: "기업이해부터 정리하면 전체 준비 흐름이 안정됩니다",
    ctaText:
      "무료 진단으로 현재 이해도와 병목 지점을 확인한 뒤, 필요한 글부터 차례대로 읽어보세요."
  },
  interview: {
    slug: "interview",
    title: "면접",
    heroTitle: "면접 답변을 실전 흐름으로 정리하는 글",
    description:
      "1분 자기소개, 마지막 한마디, 면접관 관점의 답변 전략까지 실전에 바로 연결되는 글을 모았습니다.",
    beginnerGuide: [
      "면접 답변은 길게 말하는 것보다 결론, 근거, 직무 연결 순서가 더 안정적입니다.",
      "1분 자기소개는 경력 소개보다 내가 어떤 사람인지 빠르게 이해시키는 구조가 중요합니다.",
      "마지막 한마디는 새 이야기를 꺼내기보다 강점과 기여 의지를 또렷하게 남기는 편이 좋습니다."
    ],
    ctaTitle: "면접 준비 상태를 먼저 확인해보세요",
    ctaText:
      "무료 진단으로 지금 부족한 지점을 찾고, 필요한 면접 글부터 읽으면 준비가 훨씬 선명해집니다."
  },
  coverLetter: {
    slug: "cover-letter",
    title: "자소서",
    heroTitle: "자소서를 더 설득력 있게 만드는 글",
    description:
      "지원동기, 구조, 경험 정리, 직무별 예시까지 한 번에 이어서 볼 수 있도록 묶었습니다.",
    beginnerGuide: [
      "좋은 자소서는 감정 표현보다 경험과 직무 역량의 연결이 먼저 보입니다.",
      "지원동기는 회사 칭찬보다 왜 내가 이 역할에 맞는지 설명할 때 설득력이 높아집니다.",
      "평범한 경험도 행동, 판단, 결과로 나누면 훨씬 선명한 이야기로 바뀝니다."
    ],
    ctaTitle: "자소서 완성도는 구조를 잡는 순간부터 올라갑니다",
    ctaText:
      "무료 진단으로 자소서 준비 수준을 확인하고, 필요한 예시와 구조 글을 바로 이어서 읽어보세요."
  },
  mindCare: {
    slug: "mind-care",
    title: "마음관리",
    heroTitle: "흔들리는 취업 준비 흐름을 다시 잡아주는 글",
    description:
      "불안, 과몰입, 지원 범위 혼란처럼 준비를 멈추게 만드는 지점을 다루는 글을 모아갈 수 있게 구조를 열어두었습니다.",
    beginnerGuide: [
      "마음관리는 의지를 다잡는 문제가 아니라 준비 흐름을 무너뜨리는 요인을 줄이는 작업입니다.",
      "지원 범위가 넓어질수록 불안도 커지기 쉬우니 기준을 먼저 정리하는 편이 도움이 됩니다.",
      "지금 당장 완벽해지려 하기보다 다음 행동 한 가지를 정하는 것이 준비를 이어가게 만듭니다."
    ],
    ctaTitle: "준비 흐름이 흔들릴수록 진단부터 가볍게 시작하세요",
    ctaText:
      "무료 진단으로 현재 상태를 점검하고, 부담이 덜한 글 한 편부터 읽으면서 흐름을 다시 만들 수 있습니다."
  }
};

const ARTICLES = [
  {
    file: "blog_post_company.html",
    slug: "company-analysis-framework",
    title: "기업 분석 프레임워크",
    description: "기업을 이해하고 나와의 연결점을 찾는 기준을 정리한 글입니다.",
    topic: "companyUnderstanding",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_interview.html",
    slug: "interview-strategy",
    title: "면접 전략",
    description: "면접관 관점에서 답변 흐름을 정리하는 대표 가이드입니다.",
    topic: "interview",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_interview_1min_self_intro_examples_master.html",
    slug: "interview-1minute-self-introduction-examples",
    title: "면접 1분 자기소개 예시 20개",
    description: "바로 참고할 수 있는 1분 자기소개 구조와 예시를 정리했습니다.",
    topic: "interview",
    featured: true,
    readTime: "8분"
  },
  {
    file: "blog_post_interview_final_comment_examples.html",
    slug: "interview-final-comment-examples",
    title: "면접 마지막 한마디 예시 10개",
    description: "면접 말미에 인상을 남기는 짧고 선명한 구조를 정리했습니다.",
    topic: "interview",
    featured: false,
    readTime: "6분"
  },
  {
    file: "blog_post_coverletter_support_motivation_examples.html",
    slug: "cover-letter-motivation-examples",
    title: "자소서 지원동기 예시 10개",
    description: "직무별 지원동기 구조와 예시를 모은 대표 자소서 가이드입니다.",
    topic: "coverLetter",
    featured: true,
    readTime: "7분"
  },
  {
    file: "blog_post_resume_structure.html",
    slug: "cover-letter-structure-3-steps",
    title: "자소서 구조 3단계",
    description: "결론, 근거, 회사 연결 흐름으로 자소서를 정리하는 기본 구조입니다.",
    topic: "coverLetter",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_experience.html",
    slug: "experience-story-structuring",
    title: "경험 스토리 구조화",
    description: "흩어진 경험을 자소서와 면접에 쓰기 좋게 다시 묶는 방법을 설명합니다.",
    topic: "coverLetter",
    featured: true,
    readTime: "7분"
  },
  {
    file: "blog_post_nurse_jasoser_motivation.html",
    slug: "nurse-cover-letter-motivation",
    title: "간호사 자소서 지원동기 쓰는 법",
    description: "간호사 지원동기를 더 설득력 있게 쓰는 예시와 구조를 정리했습니다.",
    topic: "coverLetter",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_secretary_jasoser_motivation.html",
    slug: "secretary-cover-letter-motivation",
    title: "비서 자소서 지원동기와 입사 후 포부 쓰는 법",
    description: "비서 직무에 맞춘 자소서 구조를 정리한 글입니다.",
    topic: "coverLetter",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_teacher_jasoser_motivation.html",
    slug: "teacher-cover-letter-motivation",
    title: "보육교사 자소서 지원동기와 입사 후 포부 쓰는 법",
    description: "보육교사 직무에 맞춘 자소서 구조를 정리한 글입니다.",
    topic: "coverLetter",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_support.html",
    slug: "job-search-scope-strategy",
    title: "지원 범위를 좁히면 준비가 쉬워집니다",
    description: "흔들리는 지원 기준을 줄이고 준비 흐름을 다시 세우는 방법을 다룹니다.",
    topic: "mindCare",
    featured: true,
    readTime: "7분"
  }
];

function safeRead(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function writeFile(name, content) {
  fs.writeFileSync(path.join(ROOT, name), content, "utf8");
  console.log(`generated: ${name}`);
}

function getLastModDate(filename) {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${filename}"`, {
      encoding: "utf8"
    }).trim();
    if (out) return out;
  } catch (_) {}

  const stat = fs.statSync(path.join(ROOT, filename));
  return new Date(stat.mtime).toISOString().slice(0, 10);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickFirstMatch(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : "";
}

function extractTitle(html, fallback) {
  const h1 = pickFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1);

  const title = pickFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? stripTags(title) : fallback;
}

function extractDescription(html, fallback) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  return match && match[1] ? match[1].trim() : fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function articleRoute(article) {
  return `/blog/${article.slug}`;
}

function topicRoute(topicKey) {
  return `/blog/${TOPICS[topicKey].slug}`;
}

function topicFile(topicKey) {
  return `blog_topic_${TOPICS[topicKey].slug.replace(/-/g, "_")}.html`;
}

function formatDate(dateString) {
  return dateString.replaceAll("-", ".");
}

function buildSiteNav(activeNav) {
  return `<nav class="site-nav">
        ${NAV_ITEMS.map((item) => {
          const classes = [
            item.cta ? "nav-cta" : "",
            activeNav === item.key ? "is-active" : ""
          ]
            .filter(Boolean)
            .join(" ");
          return `<a href="${item.href}"${classes ? ` class="${classes}"` : ""}>${item.label}</a>`;
        }).join("")}
      </nav>`;
}

function buildFooter() {
  return `<footer class="footer">
    <div class="container" style="padding-top:40px;padding-bottom:40px;">
      <div class="footer__grid">
        <a href="/" class="hover:text-slate-900">홈</a>
        <a href="/diagnosis" class="hover:text-slate-900">무료 진단</a>
        <a href="/blog/company-analysis" class="hover:text-slate-900">기업이해</a>
        <a href="/blog/interview" class="hover:text-slate-900">면접</a>
        <a href="/blog/cover-letter" class="hover:text-slate-900">자소서</a>
        <a href="/blog/mind-care" class="hover:text-slate-900">마음관리</a>
        <a href="/#ebook" class="hover:text-slate-900">가이드북</a>
      </div>
      <div style="margin-top:16px;color:var(--text-secondary);font-size:0.95rem;">© 2026 당글. Contact: yuncontest@naver.com</div>
    </div>
  </footer>`;
}

function pageShell({
  title,
  description,
  canonical,
  activeNav,
  ogType = "website",
  ogTitle,
  ogDescription,
  ogUrl,
  schema = "",
  mainContent
}) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:title" content="${escapeHtml(ogTitle || title)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription || description)}" />
  <meta property="og:url" content="${ogUrl || canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(ogTitle || title)}" />
  <meta name="twitter:description" content="${escapeHtml(ogDescription || description)}" />
  ${schema}
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-HK51X34WHJ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-HK51X34WHJ');
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/site.css" />
</head>
<body class="bg-slate-50 text-slate-900">
  <header class="site-header">
    <div class="container site-header__inner">
      <a href="/" class="site-logo">당글</a>
      ${buildSiteNav(activeNav)}
    </div>
  </header>
  ${mainContent}
  ${buildFooter()}
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const items = document.querySelectorAll('.fade-up');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      items.forEach((item) => observer.observe(item));
    });
  </script>
</body>
</html>`;
}

function buildGuideActions(readHref, readLabel = "글 읽기") {
  return `<div class="hero__actions">
    <a href="/diagnosis" class="btn btn--primary">무료 진단</a>
    <a href="${readHref}" class="btn btn--secondary">${readLabel}</a>
    <a href="/#ebook" class="text-link text-link--muted">가이드북 보기</a>
  </div>`;
}

function buildArticleCard(article) {
  return `<article class="card fade-up article-card">
    <div class="card-label">${escapeHtml(TOPICS[article.topic].title)}</div>
    <h3 class="card-title">${escapeHtml(article.title)}</h3>
    <p class="card-text">${escapeHtml(article.description)}</p>
    <div class="card-meta">${formatDate(article.date)} · ${escapeHtml(article.readTime)}</div>
    <div class="card-action-row">
      <a href="${articleRoute(article)}" class="btn btn--secondary">글 읽기</a>
    </div>
  </article>`;
}

function buildTopicCard(topicKey, posts) {
  const topic = TOPICS[topicKey];
  const previewPosts = posts.slice(0, 3);
  return `<article class="card fade-up">
    <div class="card-label">${topic.title}</div>
    <h3 class="card-title">${topic.heroTitle}</h3>
    <p class="card-text">${topic.description}</p>
    <ul class="plain-list" style="margin-top:18px;font-size:0.95rem;">
      ${
        previewPosts.length
          ? previewPosts
              .map(
                (post) =>
                  `<li><a href="${articleRoute(post)}" class="hover:text-slate-900 hover:underline">${escapeHtml(
                    post.title
                  )}</a></li>`
              )
              .join("")
          : `<li>새 글이 추가되면 이 허브에서 바로 이어서 읽을 수 있습니다.</li>`
      }
    </ul>
    <div class="card-action-row" style="margin-top:22px;">
      <a href="${topicRoute(topicKey)}" class="btn btn--secondary">글 읽기</a>
    </div>
  </article>`;
}

function buildEmptyTopicNotice(topic) {
  return `<article class="card fade-up">
    <div class="card-label">${topic.title}</div>
    <h3 class="card-title">이 카테고리는 다음 글이 이어질 준비를 마쳤습니다</h3>
    <p class="card-text">지금은 진단과 가이드로 흐름을 먼저 잡고, 이후 추가될 글이 이 자리에서 자연스럽게 이어지도록 구조를 열어두었습니다.</p>
  </article>`;
}

function buildBlogHub(posts) {
  const featured = posts.filter((post) => post.featured).slice(0, 6);
  const schema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "당글 취업 블로그 허브",
    "description": "기업이해, 면접, 자소서, 마음관리 4개 카테고리로 정리한 취업 블로그 허브",
    "url": "${BASE_URL}/blog",
    "publisher": { "@type": "Organization", "name": "당글" }
  }
  </script>`;

  return pageShell({
    title: "취업 블로그 허브 | 기업이해, 면접, 자소서, 마음관리 | 당글",
    description:
      "기업이해, 면접, 자소서, 마음관리 4개 카테고리로 글을 묶어 다음 행동까지 자연스럽게 이어지는 블로그 허브입니다.",
    canonical: `${BASE_URL}/blog`,
    ogTitle: "취업 블로그 허브 | 당글",
    ogDescription:
      "기업이해, 면접, 자소서, 마음관리 4개 카테고리로 정리한 취업 블로그 허브",
    ogUrl: `${BASE_URL}/blog`,
    schema,
    mainContent: `<main>
      <section class="hero">
        <div class="container hero__grid">
          <div>
            <div class="eyebrow">읽기 흐름이 끊기지 않도록 정리한 취업 허브</div>
            <h1 class="hero__title">검색으로 들어온 한 글이<br />다음 행동으로 이어지게</h1>
            <p class="hero__body">기업이해, 면접, 자소서, 마음관리 4개 카테고리로 글을 다시 묶었습니다. 먼저 무료 진단으로 현재 위치를 확인하고, 필요한 글을 자연스럽게 이어서 읽을 수 있게 구성했습니다.</p>
            ${buildGuideActions("#topic-grid")}
          </div>
          <div class="hero-card fade-up">
            <div class="card-label">처음 보는 분을 위한 흐름</div>
            <ol style="margin:18px 0 0;padding-left:18px;color:var(--text-secondary);font-size:0.98rem;">
              <li>1. 무료 진단으로 현재 병목을 먼저 확인합니다.</li>
              <li>2. 필요한 카테고리를 고르고 관련 글을 읽습니다.</li>
              <li>3. 읽은 내용을 가이드북과 다음 행동으로 연결합니다.</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div>
            <h2 class="section-title">4개 카테고리 허브</h2>
            <p class="section-body">카테고리 이름과 안내 문구를 단순하게 맞춰서, 지금 필요한 글을 고르기 쉽게 정리했습니다.</p>
          </div>
        </div>
        <div id="topic-grid" class="container card-grid card-grid--2" style="margin-top:28px;">
          ${Object.keys(TOPICS)
            .map((key) => buildTopicCard(key, posts.filter((post) => post.topic === key)))
            .join("")}
        </div>
      </section>

      <section class="section section--alt">
        <div class="container">
          <h2 class="section-title">지금 많이 읽는 글</h2>
          <p class="section-body">카테고리 허브로 들어가기 전에, 가장 먼저 많이 읽히는 글부터 가볍게 살펴볼 수 있습니다.</p>
          <div class="card-grid card-grid--2" style="margin-top:28px;">
            ${featured.map((post) => buildArticleCard(post)).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="cta-panel fade-up">
            <div class="card-label">다음 행동</div>
            <h2 class="section-title" style="margin-top:14px;">어디서 시작할지 고민될 때는 진단이 가장 빠릅니다</h2>
            <p class="section-body">무엇을 더 읽어야 할지 헷갈릴수록 무료 진단으로 현재 상태를 먼저 확인하고, 필요한 글과 가이드북으로 차례대로 이어가 보세요.</p>
            ${buildGuideActions("#topic-grid")}
          </div>
        </div>
      </section>
    </main>`
  });
}

function buildTopicHub(topicKey, posts) {
  const topic = TOPICS[topicKey];
  const firstArticle = posts[0];
  const schema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${topic.title} 허브 | 당글",
    "description": "${topic.description}",
    "url": "${BASE_URL}${topicRoute(topicKey)}"
  }
  </script>`;

  const guideReadHref = firstArticle ? articleRoute(firstArticle) : "/blog";

  return pageShell({
    title: `${topic.title} 허브 | ${topic.heroTitle} | 당글`,
    description: topic.description,
    canonical: `${BASE_URL}${topicRoute(topicKey)}`,
    activeNav: topicKey,
    ogTitle: `${topic.title} 허브 | 당글`,
    ogDescription: topic.description,
    ogUrl: `${BASE_URL}${topicRoute(topicKey)}`,
    schema,
    mainContent: `<main>
      <section class="hero">
        <div class="container">
          <nav class="breadcrumb">
            <a href="/">홈</a>
            <span>/</span>
            <a href="/blog">블로그</a>
            <span>/</span>
            <span>${topic.title}</span>
          </nav>
          <div style="max-width:780px;margin-top:20px;">
            <div class="eyebrow">${topic.title} 허브</div>
            <h1 class="hero__title">${topic.heroTitle}</h1>
            <p class="hero__body">${topic.description}</p>
            ${buildGuideActions(guideReadHref)}
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container hub-flow">
          <div class="guide-grid">
            <article class="card fade-up">
              <div class="card-label">초보자 가이드</div>
              <h2 class="card-title">처음 읽을 때는 이 순서로 보면 됩니다</h2>
              <ul class="plain-list" style="margin-top:18px;">
                ${topic.beginnerGuide.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </article>
            <article class="card card--soft fade-up">
              <div class="card-label">추천 다음 행동</div>
              <h2 class="card-title">${topic.ctaTitle}</h2>
              <p class="card-text">${topic.ctaText}</p>
              ${buildGuideActions(guideReadHref)}
            </article>
          </div>

          <div id="topic-articles" class="article-list-section">
            <div>
              <h2 class="section-title">이 카테고리에서 이어서 읽을 글</h2>
              <p class="section-body">왼쪽과 오른쪽으로 나뉘지 않도록, 위에서 아래로 자연스럽게 읽히는 흐름으로 정리했습니다.</p>
            </div>
            <div class="article-list" style="margin-top:28px;">
              ${
                posts.length
                  ? posts.map((post) => buildArticleCard(post)).join("")
                  : buildEmptyTopicNotice(topic)
              }
            </div>
          </div>
        </div>
      </section>
    </main>`
  });
}

function buildSitemap(urlItems) {
  const body = urlItems
    .map(
      (item) => `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function buildRedirects(posts) {
  const rewriteRules = [
    `/diagnosis                                /diagnosis.html                                     200`,
    `/blog                                     /blog_index.html                                    200`,
    `/blog/                                    /blog_index.html                                    200`,
    `/blog/company-analysis                    /${topicFile("companyUnderstanding")}                200`,
    `/blog/interview                           /${topicFile("interview")}                           200`,
    `/blog/cover-letter                        /${topicFile("coverLetter")}                         200`,
    `/blog/mind-care                           /${topicFile("mindCare")}                            200`
  ];

  const articleRewrites = posts.map(
    (post) => `${articleRoute(post).padEnd(41)} /${post.file.padEnd(50)} 200`
  );

  const legacyRedirects = [
    `/diagnosis.html                           /diagnosis                                          301`,
    `/blog_index.html                          /blog                                               301`,
    `/blog/index.html                          /blog                                               301`,
    `/blog/job-search-strategy                 /blog/mind-care                                     301`,
    `/blog_post_company.html                   /blog/company-analysis-framework                    301`,
    `/blog_post_coverletter_support_motivation_examples.html /blog/cover-letter-motivation-examples 301`,
    `/blog_post_experience.html                /blog/experience-story-structuring                  301`,
    `/blog_post_interview.html                 /blog/interview-strategy                            301`,
    `/blog_post_interview_1min_self_intro_examples_master.html /blog/interview-1minute-self-introduction-examples 301`,
    `/blog_post_interview_final_comment_examples.html /blog/interview-final-comment-examples        301`,
    `/blog_post_nurse_jasoser_motivation.html  /blog/nurse-cover-letter-motivation                 301`,
    `/blog_post_resume_structure.html          /blog/cover-letter-structure-3-steps                301`,
    `/blog_post_secretary_jasoser_motivation.html /blog/secretary-cover-letter-motivation          301`,
    `/blog_post_support.html                   /blog/job-search-scope-strategy                     301`,
    `/blog_post_teacher_jasoser_motivation.html /blog/teacher-cover-letter-motivation              301`,
    `/blog_index                               /blog                                               301`,
    `/blog/posts/interview-strategy.html       /blog/interview-strategy                            301`,
    `/blog/posts/experience-differentiation.html /blog/experience-story-structuring                301`,
    `/blog/posts/nurse-jasoser-motivation.html /blog/nurse-cover-letter-motivation                 301`,
    `/blog/posts/secretary-jasoser-motivation.html /blog/secretary-cover-letter-motivation         301`,
    `/blog/posts/teacher-jasoser-motivation.html /blog/teacher-cover-letter-motivation             301`,
    `/blog/posts/nurse-jasoser-personality.html /blog/cover-letter-structure-3-steps              301`,
    `/blog/posts/jasoser-mistakes.html         /blog/cover-letter-structure-3-steps                301`
  ];

  return [...rewriteRules, ...articleRewrites, "", ...legacyRedirects].join("\n") + "\n";
}

function main() {
  const posts = ARTICLES.map((article) => {
    return {
      ...article,
      title: article.title,
      description: article.description,
      date: getLastModDate(article.file)
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  writeFile("blog_index.html", buildBlogHub(posts));

  Object.keys(TOPICS).forEach((topicKey) => {
    const topicPosts = posts.filter((post) => post.topic === topicKey);
    writeFile(topicFile(topicKey), buildTopicHub(topicKey, topicPosts));
  });

  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    { loc: `${BASE_URL}/`, lastmod: getLastModDate("index.html") },
    { loc: `${BASE_URL}/diagnosis`, lastmod: getLastModDate("diagnosis.html") },
    { loc: `${BASE_URL}/blog`, lastmod: today },
    ...Object.keys(TOPICS).map((topicKey) => ({
      loc: `${BASE_URL}${topicRoute(topicKey)}`,
      lastmod: today
    })),
    ...posts.map((post) => ({
      loc: `${BASE_URL}${articleRoute(post)}`,
      lastmod: post.date
    }))
  ];

  writeFile("sitemap.xml", buildSitemap(pages));
  writeFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
  writeFile("_redirects", buildRedirects(posts));
}

main();
