const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const BASE_URL = process.env.BASE_URL || "https://dangguel.netlify.app";

const TOPICS = {
  interview: {
    slug: "interview",
    title: "면접",
    heroTitle: "면접 준비가 막막할 때 먼저 봐야 할 글",
    description: "1분 자기소개, 마지막 한마디, 실무진·임원진 대응까지 면접 합격 확률을 높이는 핵심 글을 모았습니다.",
    beginnerGuide: [
      "1분 자기소개는 경력 소개가 아니라 직무 적합성을 짧게 증명하는 구조로 준비합니다.",
      "면접 답변은 사례를 길게 푸는 것보다, 결론-근거-직무 연결의 흐름이 더 안정적입니다.",
      "마지막 한마디는 새 이야기를 꺼내기보다 강점과 기여 의지를 정리하는 용도로 쓰는 것이 좋습니다."
    ],
    ctaTitle: "면접 준비 점수를 먼저 확인해보세요",
    ctaText: "무료 진단으로 현재 면접 준비 수준과 부족한 영역을 빠르게 점검할 수 있습니다.",
    color: "from-sky-600 to-cyan-500"
  },
  coverLetter: {
    slug: "cover-letter",
    title: "자소서",
    heroTitle: "자소서와 자기소개서를 더 설득력 있게 만드는 글",
    description: "지원동기, 자소서 구조, 경험 정리, 직무별 자기소개서 예시까지 한 번에 연결해서 볼 수 있도록 묶었습니다.",
    beginnerGuide: [
      "자소서는 감정 표현보다 경험을 직무 역량과 연결하는 구조가 더 중요합니다.",
      "지원동기는 왜 이 회사인지보다, 내가 어떤 근거로 이 직무에 맞는 사람인지부터 보여주는 편이 설득력이 높습니다.",
      "비슷한 경험이라도 활동-행동-성과로 쪼개면 차별화 포인트를 만들 수 있습니다."
    ],
    ctaTitle: "내 자소서 준비 수준부터 확인해보세요",
    ctaText: "무료 진단으로 자기이해, 경험 정리, 자소서 완성도를 먼저 점검한 뒤 필요한 글로 이동할 수 있습니다.",
    color: "from-fuchsia-600 to-pink-500"
  },
  companyAnalysis: {
    slug: "company-analysis",
    title: "기업·직무 분석",
    heroTitle: "기업 분석을 정보 나열이 아니라 전략으로 바꾸는 글",
    description: "기업 조사, 직무 이해, 지원 동기 연결을 더 깊게 만들고 싶은 사람을 위한 핵심 글을 정리했습니다.",
    beginnerGuide: [
      "기업 분석은 회사 소개를 요약하는 작업이 아니라, 내가 기여할 수 있는 포인트를 찾는 과정입니다.",
      "산업-회사-직무 순으로 보면 지원 동기와 면접 답변이 훨씬 일관되게 정리됩니다.",
      "기업 분석 결과는 자소서, 면접, 지원 우선순위 결정까지 함께 활용해야 효율이 높습니다."
    ],
    ctaTitle: "기업 분석 전에 현재 준비 상태를 점검해보세요",
    ctaText: "무료 진단으로 직무 이해도와 기업 분석 역량을 먼저 확인하면 어떤 글부터 읽어야 할지 훨씬 선명해집니다.",
    color: "from-emerald-600 to-teal-500"
  },
  jobSearchStrategy: {
    slug: "job-search-strategy",
    title: "지원 전략",
    heroTitle: "지원 범위와 취업 흐름을 정리해주는 글",
    description: "무작정 지원하는 단계에서 벗어나, 어떤 회사에 어떤 기준으로 지원할지 정리하게 돕는 전략 글을 모았습니다.",
    beginnerGuide: [
      "지원 전략은 회사를 많이 찾는 것이 아니라, 지원 범위를 먼저 정하는 것에서 시작합니다.",
      "지원할 직무와 산업의 기준이 없으면 자소서와 면접 답변도 계속 흔들리게 됩니다.",
      "지원 기록과 우선순위를 남기면 떨어진 경험도 다음 지원의 자산이 됩니다."
    ],
    ctaTitle: "취업 전략을 잡기 전에 진단부터 해보세요",
    ctaText: "무료 진단으로 현재 단계와 병목 구간을 확인한 뒤, 필요한 전략 글부터 읽으면 훨씬 덜 헤맵니다.",
    color: "from-indigo-600 to-violet-500"
  }
};

const ARTICLES = [
  {
    file: "blog_post_interview.html",
    slug: "interview-strategy",
    title: "면접관의 마음을 사로잡는 면접 전략",
    description: "1분 자기소개부터 압박면접까지, 실무진·임원진 면접관 유형별 대응 전략을 정리한 대표 면접 가이드입니다.",
    topic: "interview",
    tag: "대표 가이드",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_interview_1min_self_intro_examples_master.html",
    slug: "interview-1minute-self-introduction-examples",
    title: "면접 1분 자기소개 예시 20개",
    description: "신입·경력·직무별 1분 자기소개 예시와 구조 공식을 한 번에 정리한 실전 가이드입니다.",
    topic: "interview",
    tag: "면접 예시",
    featured: true,
    readTime: "8분"
  },
  {
    file: "blog_post_interview_final_comment_examples.html",
    slug: "interview-final-comment-examples",
    title: "면접 마지막 한마디 예시 10개",
    description: "면접 말미에 강점과 기여 의지를 짧고 선명하게 남기는 구조와 예시를 정리했습니다.",
    topic: "interview",
    tag: "면접 마무리",
    featured: false,
    readTime: "6분"
  },
  {
    file: "blog_post_coverletter_support_motivation_examples.html",
    slug: "cover-letter-motivation-examples",
    title: "자소서 지원동기 예시 10개",
    description: "직무별 지원동기 예시와 바로 활용할 수 있는 구조를 정리한 대표 자소서 가이드입니다.",
    topic: "coverLetter",
    tag: "지원동기",
    featured: true,
    readTime: "7분"
  },
  {
    file: "blog_post_resume_structure.html",
    slug: "cover-letter-structure-3-steps",
    title: "서류 탈락 줄이는 자소서 구조 3단계",
    description: "결론-근거-회사 연결의 흐름으로 자소서 완성도를 높이는 기본 구조를 정리했습니다.",
    topic: "coverLetter",
    tag: "기본기",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_experience.html",
    slug: "experience-story-structuring",
    title: "평범한 경험도 차별화할 수 있다?",
    description: "평범한 경험을 쪼개고 다시 구조화해 자소서와 면접에 쓰는 방법을 설명합니다.",
    topic: "coverLetter",
    tag: "경험 정리",
    featured: true,
    readTime: "7분"
  },
  {
    file: "blog_post_nurse_jasoser_motivation.html",
    slug: "nurse-cover-letter-motivation",
    title: "간호사 자소서 지원동기 쓰는법",
    description: "대학병원, 종합병원, 전문병원 예시까지 포함한 간호사 지원동기 가이드입니다.",
    topic: "coverLetter",
    tag: "직무별 예시",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_secretary_jasoser_motivation.html",
    slug: "secretary-cover-letter-motivation",
    title: "비서 자소서 지원동기와 입사 후 포부 쓰는법",
    description: "대기업, 외국계, 중소기업 상황에 맞춘 비서 자기소개서 전략을 정리했습니다.",
    topic: "coverLetter",
    tag: "직무별 예시",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_teacher_jasoser_motivation.html",
    slug: "teacher-cover-letter-motivation",
    title: "보육교사 자소서 지원동기와 입사 후 포부 쓰는법",
    description: "국공립, 민간, 직장 어린이집별로 지원동기 구조를 정리한 보육교사 가이드입니다.",
    topic: "coverLetter",
    tag: "직무별 예시",
    featured: false,
    readTime: "8분"
  },
  {
    file: "blog_post_company.html",
    slug: "company-analysis-framework",
    title: "기업 분석 제대로 하는 법",
    description: "홈페이지 내용을 베끼는 수준을 넘어, 인사이트를 만드는 기업 분석 프레임워크를 정리했습니다.",
    topic: "companyAnalysis",
    tag: "기업 분석",
    featured: true,
    readTime: "6분"
  },
  {
    file: "blog_post_support.html",
    slug: "job-search-scope-strategy",
    title: "지원 범위를 잡으면 지원이 쉬워진다",
    description: "직무·산업·회사 3축으로 지원 범위를 정리하고 우선순위를 만드는 지원 전략 가이드입니다.",
    topic: "jobSearchStrategy",
    tag: "지원 전략",
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
    const out = execSync(`git log -1 --format=%cs -- "${filename}"`, { encoding: "utf8" }).trim();
    if (out) return out;
  } catch (_) {}
  const stat = fs.statSync(path.join(ROOT, filename));
  return new Date(stat.mtime).toISOString().slice(0, 10);
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickFirstMatch(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : "";
}

function extractTitle(html, fallback) {
  const h1 = pickFirstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripTags(h1);
  const title = pickFirstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? stripTags(title) : fallback;
}

function extractDescription(html, fallback) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (m && m[1]) return m[1].trim();
  return fallback;
}

function escapeHtml(s) {
  return String(s)
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

function pageShell({ title, description, canonical, ogType = "website", ogTitle, ogDescription, ogUrl, bodyClass = "bg-slate-50 text-slate-900", schema = "" , mainContent }) {
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
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; }
  </style>
</head>
<body class="${bodyClass}">
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <a href="/" class="text-lg font-extrabold tracking-tight text-slate-900">당글</a>
      <nav class="flex flex-wrap items-center gap-2 text-sm">
        <a href="/diagnosis" class="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">무료 진단</a>
        <a href="/blog" class="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">블로그</a>
        <a href="/blog/interview" class="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">면접</a>
        <a href="/blog/cover-letter" class="rounded-full px-3 py-2 text-slate-700 hover:bg-slate-100">자소서</a>
        <a href="/#ebook" class="rounded-full bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800">가이드북</a>
      </nav>
    </div>
  </header>
  ${mainContent}
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600">
      <div class="flex flex-wrap gap-4">
        <a href="/" class="hover:text-slate-900">홈</a>
        <a href="/blog" class="hover:text-slate-900">블로그 허브</a>
        <a href="/blog/interview" class="hover:text-slate-900">면접</a>
        <a href="/blog/cover-letter" class="hover:text-slate-900">자소서</a>
        <a href="/blog/company-analysis" class="hover:text-slate-900">기업·직무 분석</a>
        <a href="/blog/job-search-strategy" class="hover:text-slate-900">지원 전략</a>
        <a href="/diagnosis" class="hover:text-slate-900">무료 진단</a>
      </div>
      <div class="mt-4">© 2025 당글. Contact: yuncontest@naver.com</div>
    </div>
  </footer>
</body>
</html>`;
}

function buildArticleCard(article, compact = false) {
  return `<article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div class="text-sm font-semibold text-slate-500">${escapeHtml(TOPICS[article.topic].title)} · ${escapeHtml(article.tag)}</div>
    <h3 class="mt-3 text-xl font-extrabold leading-snug text-slate-900">${escapeHtml(article.title)}</h3>
    <p class="mt-3 text-slate-700">${escapeHtml(article.description)}</p>
    ${compact ? "" : `<div class="mt-4 text-sm text-slate-500">${article.date} · ${article.readTime}</div>`}
    <div class="mt-5 flex items-center gap-3">
      <a href="${articleRoute(article)}" class="font-bold text-blue-700 hover:underline">글 읽기</a>
      <a href="/diagnosis" class="text-sm font-semibold text-slate-600 hover:text-slate-900">진단으로 현재 위치 보기</a>
    </div>
  </article>`;
}

function buildTopicCard(topicKey, posts) {
  const topic = TOPICS[topicKey];
  return `<article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">${topic.title}</div>
    <h3 class="mt-4 text-2xl font-extrabold text-slate-900">${topic.heroTitle}</h3>
    <p class="mt-3 text-slate-700">${topic.description}</p>
    <ul class="mt-4 space-y-2 text-sm text-slate-600">
      ${posts.slice(0, 3).map(post => `<li>• <a href="${articleRoute(post)}" class="hover:text-slate-900 hover:underline">${escapeHtml(post.title)}</a></li>`).join("")}
    </ul>
    <a href="${topicRoute(topicKey)}" class="mt-6 inline-flex rounded-full bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800">허브 보기</a>
  </article>`;
}

function buildBlogHub(posts) {
  const featured = posts.filter(post => post.featured).slice(0, 6);
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const schema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "당글 취업 블로그",
    "description": "면접, 자소서, 기업·직무 분석, 지원 전략을 한 번에 정리하는 취업 블로그 허브",
    "url": "${BASE_URL}/blog",
    "publisher": { "@type": "Organization", "name": "당글" }
  }
  </script>`;

  return pageShell({
    title: "취업 블로그 허브 | 면접, 자소서, 기업 분석, 지원 전략 | 당글",
    description: "면접, 자소서, 기업·직무 분석, 지원 전략을 4개 토픽 허브로 나눠 정리한 당글 블로그 허브입니다. 검색으로 들어와도 다음 글과 진단으로 자연스럽게 이어집니다.",
    canonical: `${BASE_URL}/blog`,
    ogTitle: "취업 블로그 허브 | 당글",
    ogDescription: "면접, 자소서, 기업·직무 분석, 지원 전략을 토픽 허브로 정리한 블로그",
    ogUrl: `${BASE_URL}/blog`,
    schema,
    mainContent: `<main>
      <section class="bg-slate-900 text-white">
        <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div class="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-slate-100">검색 유입을 진단과 다음 행동으로 연결하는 취업 허브</div>
            <h1 class="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">취준생이 헤매지 않도록,<br />주제별로 정리한 취업 블로그</h1>
            <p class="mt-5 max-w-3xl text-lg text-slate-200">검색으로 들어온 한 글에서 끝나지 않도록, 면접·자소서·기업 분석·지원 전략을 각각 허브로 묶었습니다. 글을 읽고 바로 무료 진단으로 현재 위치를 확인할 수 있게 설계했습니다.</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="/diagnosis" class="rounded-full bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100">무료 진단 받기</a>
              <a href="/#ebook" class="rounded-full border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10">가이드북 보기</a>
            </div>
          </div>
          <div class="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
            <div class="text-sm font-semibold text-slate-500">블로그 이용 가이드</div>
            <ol class="mt-4 space-y-3 text-sm text-slate-700">
              <li>1. 먼저 필요한 토픽 허브를 선택합니다.</li>
              <li>2. 대표 글부터 읽고 관련 글로 이동합니다.</li>
              <li>3. 무료 진단으로 현재 병목 구간을 확인합니다.</li>
              <li>4. 필요하면 가이드북으로 다음 단계를 이어갑니다.</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-4 py-16">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-900">4개 토픽 허브</h2>
            <p class="mt-2 text-slate-600">검색엔진과 사용자 모두에게 구조가 보이도록, 주요 주제를 허브 페이지로 나눴습니다.</p>
          </div>
          <a href="/diagnosis" class="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 sm:inline-flex">진단으로 바로 가기</a>
        </div>
        <div class="mt-8 grid gap-6 lg:grid-cols-2">
          ${Object.keys(TOPICS).map(key => buildTopicCard(key, posts.filter(post => post.topic === key))).join("")}
        </div>
      </section>

      <section class="bg-slate-100">
        <div class="mx-auto max-w-6xl px-4 py-16">
          <h2 class="text-3xl font-extrabold text-slate-900">대표 글 먼저 보기</h2>
          <p class="mt-2 text-slate-600">검색 유입이 많은 핵심 주제부터 읽으면 사이트 전체를 더 빠르게 활용할 수 있습니다.</p>
          <div class="mt-8 grid gap-6 lg:grid-cols-3">
            ${featured.map(post => buildArticleCard(post)).join("")}
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-4 py-16">
        <h2 class="text-3xl font-extrabold text-slate-900">최신 글</h2>
        <p class="mt-2 text-slate-600">최근 업데이트된 글부터 따라가며 검색 주제와 연결된 문서를 더 깊게 읽을 수 있습니다.</p>
        <div class="mt-8 grid gap-6 md:grid-cols-2">
          ${latest.map(post => buildArticleCard(post, true)).join("")}
        </div>
      </section>

      <section class="bg-blue-50">
        <div class="mx-auto max-w-6xl px-4 py-16">
          <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-blue-100">
            <div class="text-sm font-semibold text-blue-700">다음 단계</div>
            <h2 class="mt-3 text-3xl font-extrabold text-slate-900">글을 읽었다면, 이제 현재 취업 준비 상태를 확인할 차례입니다</h2>
            <p class="mt-3 max-w-3xl text-slate-700">당글의 목표는 글만 읽고 끝나는 사이트가 아니라, 검색 유입을 무료 진단과 다음 행동으로 이어주는 것입니다. 어떤 글부터 봐야 할지 모르겠다면 진단이 가장 빠른 출발점입니다.</p>
            <div class="mt-6 flex flex-wrap gap-3">
              <a href="/diagnosis" class="rounded-full bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800">무료 진단 받기</a>
              <a href="/#ebook" class="rounded-full bg-slate-100 px-5 py-3 font-bold text-slate-900 hover:bg-slate-200">가이드북 보기</a>
            </div>
          </div>
        </div>
      </section>
    </main>`
  });
}

function buildTopicHub(topicKey, posts) {
  const topic = TOPICS[topicKey];
  const featured = posts.slice(0, 3);
  const schema = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${topic.title} 허브 | 당글",
    "description": "${topic.description}",
    "url": "${BASE_URL}${topicRoute(topicKey)}"
  }
  </script>`;

  return pageShell({
    title: `${topic.title} 허브 | ${topic.heroTitle} | 당글`,
    description: topic.description,
    canonical: `${BASE_URL}${topicRoute(topicKey)}`,
    ogTitle: `${topic.title} 허브 | 당글`,
    ogDescription: topic.description,
    ogUrl: `${BASE_URL}${topicRoute(topicKey)}`,
    schema,
    mainContent: `<main>
      <section class="bg-gradient-to-br ${topic.color} text-white">
        <div class="mx-auto max-w-6xl px-4 py-16">
          <nav class="text-sm text-white/80">
            <a href="/" class="hover:text-white">홈</a>
            <span class="mx-2">/</span>
            <a href="/blog" class="hover:text-white">블로그</a>
            <span class="mx-2">/</span>
            <span class="text-white">${topic.title}</span>
          </nav>
          <div class="mt-5 max-w-4xl">
            <div class="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">${topic.title} Topic Hub</div>
            <h1 class="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">${topic.heroTitle}</h1>
            <p class="mt-5 text-lg text-white/90">${topic.description}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="/diagnosis" class="rounded-full bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100">무료 진단 받기</a>
              <a href="/blog" class="rounded-full border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10">블로그 허브 보기</a>
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.7fr_1.3fr]">
        <aside class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-2xl font-extrabold text-slate-900">초보자용 빠른 가이드</h2>
          <ul class="mt-4 space-y-3 text-slate-700">
            ${topic.beginnerGuide.map(item => `<li>• ${escapeHtml(item)}</li>`).join("")}
          </ul>
          <div class="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
            <div class="text-sm font-semibold text-slate-300">추천 다음 행동</div>
            <h3 class="mt-2 text-xl font-extrabold">${topic.ctaTitle}</h3>
            <p class="mt-3 text-sm text-slate-200">${topic.ctaText}</p>
            <a href="/diagnosis" class="mt-5 inline-flex rounded-full bg-white px-4 py-2 font-bold text-slate-900 hover:bg-slate-100">무료 진단으로 이동</a>
          </div>
        </aside>

        <div>
          <h2 class="text-3xl font-extrabold text-slate-900">이 주제에서 먼저 읽을 글</h2>
          <p class="mt-2 text-slate-600">토픽 허브에서 대표 글부터 읽고, 관련 글로 확장되도록 내부 링크 흐름을 구성했습니다.</p>
          <div class="mt-8 grid gap-6">
            ${featured.map(post => buildArticleCard(post)).join("")}
          </div>
          ${posts.length > 3 ? `<div class="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 class="text-2xl font-extrabold text-slate-900">더 읽어볼 글</h3>
            <div class="mt-5 grid gap-4 md:grid-cols-2">
              ${posts.slice(3).map(post => buildArticleCard(post, true)).join("")}
            </div>
          </div>` : ""}
        </div>
      </section>
    </main>`
  });
}

function buildSitemap(urlItems) {
  const body = urlItems.map(item => `  <url>\n    <loc>${item.loc}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function buildRedirects(posts) {
  const rewriteRules = [
    `/diagnosis                                /diagnosis.html                                     200`,
    `/blog                                     /blog_index.html                                    200`,
    `/blog/                                    /blog_index.html                                    200`,
    `/blog/interview                           /${topicFile("interview")}                           200`,
    `/blog/cover-letter                        /${topicFile("coverLetter")}                         200`,
    `/blog/company-analysis                    /${topicFile("companyAnalysis")}                     200`,
    `/blog/job-search-strategy                 /${topicFile("jobSearchStrategy")}                   200`
  ];

  const articleRewrites = posts.map(post => `${articleRoute(post).padEnd(41)} /${post.file.padEnd(50)} 200`);
  const legacyRedirects = [
    `/diagnosis.html                           /diagnosis                                          301`,
    `/blog_index.html                          /blog                                               301`,
    `/blog/index.html                          /blog                                               301`,
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
  const posts = ARTICLES.map(article => {
    const html = safeRead(article.file);
    return {
      ...article,
      title: extractTitle(html, article.title),
      description: extractDescription(html, article.description),
      date: getLastModDate(article.file)
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  writeFile("blog_index.html", buildBlogHub(posts));

  Object.keys(TOPICS).forEach(topicKey => {
    const topicPosts = posts.filter(post => post.topic === topicKey);
    writeFile(topicFile(topicKey), buildTopicHub(topicKey, topicPosts));
  });

  const pages = [
    { loc: `${BASE_URL}/`, lastmod: getLastModDate("index.html") },
    { loc: `${BASE_URL}/diagnosis`, lastmod: getLastModDate("diagnosis.html") },
    { loc: `${BASE_URL}/blog`, lastmod: new Date().toISOString().slice(0, 10) },
    ...Object.keys(TOPICS).map(topicKey => ({
      loc: `${BASE_URL}${topicRoute(topicKey)}`,
      lastmod: new Date().toISOString().slice(0, 10)
    })),
    ...posts.map(post => ({
      loc: `${BASE_URL}${articleRoute(post)}`,
      lastmod: post.date
    }))
  ];

  writeFile("sitemap.xml", buildSitemap(pages));
  writeFile("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
  writeFile("_redirects", buildRedirects(posts));
}

main();
