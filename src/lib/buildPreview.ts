// src/lib/buildPreview.ts

export interface PreviewData {
  nom: string;
  slogan: string;
  hero_titre: string;
  hero_sous_titre: string;
  hero_cta: string;
  couleur_principale: string;
  couleur_secondaire: string;
  couleur_accent: string;
  couleur_texte_hero: string;
  service1_titre: string;
  service1_desc: string;
  service2_titre: string;
  service2_desc: string;
  service3_titre: string;
  service3_desc: string;
  icone1: string;
  icone2: string;
  icone3: string;
  about_titre: string;
  about_texte: string;
  temoignage_nom: string;
  temoignage_texte: string;
  temoignage_role: string;
  section_speciale_titre: string;
  section_speciale_items: string[];
  budget_min: number;
  budget_max: number;
  type_site: string;
  layout: "split" | "magazine" | "ecommerce" | "local";
  tags: string[];
}

// ─── Utilitaires couleurs ─────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map(x => x + x).join("") : c;
  return [
    parseInt(full.slice(0, 2), 16) || 0,
    parseInt(full.slice(2, 4), 16) || 0,
    parseInt(full.slice(4, 6), 16) || 0,
  ];
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const nr = Math.round(r + (255 - r) * amount);
  const ng = Math.round(g + (255 - g) * amount);
  const nb = Math.round(b + (255 - b) * amount);
  return `rgb(${nr},${ng},${nb})`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r*(1-amount))},${Math.round(g*(1-amount))},${Math.round(b*(1-amount))})`;
}

function alpha(hex: string, opacity: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${opacity})`;
}

// ─── Utilitaires HTML ─────────────────────────────────────────────────────────

function esc(s: string = ""): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function wm(): string {
  return `<div style="background:#1a1a1a;text-align:center;padding:7px;font-size:10px;font-weight:700;letter-spacing:.14em;color:rgba(255,255,255,.5);font-family:system-ui;">APERÇU · WEBGRAPHICDESIGN.FR · MAQUETTE NON CONTRACTUELLE</div>`;
}

// ─── Fonts système selon style ────────────────────────────────────────────────

function headingFont(style: string): string {
  if (style === "elegant") return "Georgia,'Times New Roman',serif";
  if (style === "tech")    return "'Courier New',Courier,monospace";
  return "system-ui,-apple-system,'Segoe UI',sans-serif";
}

function bodyFont(style: string): string {
  if (style === "elegant") return "system-ui,-apple-system,'Segoe UI',sans-serif";
  return "system-ui,-apple-system,'Segoe UI',sans-serif";
}

function borderRadius(style: string): string {
  if (style === "moderne")   return "6px";
  if (style === "elegant")   return "2px";
  if (style === "audacieux") return "16px";
  if (style === "nature")    return "14px";
  if (style === "tech")      return "0px";
  return "10px";
}

// ─── head() commun ────────────────────────────────────────────────────────────

function head(d: PreviewData, style: string, css: string): string {
  const r   = borderRadius(style);
  const p   = d.couleur_principale   || "#4f46e5";
  const s   = d.couleur_secondaire   || "#f0f0ff";
  const a   = d.couleur_accent       || "#ec4899";
  const ht  = d.couleur_texte_hero   || "#ffffff";

  // Couleurs pré-calculées — remplacent color-mix()
  const pLight  = lighten(p, 0.88);  // fond très clair
  const pMid    = lighten(p, 0.70);  // fond moyen
  const pDark   = darken(p, 0.18);   // hover
  const pA08    = alpha(p, 0.08);
  const pA15    = alpha(p, 0.15);
  const pA30    = alpha(p, 0.30);
  const pGrad1  = darken(p, 0.25);   // pour gradients sombres
  const aLight  = lighten(a, 0.75);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.nom)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --p:${p};--s:${s};--a:${a};--ht:${ht};--r:${r};
  --hf:${headingFont(style)};--bf:${bodyFont(style)};
  --pLight:${pLight};--pMid:${pMid};--pDark:${pDark};
  --pA08:${pA08};--pA15:${pA15};--pA30:${pA30};
  --pGrad1:${pGrad1};--aLight:${aLight};
}
body{font-family:var(--bf);color:#1a1a1a;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
h1,h2,h3,h4{font-family:var(--hf);line-height:1.15;}
a{text-decoration:none;color:inherit;}
${css}
</style>`;
}

// ─── Entrée publique ──────────────────────────────────────────────────────────

export function buildPreviewHTML(d: PreviewData, style: string = "auto"): string {
  const layout = d.layout ?? "split";
  switch (layout) {
    case "magazine":  return layoutMagazine(d, style);
    case "ecommerce": return layoutEcommerce(d, style);
    case "local":     return layoutLocal(d, style);
    default:          return layoutSplit(d, style);
  }
}

// ─── LAYOUT 1 : SPLIT ────────────────────────────────────────────────────────

function layoutSplit(d: PreviewData, style: string): string {
  const items = (d.section_speciale_items ?? []).slice(0, 4)
    .map(i => `<li><span style="color:var(--p);font-weight:700;margin-right:8px;">✓</span>${esc(i)}</li>`).join("");

  return head(d, style, `
nav{background:#fff;border-bottom:1px solid #f0f0ee;padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:68px;position:sticky;top:0;z-index:100;box-shadow:0 1px 12px rgba(0,0,0,.05);}
.logo{font-size:18px;font-weight:800;font-family:var(--hf);color:#1a1a1a;letter-spacing:-.02em;}
.logo em{font-style:normal;color:var(--p);}
.nav-links{display:flex;gap:28px;font-size:13px;color:#555;font-weight:500;}
.nav-cta{background:var(--p);color:#fff;padding:9px 22px;border-radius:var(--r);font-size:13px;font-weight:700;border:none;cursor:pointer;}

.hero{background:linear-gradient(135deg,#fafbff 0%,var(--s) 100%);padding:80px 5% 90px;display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--pA08);color:var(--p);font-size:11.5px;font-weight:700;padding:6px 14px;border-radius:100px;margin-bottom:22px;border:1px solid var(--pA15);}
.hero-dot{width:7px;height:7px;border-radius:50%;background:var(--p);}
.hero h1{font-size:clamp(1.9rem,3.2vw,2.9rem);font-weight:800;color:#0f0f0f;line-height:1.1;letter-spacing:-.03em;margin-bottom:16px;}
.hero h1 em{font-style:normal;color:var(--p);}
.hero-sub{font-size:15px;color:#5a5a6e;line-height:1.75;max-width:440px;margin-bottom:30px;}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px;}
.btn-main{background:var(--p);color:#fff;padding:13px 28px;border-radius:var(--r);font-size:14px;font-weight:700;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 16px var(--pA30);}
.btn-out{background:#fff;color:#1a1a1a;padding:13px 28px;border-radius:var(--r);font-size:14px;font-weight:600;border:1.5px solid #e0e0de;cursor:pointer;}
.hero-trust{display:flex;gap:18px;flex-wrap:wrap;}
.trust-i{display:flex;align-items:center;gap:6px;font-size:12px;color:#777;font-weight:500;}
.trust-i span{color:var(--p);}

.hero-card{background:#fff;border-radius:16px;padding:24px;box-shadow:0 20px 56px rgba(0,0,0,.1),0 4px 16px rgba(0,0,0,.05);border:1px solid #f0f0ee;}
.card-bar{display:flex;align-items:center;gap:6px;margin-bottom:16px;}
.cdot{width:10px;height:10px;border-radius:50%;}
.cdot.r{background:#ff5f56;}.cdot.y{background:#ffbd2e;}.cdot.g{background:#27c93f;}
.card-url{flex:1;background:#f5f5f3;border-radius:6px;padding:5px 12px;font-size:11px;color:#aaa;margin-left:10px;font-family:monospace;}
.card-nav{height:34px;background:var(--p);border-radius:var(--r);opacity:.9;margin-bottom:14px;}
.card-hero{display:grid;grid-template-columns:1fr 88px;gap:12px;height:88px;margin-bottom:12px;}
.card-lines{display:flex;flex-direction:column;gap:8px;justify-content:center;}
.cline{height:8px;border-radius:4px;background:#f0f0ee;}
.cline.w90{width:90%;}.cline.w70{width:70%;}.cline.w45{width:45%;}
.cline.btn{height:24px;width:80px;background:var(--p);opacity:.8;border-radius:4px;margin-top:4px;}
.card-img{background:linear-gradient(135deg,var(--pMid),var(--aLight));border-radius:var(--r);}
.card-blocks{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.cblock{height:50px;background:#f7f7f5;border-radius:var(--r);border:1px solid #eeeeeb;}

.services{padding:80px 5%;background:#fff;}
.eyebrow{font-size:11.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:8px;}
.sec-title{font-size:clamp(1.5rem,2.5vw,2.1rem);font-weight:800;color:#0f0f0f;margin-bottom:10px;letter-spacing:-.02em;font-family:var(--hf);}
.sec-sub{font-size:14.5px;color:#6b6b7a;line-height:1.7;max-width:500px;margin-bottom:44px;}
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.scard{background:#fafaf8;border:1px solid #ebebea;border-radius:16px;padding:28px;position:relative;overflow:hidden;transition:all .25s;}
.scard-top{height:3px;position:absolute;top:0;left:0;right:0;background:var(--p);opacity:0;}
.scard:hover .scard-top{opacity:1;}
.scard-icon{font-size:32px;margin-bottom:16px;display:block;}
.scard-title{font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;font-family:var(--hf);}
.scard-desc{font-size:13px;color:#777;line-height:1.65;}

.stats{background:var(--p);padding:48px 5%;display:grid;grid-template-columns:repeat(4,1fr);}
.stat{text-align:center;padding:16px;border-right:1px solid rgba(255,255,255,.15);}
.stat:last-child{border:none;}
.stat-n{font-size:2.4rem;font-weight:800;color:#fff;font-family:var(--hf);line-height:1;display:block;margin-bottom:6px;}
.stat-l{font-size:12px;color:rgba(255,255,255,.7);font-weight:500;}

.about{padding:88px 5%;background:#f9f9f7;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;}
.about-img{aspect-ratio:4/3;background:linear-gradient(135deg,var(--pLight),var(--pMid));border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:64px;border:1px solid #ebebea;position:relative;}
.about-badge-fl{position:absolute;bottom:-18px;right:-18px;background:#fff;border:1px solid #ebebea;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;box-shadow:0 8px 28px rgba(0,0,0,.1);}
.about-badge-fl .ico{width:38px;height:38px;background:var(--pA08);border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.about-badge-fl strong{display:block;font-size:12.5px;font-weight:700;color:#1a1a1a;}
.about-badge-fl span{font-size:11px;color:#999;}
.about-content .sec-title{margin-bottom:14px;}
.about-txt{font-size:14.5px;color:#666;line-height:1.8;margin-bottom:20px;}
.feat-list{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
.feat-list li{display:flex;align-items:center;font-size:14px;font-weight:500;color:#444;}

.cta-band{background:linear-gradient(135deg,var(--p),var(--pGrad1));padding:72px 5%;text-align:center;}
.cta-band h2{font-size:clamp(1.7rem,3vw,2.3rem);font-weight:800;color:#fff;margin-bottom:12px;font-family:var(--hf);}
.cta-band p{font-size:15px;color:rgba(255,255,255,.82);margin-bottom:30px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.7;}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.btn-white{background:#fff;color:var(--p);padding:14px 32px;border-radius:var(--r);font-size:14.5px;font-weight:700;border:none;cursor:pointer;}
.btn-ghost{background:transparent;color:#fff;padding:14px 32px;border-radius:var(--r);font-size:14.5px;font-weight:600;border:2px solid rgba(255,255,255,.4);cursor:pointer;}

footer{background:#111;padding:24px 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.flogo{font-size:15px;font-weight:800;color:#fff;font-family:var(--hf);}
.flinks{display:flex;gap:20px;font-size:12px;color:#555;}
.fcopy{font-size:11px;color:#444;}
@media(max-width:700px){.hero,.about{grid-template-columns:1fr;}.nav-links{display:none;}.svc-grid{grid-template-columns:1fr;}.stats{grid-template-columns:repeat(2,1fr);}}
`) + `
<body>
${wm()}
<nav>
  <div class="logo">${esc(d.nom.split(" ").slice(0,2).join(" "))}<em>${esc(d.nom.split(" ").slice(2).join(" "))}</em></div>
  <div class="nav-links"><span>Accueil</span><span>Services</span><span>À propos</span><span>Contact</span></div>
  <button class="nav-cta">${esc(d.hero_cta)}</button>
</nav>
<div class="hero">
  <div>
    <div class="hero-badge"><span class="hero-dot"></span>${esc(d.slogan)}</div>
    <h1>${esc(d.hero_titre)}</h1>
    <p class="hero-sub">${esc(d.hero_sous_titre)}</p>
    <div class="hero-btns">
      <button class="btn-main">${esc(d.hero_cta)} →</button>
      <button class="btn-out">En savoir plus</button>
    </div>
    <div class="hero-trust">
      <div class="trust-i"><span>★★★★★</span>5.0 Google</div>
      <div class="trust-i"><span>✓</span>Devis gratuit</div>
      <div class="trust-i"><span>⚡</span>Réponse 24h</div>
    </div>
  </div>
  <div class="hero-card">
    <div class="card-bar"><span class="cdot r"></span><span class="cdot y"></span><span class="cdot g"></span><div class="card-url">${esc(d.nom.toLowerCase().replace(/\s+/g,"-"))}.fr</div></div>
    <div class="card-nav"></div>
    <div class="card-hero">
      <div class="card-lines"><div class="cline w90"></div><div class="cline w70"></div><div class="cline w45"></div><div class="cline btn"></div></div>
      <div class="card-img"></div>
    </div>
    <div class="card-blocks"><div class="cblock"></div><div class="cblock"></div><div class="cblock"></div></div>
  </div>
</div>
<div class="services">
  <div class="eyebrow">Nos prestations</div>
  <div class="sec-title">${esc(d.section_speciale_titre)}</div>
  <p class="sec-sub">Des solutions adaptées à votre activité et vos objectifs.</p>
  <div class="svc-grid">
    <div class="scard"><div class="scard-top"></div><span class="scard-icon">${d.icone1}</span><div class="scard-title">${esc(d.service1_titre)}</div><p class="scard-desc">${esc(d.service1_desc)}</p></div>
    <div class="scard"><div class="scard-top"></div><span class="scard-icon">${d.icone2}</span><div class="scard-title">${esc(d.service2_titre)}</div><p class="scard-desc">${esc(d.service2_desc)}</p></div>
    <div class="scard"><div class="scard-top"></div><span class="scard-icon">${d.icone3}</span><div class="scard-title">${esc(d.service3_titre)}</div><p class="scard-desc">${esc(d.service3_desc)}</p></div>
  </div>
</div>
<div class="stats">
  <div class="stat"><span class="stat-n">10+</span><span class="stat-l">Années d'expérience</span></div>
  <div class="stat"><span class="stat-n">98%</span><span class="stat-l">Clients satisfaits</span></div>
  <div class="stat"><span class="stat-n">250+</span><span class="stat-l">Projets livrés</span></div>
  <div class="stat"><span class="stat-n">24/7</span><span class="stat-l">Support disponible</span></div>
</div>
<div class="about">
  <div>
    <div class="about-img">${d.icone1}<div class="about-badge-fl"><div class="ico">⭐</div><div><strong>Certifié & reconnu</strong><span>Avis vérifiés Google</span></div></div></div>
  </div>
  <div class="about-content">
    <div class="eyebrow">Notre histoire</div>
    <div class="sec-title">${esc(d.about_titre)}</div>
    <p class="about-txt">${esc(d.about_texte)}</p>
    <ul class="feat-list">${items}</ul>
    <button class="btn-main">${esc(d.hero_cta)}</button>
  </div>
</div>
<div class="cta-band">
  <h2>Prêt à lancer votre projet ?</h2>
  <p>Discutons de vos besoins. Devis gratuit et sans engagement sous 24h.</p>
  <div class="cta-btns"><button class="btn-white">${esc(d.hero_cta)}</button><button class="btn-ghost">Voir nos réalisations</button></div>
</div>
<footer>
  <div class="flogo">${esc(d.nom)}</div>
  <div class="flinks"><span>Mentions légales</span><span>Confidentialité</span><span>CGV</span></div>
  <div class="fcopy">© 2025 ${esc(d.nom)}</div>
</footer>
</body></html>`;
}

// ─── LAYOUT 2 : MAGAZINE ─────────────────────────────────────────────────────

function layoutMagazine(d: PreviewData, style: string): string {
  const tags = (d.tags ?? []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  return head(d, style, `
nav{background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.07);padding:0 5%;display:flex;align-items:center;justify-content:space-between;height:70px;position:sticky;top:0;z-index:100;}
.logo{font-size:20px;font-weight:800;font-family:var(--hf);letter-spacing:-.03em;color:#0f0f0f;}
.logo em{font-style:normal;color:var(--p);}
.nav-links{display:flex;gap:32px;font-size:13px;color:#666;font-weight:500;}
.nav-cta{background:var(--p);color:#fff;padding:10px 22px;border-radius:var(--r);font-size:13px;font-weight:700;border:none;cursor:pointer;}

.hero-full{position:relative;height:580px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--p);}
.hero-pattern{position:absolute;inset:0;opacity:.06;background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);background-size:18px 18px;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.45) 0%,transparent 60%);}
.hero-inner{position:relative;z-index:2;text-align:center;padding:0 5%;max-width:760px;}
.hero-label{display:inline-block;border:1px solid rgba(255,255,255,.5);color:rgba(255,255,255,.9);font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:7px 20px;border-radius:100px;margin-bottom:28px;font-weight:600;}
.hero-full h1{font-size:clamp(2.6rem,6vw,4.8rem);font-weight:800;color:#fff;line-height:1.05;letter-spacing:-.04em;margin-bottom:18px;}
.hero-full p{font-size:16.5px;color:rgba(255,255,255,.82);line-height:1.7;margin-bottom:34px;max-width:520px;margin-left:auto;margin-right:auto;}
.hero-ctas{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.btn-hero{background:#fff;color:var(--p);padding:14px 34px;border-radius:var(--r);font-size:15px;font-weight:800;border:none;cursor:pointer;}
.btn-hero-g{background:transparent;color:#fff;padding:14px 34px;border-radius:var(--r);font-size:15px;font-weight:600;border:2px solid rgba(255,255,255,.45);cursor:pointer;}

.feat{padding:80px 5%;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;background:#fff;}
.feat-img{aspect-ratio:3/2;background:linear-gradient(135deg,var(--pMid),var(--aLight));border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:72px;}
.feat-eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:10px;}
.feat h2{font-size:clamp(1.7rem,2.5vw,2.3rem);font-weight:800;color:#0f0f0f;margin-bottom:16px;letter-spacing:-.02em;font-family:var(--hf);}
.feat p{font-size:15px;color:#666;line-height:1.8;margin-bottom:24px;}
.tags-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;}
.tag{font-size:12px;padding:5px 14px;background:var(--pA08);color:var(--p);border-radius:100px;font-weight:600;border:1px solid var(--pA15);}
.btn-feat{background:var(--p);color:#fff;padding:13px 28px;border-radius:var(--r);font-size:14px;font-weight:700;border:none;cursor:pointer;}

.gallery{padding:80px 5%;background:#f7f7f5;}
.gallery-eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:8px;}
.gallery-title{font-size:clamp(1.5rem,2.5vw,2rem);font-weight:800;color:#0f0f0f;letter-spacing:-.02em;font-family:var(--hf);margin-bottom:36px;}
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.gi{border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:28px;color:rgba(255,255,255,.5);}
.gi:nth-child(1){background:var(--p);grid-column:span 2;aspect-ratio:16/7;}
.gi:nth-child(2){background:var(--pGrad1);aspect-ratio:4/3;}
.gi:nth-child(3){background:var(--pMid);aspect-ratio:4/3;}
.gi:nth-child(4){background:var(--pLight);aspect-ratio:4/3;color:var(--p);}
.gi:nth-child(5){background:var(--a);grid-column:span 2;aspect-ratio:16/7;}

.quote-sec{padding:72px 5%;background:var(--p);text-align:center;}
.quote-stars{color:#fbbf24;font-size:18px;letter-spacing:3px;margin-bottom:14px;}
.quote-mark{font-size:60px;color:rgba(255,255,255,.2);font-family:Georgia,serif;line-height:.8;margin-bottom:14px;}
.quote-txt{font-size:clamp(1.1rem,2vw,1.5rem);color:#fff;font-weight:600;font-family:var(--hf);line-height:1.5;max-width:640px;margin:0 auto 22px;}
.quote-author{font-size:13px;color:rgba(255,255,255,.65);font-weight:500;}

footer{background:#1a1a1a;padding:28px 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.flogo{font-size:17px;font-weight:800;color:#fff;font-family:var(--hf);}
.flinks{display:flex;gap:24px;font-size:12px;color:#555;}
.fcopy{font-size:11px;color:#444;}
@media(max-width:700px){.feat,.gallery-grid{grid-template-columns:1fr;}.nav-links{display:none;}.gi:nth-child(1),.gi:nth-child(5){grid-column:span 1;aspect-ratio:4/3;}}
`) + `
<body>
${wm()}
<nav>
  <div class="logo">${esc(d.nom.split(" ").slice(0,2).join(" "))}<em>${esc(d.nom.split(" ").slice(2).join(" "))}</em></div>
  <div class="nav-links"><span>Accueil</span><span>${esc(d.service1_titre)}</span><span>${esc(d.service2_titre)}</span><span>Contact</span></div>
  <button class="nav-cta">${esc(d.hero_cta)}</button>
</nav>
<div class="hero-full">
  <div class="hero-pattern"></div><div class="hero-overlay"></div>
  <div class="hero-inner">
    <div class="hero-label">${esc(d.slogan)}</div>
    <h1>${esc(d.hero_titre)}</h1>
    <p>${esc(d.hero_sous_titre)}</p>
    <div class="hero-ctas"><button class="btn-hero">${esc(d.hero_cta)}</button><button class="btn-hero-g">Découvrir →</button></div>
  </div>
</div>
<div class="feat">
  <div class="feat-img">${d.icone1}</div>
  <div>
    <div class="feat-eyebrow">Notre spécialité</div>
    <h2>${esc(d.about_titre)}</h2>
    <p>${esc(d.about_texte)}</p>
    <div class="tags-row">${tags}</div>
    <button class="btn-feat">${esc(d.hero_cta)}</button>
  </div>
</div>
<div class="gallery">
  <div class="gallery-eyebrow">Nos réalisations</div>
  <div class="gallery-title">${esc(d.section_speciale_titre)}</div>
  <div class="gallery-grid">
    <div class="gi">${d.icone1}</div><div class="gi">${d.icone2}</div>
    <div class="gi">${d.icone3}</div><div class="gi">${d.icone1}</div>
    <div class="gi">${d.icone2}</div>
  </div>
</div>
<div class="quote-sec">
  <div class="quote-stars">★★★★★</div>
  <div class="quote-mark">"</div>
  <div class="quote-txt">${esc(d.temoignage_texte)}</div>
  <div class="quote-author">${esc(d.temoignage_nom)} · ${esc(d.temoignage_role)}</div>
</div>
<footer>
  <div class="flogo">${esc(d.nom)}</div>
  <div class="flinks"><span>Mentions légales</span><span>Confidentialité</span></div>
  <div class="fcopy">© 2025 ${esc(d.nom)}</div>
</footer>
</body></html>`;
}

// ─── LAYOUT 3 : ECOMMERCE ────────────────────────────────────────────────────

function layoutEcommerce(d: PreviewData, style: string): string {
  return head(d, style, `
nav{background:#fff;border-bottom:1px solid #f0f0ee;padding:0 4%;display:flex;align-items:center;justify-content:space-between;height:64px;position:sticky;top:0;z-index:100;box-shadow:0 1px 8px rgba(0,0,0,.05);}
.logo{font-size:18px;font-weight:800;font-family:var(--hf);letter-spacing:-.02em;}
.logo em{font-style:normal;color:var(--p);}
.nav-cats{display:flex;gap:22px;font-size:13px;color:#555;font-weight:500;}
.nav-r{display:flex;align-items:center;gap:12px;}
.nav-search{background:#f5f5f3;border:none;border-radius:var(--r);padding:8px 14px;font-size:13px;color:#888;width:140px;font-family:var(--bf);}
.nav-cta{background:var(--p);color:#fff;padding:9px 20px;border-radius:var(--r);font-size:13px;font-weight:700;border:none;cursor:pointer;}

.hero-shop{background:linear-gradient(120deg,var(--pLight) 0%,var(--s) 100%);padding:64px 4% 72px;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center;}
.shop-badge{display:inline-flex;align-items:center;gap:8px;background:var(--p);color:#fff;font-size:11px;font-weight:700;padding:6px 14px;border-radius:100px;margin-bottom:20px;}
.hero-shop h1{font-size:clamp(1.8rem,3vw,2.7rem);font-weight:800;color:#0f0f0f;letter-spacing:-.03em;line-height:1.1;margin-bottom:14px;}
.hero-shop p{font-size:14.5px;color:#666;line-height:1.75;margin-bottom:26px;max-width:400px;}
.shop-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;}
.btn-shop{background:var(--p);color:#fff;padding:13px 28px;border-radius:var(--r);font-size:14px;font-weight:700;border:none;cursor:pointer;}
.btn-shop-o{background:#fff;color:#1a1a1a;padding:13px 28px;border-radius:var(--r);font-size:14px;font-weight:600;border:1.5px solid #e0e0de;cursor:pointer;}
.trust-row{display:flex;gap:16px;flex-wrap:wrap;}
.trust-p{display:flex;align-items:center;gap:6px;font-size:12px;color:#666;font-weight:500;}
.product-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.pcard{background:#fff;border-radius:16px;border:1px solid #ebebea;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.06);}
.pcard-img{height:110px;display:flex;align-items:center;justify-content:center;font-size:34px;background:linear-gradient(135deg,var(--pLight),var(--aLight));}
.pcard-info{padding:12px 14px;}
.pcard-name{font-size:12.5px;font-weight:700;color:#1a1a1a;margin-bottom:4px;}
.pcard-price{font-size:13.5px;font-weight:800;color:var(--p);}

.benefits{background:var(--p);padding:52px 4%;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
.benefit{text-align:center;color:#fff;}
.benefit-icon{font-size:30px;margin-bottom:10px;display:block;}
.benefit-title{font-size:14px;font-weight:700;margin-bottom:6px;}
.benefit-desc{font-size:12.5px;color:rgba(255,255,255,.75);line-height:1.6;}

.services-shop{padding:72px 4%;background:#fff;}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:8px;}
.sec-title{font-size:clamp(1.5rem,2.5vw,2rem);font-weight:800;color:#0f0f0f;margin-bottom:8px;letter-spacing:-.02em;font-family:var(--hf);}
.svc-row{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px;}
.svc-i{background:#fafaf8;border:1px solid #efefed;border-radius:16px;padding:28px 24px;}
.svc-icon{font-size:34px;margin-bottom:12px;display:block;}
.svc-title{font-size:14.5px;font-weight:700;color:#1a1a1a;margin-bottom:8px;font-family:var(--hf);}
.svc-desc{font-size:13px;color:#777;line-height:1.65;}

.reviews{padding:64px 4%;background:#f9f9f7;}
.rev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px;}
.rev-card{background:#fff;border:1px solid #ebebea;border-radius:16px;padding:22px;}
.rev-stars{color:#fbbf24;font-size:14px;letter-spacing:2px;margin-bottom:10px;}
.rev-txt{font-size:13px;color:#444;line-height:1.65;font-style:italic;margin-bottom:12px;}
.rev-name{font-size:12px;font-weight:700;color:#1a1a1a;}
.rev-role{font-size:11px;color:#aaa;margin-top:2px;}

.newsletter{padding:52px 4%;background:linear-gradient(135deg,var(--p),var(--pGrad1));text-align:center;}
.newsletter h3{font-size:clamp(1.3rem,2vw,1.7rem);font-weight:800;color:#fff;margin-bottom:8px;font-family:var(--hf);}
.newsletter p{font-size:14px;color:rgba(255,255,255,.8);margin-bottom:22px;}
.nl-form{display:flex;gap:10px;max-width:420px;margin:0 auto;}
.nl-input{flex:1;padding:12px 16px;border-radius:var(--r);border:none;font-size:14px;font-family:var(--bf);}
.nl-btn{background:#fff;color:var(--p);padding:12px 22px;border-radius:var(--r);font-size:14px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;}

footer{background:#111;padding:24px 4%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.flogo{font-size:15px;font-weight:800;color:#fff;font-family:var(--hf);}
.flinks{display:flex;gap:20px;font-size:12px;color:#555;}
.fcopy{font-size:11px;color:#444;}
@media(max-width:700px){.hero-shop,.svc-row,.benefits,.rev-grid{grid-template-columns:1fr;}.nav-cats{display:none;}.nl-form{flex-direction:column;}}
`) + `
<body>
${wm()}
<nav>
  <div class="logo">${esc(d.nom.split(" ").slice(0,2).join(" "))}<em>${esc(d.nom.split(" ").slice(2).join(" "))}</em></div>
  <div class="nav-cats"><span>${esc(d.service1_titre)}</span><span>${esc(d.service2_titre)}</span><span>${esc(d.service3_titre)}</span></div>
  <div class="nav-r"><input class="nav-search" placeholder="Rechercher..." /><button class="nav-cta">${esc(d.hero_cta)}</button></div>
</nav>
<div class="hero-shop">
  <div>
    <div class="shop-badge">🌟 ${esc(d.slogan)}</div>
    <h1>${esc(d.hero_titre)}</h1>
    <p>${esc(d.hero_sous_titre)}</p>
    <div class="shop-btns"><button class="btn-shop">${esc(d.hero_cta)}</button><button class="btn-shop-o">Voir la galerie</button></div>
    <div class="trust-row">
      <div class="trust-p">🚚 Livraison offerte</div>
      <div class="trust-p">↩ Retours 30j</div>
      <div class="trust-p">🔒 Paiement sécurisé</div>
    </div>
  </div>
  <div class="product-grid">
    <div class="pcard"><div class="pcard-img">${d.icone1}</div><div class="pcard-info"><div class="pcard-name">${esc(d.service1_titre)}</div><div class="pcard-price">À partir de 49€</div></div></div>
    <div class="pcard"><div class="pcard-img">${d.icone2}</div><div class="pcard-info"><div class="pcard-name">${esc(d.service2_titre)}</div><div class="pcard-price">À partir de 69€</div></div></div>
    <div class="pcard"><div class="pcard-img">${d.icone3}</div><div class="pcard-info"><div class="pcard-name">${esc(d.service3_titre)}</div><div class="pcard-price">À partir de 39€</div></div></div>
    <div class="pcard"><div class="pcard-img">✨</div><div class="pcard-info"><div class="pcard-name">Pack complet</div><div class="pcard-price">Offre spéciale</div></div></div>
  </div>
</div>
<div class="benefits">
  <div class="benefit"><span class="benefit-icon">⚡</span><div class="benefit-title">Rapide & efficace</div><div class="benefit-desc">${esc(d.service1_desc)}</div></div>
  <div class="benefit"><span class="benefit-icon">🏆</span><div class="benefit-title">Qualité garantie</div><div class="benefit-desc">${esc(d.service2_desc)}</div></div>
  <div class="benefit"><span class="benefit-icon">💬</span><div class="benefit-title">Support dédié</div><div class="benefit-desc">${esc(d.service3_desc)}</div></div>
</div>
<div class="services-shop">
  <div class="eyebrow">Nos prestations</div>
  <div class="sec-title">${esc(d.section_speciale_titre)}</div>
  <div class="svc-row">
    <div class="svc-i"><span class="svc-icon">${d.icone1}</span><div class="svc-title">${esc(d.service1_titre)}</div><p class="svc-desc">${esc(d.service1_desc)}</p></div>
    <div class="svc-i"><span class="svc-icon">${d.icone2}</span><div class="svc-title">${esc(d.service2_titre)}</div><p class="svc-desc">${esc(d.service2_desc)}</p></div>
    <div class="svc-i"><span class="svc-icon">${d.icone3}</span><div class="svc-title">${esc(d.service3_titre)}</div><p class="svc-desc">${esc(d.service3_desc)}</p></div>
  </div>
</div>
<div class="reviews">
  <div class="eyebrow">Témoignages</div>
  <div class="sec-title">Ce que disent nos clients</div>
  <div class="rev-grid">
    <div class="rev-card"><div class="rev-stars">★★★★★</div><div class="rev-txt">"${esc(d.temoignage_texte)}"</div><div class="rev-name">${esc(d.temoignage_nom)}</div><div class="rev-role">${esc(d.temoignage_role)}</div></div>
    <div class="rev-card"><div class="rev-stars">★★★★★</div><div class="rev-txt">"Excellent service, je recommande vivement !"</div><div class="rev-name">Marie L.</div><div class="rev-role">Cliente fidèle</div></div>
    <div class="rev-card"><div class="rev-stars">★★★★★</div><div class="rev-txt">"Qualité irréprochable, équipe très à l'écoute."</div><div class="rev-name">Thomas B.</div><div class="rev-role">Professionnel</div></div>
  </div>
</div>
<div class="newsletter">
  <h3>Restez informés</h3>
  <p>Recevez nos offres exclusives en avant-première.</p>
  <div class="nl-form"><input class="nl-input" type="email" placeholder="Votre adresse email..." /><button class="nl-btn">S'inscrire →</button></div>
</div>
<footer>
  <div class="flogo">${esc(d.nom)}</div>
  <div class="flinks"><span>Mentions légales</span><span>CGV</span><span>Confidentialité</span></div>
  <div class="fcopy">© 2025 ${esc(d.nom)}</div>
</footer>
</body></html>`;
}

// ─── LAYOUT 4 : LOCAL ────────────────────────────────────────────────────────

function layoutLocal(d: PreviewData, style: string): string {
  const items = (d.section_speciale_items ?? []).slice(0, 4)
    .map(i => `<div class="why-item"><div class="why-check">✓</div><div><strong>${esc(i.split(":")[0]??i)}</strong>${i.includes(":")?`<p>${esc(i.split(":").slice(1).join(":").trim())}</p>`:""}</div></div>`).join("");

  return head(d, style, `
.topbar{background:var(--p);padding:8px 4%;display:flex;align-items:center;justify-content:space-between;}
.topbar-phone{color:#fff;font-weight:700;font-size:13px;}
.topbar-badges{display:flex;gap:16px;font-size:11.5px;color:rgba(255,255,255,.85);}

nav{background:#fff;border-bottom:1px solid #f0f0ee;padding:0 4%;display:flex;align-items:center;justify-content:space-between;height:66px;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.06);}
.logo{font-family:var(--hf);}
.logo-main{font-size:17px;font-weight:800;color:#1a1a1a;letter-spacing:-.02em;}
.logo-sub{font-size:11px;color:#888;font-weight:500;margin-top:1px;}
.nav-links{display:flex;gap:22px;font-size:13px;color:#555;font-weight:500;}
.nav-btns{display:flex;gap:8px;}
.nav-cta-g{background:#fff;color:var(--p);padding:9px 20px;border-radius:var(--r);font-size:13px;font-weight:600;border:2px solid var(--pA30);cursor:pointer;}
.nav-cta{background:var(--p);color:#fff;padding:9px 20px;border-radius:var(--r);font-size:13px;font-weight:700;border:none;cursor:pointer;}

.hero-local{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;background:linear-gradient(135deg,#fafbff,var(--pLight));}
.hero-content{padding:72px 4% 72px 5%;}
.urgency{display:inline-flex;align-items:center;gap:8px;background:#fff3cd;color:#856404;font-size:11.5px;font-weight:700;padding:6px 14px;border-radius:100px;margin-bottom:20px;border:1px solid #ffc107;}
.hero-local h1{font-size:clamp(1.8rem,3vw,2.8rem);font-weight:800;color:#0f0f0f;letter-spacing:-.03em;line-height:1.1;margin-bottom:14px;}
.hero-local p{font-size:14.5px;color:#666;line-height:1.8;margin-bottom:26px;max-width:420px;}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:26px;}
.btn-call{background:var(--p);color:#fff;padding:13px 26px;border-radius:var(--r);font-size:14px;font-weight:700;border:none;cursor:pointer;}
.btn-devis{background:#fff;color:#1a1a1a;padding:13px 24px;border-radius:var(--r);font-size:14px;font-weight:600;border:1.5px solid #e0e0de;cursor:pointer;}
.trust-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
.trust-b{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #ebebea;border-radius:var(--r);padding:10px 14px;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.trust-b-icon{font-size:18px;}
.trust-b-txt{font-size:12px;font-weight:700;color:#1a1a1a;}
.trust-b-sub{font-size:11px;color:#888;}
.hero-visual{background:linear-gradient(160deg,var(--p),var(--pGrad1));min-height:480px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;padding:40px;}
.hv-icon{font-size:72px;}
.hv-stat{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:14px 22px;text-align:center;color:#fff;}
.hv-n{font-size:1.9rem;font-weight:800;font-family:var(--hf);}
.hv-l{font-size:11px;opacity:.8;margin-top:2px;}

.services-local{padding:72px 4%;background:#fff;}
.eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--p);margin-bottom:8px;}
.sec-title{font-size:clamp(1.5rem,2.5vw,2rem);font-weight:800;color:#0f0f0f;margin-bottom:8px;letter-spacing:-.02em;font-family:var(--hf);}
.svc-list{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px;}
.svc-c{background:#fafaf8;border:1px solid #efefed;border-radius:16px;padding:28px;position:relative;}
.svc-c::after{content:'→';position:absolute;right:20px;bottom:18px;font-size:17px;color:var(--pA30);}
.svc-c-icon{font-size:30px;margin-bottom:12px;display:block;}
.svc-c-title{font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:8px;font-family:var(--hf);}
.svc-c-desc{font-size:13px;color:#777;line-height:1.65;margin-bottom:12px;}
.svc-tag{display:inline-block;font-size:11px;font-weight:600;color:var(--p);background:var(--pA08);padding:4px 10px;border-radius:100px;}

.why{padding:72px 4%;background:#f9f9f7;}
.why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:36px;}
.why-item{background:#fff;border:1px solid #ebebea;border-radius:16px;padding:22px;display:flex;gap:14px;align-items:flex-start;}
.why-check{width:36px;height:36px;background:var(--pA08);border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:var(--p);flex-shrink:0;}
.why-item strong{display:block;font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:4px;}
.why-item p{font-size:13px;color:#777;line-height:1.6;}

.reviews-local{padding:64px 4%;background:var(--p);}
.reviews-local .sec-title{color:#fff;margin-bottom:32px;}
.reviews-local .eyebrow{color:rgba(255,255,255,.7);}
.rev-row{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.rev-l{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:22px;}
.rev-stars{color:#fbbf24;font-size:14px;margin-bottom:10px;}
.rev-txt{font-size:13.5px;color:rgba(255,255,255,.9);line-height:1.65;font-style:italic;margin-bottom:12px;}
.rev-name{font-size:12.5px;font-weight:700;color:#fff;}
.rev-date{font-size:11px;color:rgba(255,255,255,.5);margin-top:2px;}

.contact-local{padding:72px 4%;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start;}
.contact-item{display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;}
.ci-icon{width:42px;height:42px;background:var(--pA08);border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}
.ci-label{font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.06em;font-weight:600;}
.ci-val{font-size:14px;font-weight:600;color:#1a1a1a;margin-top:2px;}
.cform{background:#fafaf8;border:1px solid #efefed;border-radius:20px;padding:28px;}
.cf-title{font-size:15.5px;font-weight:700;margin-bottom:18px;font-family:var(--hf);}
.cf-field{width:100%;background:#fff;border:1.5px solid #e8e8e5;border-radius:var(--r);padding:11px 16px;font-size:13.5px;margin-bottom:10px;font-family:var(--bf);color:#333;}
.cf-area{width:100%;background:#fff;border:1.5px solid #e8e8e5;border-radius:var(--r);padding:11px 16px;font-size:13.5px;margin-bottom:14px;font-family:var(--bf);color:#333;height:88px;resize:none;}
.cf-submit{width:100%;background:var(--p);color:#fff;padding:13px;border:none;border-radius:var(--r);font-size:14.5px;font-weight:700;cursor:pointer;font-family:var(--bf);}

footer{background:#111;padding:26px 4%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.flogo{font-size:15px;font-weight:800;color:#fff;font-family:var(--hf);}
.flinks{display:flex;gap:20px;font-size:12px;color:#555;}
.fcopy{font-size:11px;color:#444;}
@media(max-width:700px){.hero-local,.contact-local{grid-template-columns:1fr;}.hero-visual{min-height:200px;}.svc-list,.why-grid,.rev-row{grid-template-columns:1fr;}.nav-links{display:none;}}
`) + `
<body>
${wm()}
<div class="topbar">
  <div class="topbar-phone">📞 +33 X XX XX XX XX — Disponible 7j/7</div>
  <div class="topbar-badges"><span>⭐ 5.0 Google</span><span>✓ Devis gratuit</span><span>⚡ Intervention rapide</span></div>
</div>
<nav>
  <div class="logo"><div class="logo-main">${esc(d.nom)}</div><div class="logo-sub">${esc(d.slogan)}</div></div>
  <div class="nav-links"><span>Accueil</span><span>Services</span><span>Réalisations</span><span>Contact</span></div>
  <div class="nav-btns"><button class="nav-cta-g">Voir les avis</button><button class="nav-cta">Devis gratuit</button></div>
</nav>
<div class="hero-local">
  <div class="hero-content">
    <div class="urgency">⚡ Intervention rapide — Devis gratuit sous 24h</div>
    <h1>${esc(d.hero_titre)}</h1>
    <p>${esc(d.hero_sous_titre)}</p>
    <div class="hero-btns"><button class="btn-call">📞 Appeler maintenant</button><button class="btn-devis">Devis gratuit →</button></div>
    <div class="trust-grid">
      <div class="trust-b"><span class="trust-b-icon">⭐</span><div><div class="trust-b-txt">5.0/5 Google</div><div class="trust-b-sub">+50 avis vérifiés</div></div></div>
      <div class="trust-b"><span class="trust-b-icon">✅</span><div><div class="trust-b-txt">Certifié & Assuré</div><div class="trust-b-sub">Garantie décennale</div></div></div>
      <div class="trust-b"><span class="trust-b-icon">📍</span><div><div class="trust-b-txt">Intervention locale</div><div class="trust-b-sub">Rayon 50 km</div></div></div>
      <div class="trust-b"><span class="trust-b-icon">🏆</span><div><div class="trust-b-txt">10+ ans d'expérience</div><div class="trust-b-sub">+250 réalisations</div></div></div>
    </div>
  </div>
  <div class="hero-visual">
    <div class="hv-icon">${d.icone1}</div>
    <div class="hv-stat"><div class="hv-n">250+</div><div class="hv-l">Réalisations</div></div>
    <div class="hv-stat"><div class="hv-n">10 ans</div><div class="hv-l">D'expérience</div></div>
  </div>
</div>
<div class="services-local">
  <div class="eyebrow">Nos prestations</div>
  <div class="sec-title">${esc(d.section_speciale_titre)}</div>
  <div class="svc-list">
    <div class="svc-c"><span class="svc-c-icon">${d.icone1}</span><div class="svc-c-title">${esc(d.service1_titre)}</div><p class="svc-c-desc">${esc(d.service1_desc)}</p><span class="svc-tag">Devis gratuit</span></div>
    <div class="svc-c"><span class="svc-c-icon">${d.icone2}</span><div class="svc-c-title">${esc(d.service2_titre)}</div><p class="svc-c-desc">${esc(d.service2_desc)}</p><span class="svc-tag">Intervention rapide</span></div>
    <div class="svc-c"><span class="svc-c-icon">${d.icone3}</span><div class="svc-c-title">${esc(d.service3_titre)}</div><p class="svc-c-desc">${esc(d.service3_desc)}</p><span class="svc-tag">Garanti</span></div>
  </div>
</div>
<div class="why">
  <div class="eyebrow">Pourquoi nous choisir</div>
  <div class="sec-title">${esc(d.about_titre)}</div>
  <div class="why-grid">${items || `
    <div class="why-item"><div class="why-check">✓</div><div><strong>Réactivité garantie</strong><p>Intervention rapide pour tous vos besoins urgents.</p></div></div>
    <div class="why-item"><div class="why-check">✓</div><div><strong>Travail soigné</strong><p>Chaque prestation réalisée avec soin et professionnalisme.</p></div></div>
    <div class="why-item"><div class="why-check">✓</div><div><strong>Tarifs transparents</strong><p>Devis détaillé, sans mauvaise surprise.</p></div></div>
    <div class="why-item"><div class="why-check">✓</div><div><strong>Satisfaction garantie</strong><p>Nous nous engageons sur la qualité.</p></div></div>
  `}</div>
</div>
<div class="reviews-local">
  <div class="eyebrow">Avis clients</div>
  <div class="sec-title">Ce que disent nos clients</div>
  <div class="rev-row">
    <div class="rev-l"><div class="rev-stars">★★★★★</div><div class="rev-txt">"${esc(d.temoignage_texte)}"</div><div class="rev-name">${esc(d.temoignage_nom)}</div><div class="rev-date">${esc(d.temoignage_role)}</div></div>
    <div class="rev-l"><div class="rev-stars">★★★★★</div><div class="rev-txt">"Travail impeccable, délais respectés, tarifs honnêtes. Je recommande sans hésiter !"</div><div class="rev-name">Sophie M.</div><div class="rev-date">Cliente vérifiée</div></div>
  </div>
</div>
<div class="contact-local">
  <div>
    <div class="eyebrow">Nous contacter</div>
    <div class="sec-title">Demandez votre devis gratuit</div>
    <div class="contact-item"><div class="ci-icon">📞</div><div><div class="ci-label">Téléphone</div><div class="ci-val">+33 X XX XX XX XX</div></div></div>
    <div class="contact-item"><div class="ci-icon">✉️</div><div><div class="ci-label">Email</div><div class="ci-val">contact@${esc(d.nom.toLowerCase().replace(/\s+/g,""))}.fr</div></div></div>
    <div class="contact-item"><div class="ci-icon">📍</div><div><div class="ci-label">Zone d'intervention</div><div class="ci-val">Votre région — rayon 50 km</div></div></div>
  </div>
  <div class="cform">
    <div class="cf-title">Devis gratuit en 24h</div>
    <input class="cf-field" type="text" placeholder="Votre nom" />
    <input class="cf-field" type="tel" placeholder="Votre téléphone" />
    <input class="cf-field" type="text" placeholder="Type de prestation" />
    <textarea class="cf-area" placeholder="Décrivez votre besoin..."></textarea>
    <button class="cf-submit">Envoyer ma demande →</button>
  </div>
</div>
<footer>
  <div class="flogo">${esc(d.nom)}</div>
  <div class="flinks"><span>Mentions légales</span><span>Confidentialité</span></div>
  <div class="fcopy">© 2025 ${esc(d.nom)} · Tous droits réservés</div>
</footer>
</body></html>`;
}
