(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const node = (tag, classes, text) => { const n=document.createElement(tag); if(classes)n.className=classes; if(text!==undefined)n.textContent=text; return n; };
  const setText = (selector, value) => { const element=$(selector); if(element && value!==undefined && value!==null) element.textContent=String(value); };
  const linkURL = value => { if(!value || typeof value!=='string') return ''; try { const url=new URL(value,location.href); return ['https:','http:'].includes(url.protocol) ? url.href : ''; } catch {return '';} };
  const setLink = (selector,value) => { const el=$(selector); if(el && linkURL(value)) el.href=linkURL(value); };
  const safeAsset = value => { if(!value||typeof value!=='string') return ''; if(/^assets\/[a-zA-Z0-9/_\-.]+$/.test(value)) return value; return linkURL(value); };
  let DATA, posts=[], currentFilter='All', visibleLimit=16, lastFocused=null;
  let observer;

  function imageAt(el, src, alt, onFail) {
    if(!el) return;
    const urls=[...new Set((Array.isArray(src)?src:[src]).map(safeAsset).filter(Boolean))];
    el.dataset.loaded='false';
    if(!urls.length){ if(onFail)onFail(); return; }
    el.querySelectorAll('img').forEach(old=>old.remove());
    const img=new Image(); img.alt=alt||'Instagram post image'; img.decoding='async';
    img.loading=el.id==='heroPhoto'||el.id==='heroMiniPhoto'?'eager':'lazy';
    if(el.id==='heroPhoto')img.fetchPriority='high';
    img.referrerPolicy='no-referrer';
    img.onload=()=> { el.dataset.loaded='true'; };
    img.onerror=()=> {
      if(urls.length){img.src=urls.shift();return;}
      el.dataset.loaded='false'; img.remove(); if(onFail)onFail();
    };
    // Lazy images must be in the document before the browser can load them.
    el.prepend(img);
    img.src=urls.shift();
  }
  function applyTheme(theme={}) {
    const aliases={background:'--bg',text:'--ink',muted:'--muted',dark:'--dark',pink:'--pink',pinkLight:'--pink-pale',mango:'--mango',teal:'--teal',violet:'--violet',line:'--line'};
    for(const [key,name] of Object.entries(aliases)){const val=theme[key];if(/^#[0-9a-fA-F]{3,8}$/.test(val||''))document.documentElement.style.setProperty(name,val);}
  }
  function createMedia(parent,item,className,alt){
    const wrap=node('div',`media-surface ${className||''}`);
    const fallback=node('div','image-placeholder'); fallback.append(node('strong','', '✦')); fallback.append(node('small','','RAUSHAN • REEL ARCHIVE')); wrap.append(fallback);
    if(item)imageAt(wrap,[item.imageLocal,item.image],alt||item.title);
    parent.append(wrap);
    return wrap;
  }
  function sourcePost(id){return posts.find(p=>p.id===id);}
  function renderHeader(d){
    const name=d.identity||{};const social=d.social||{};
    setText('#brandName',(name.firstName||'Raushan').toUpperCase()+'.');
    setLink('#navInstagram',social.instagram);setLink('#heroFollow',social.instagram);setLink('#aboutLink',social.instagram);setLink('#workInstagram',social.instagram);setLink('#contactInstagram',social.instagram);setLink('#footerInstagram',social.instagram);
    const toggle=$('#mobileToggle'), nav=$('#navLinks');
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
    window.addEventListener('scroll',()=>{const y=window.scrollY||0;$('#siteHeader').classList.toggle('scrolled',y>24);const root=document.documentElement;const max=root.scrollHeight-window.innerHeight;$('#readingBar').style.width=max>0?`${Math.min(100,100*y/max)}%`:'0%';},{passive:true});
  }
  function renderHero(d){const i=d.identity||{}; const images=d.images||{};
    setText('#heroEyebrow',i.eyebrow); setText('#heroTitleOne',i.heroLine1);setText('#heroTitleTwo',i.heroLine2);setText('#heroLocalLine',i.localLine);setText('#heroDescription',i.shortBio);setText('#heroArtistName',i.displayName);setText('#heroArtistHandle',i.handle);
    const mini=sourcePost(d.posts?.[11]?.id);
    imageAt($('#heroPhoto'),[images.heroLocal,images.hero],'Photo from Raushan Gupta Instagram');
    imageAt($('#heroMiniPhoto'),[mini?.imageLocal,mini?.image],'Another lifestyle post from Raushan Gupta');
  }
  function renderAbout(d){const i=d.identity||{},images=d.images||{};
    setText('#aboutBio',i.fullBio||i.shortBio);setText('#aboutTagline',i.tagline);
    const tags=$('#aboutTags');(i.niche||[]).forEach(tag=>tags.append(node('span','',tag)));
    imageAt($('#aboutPhoto'),[images.aboutLocal,images.about],'Instagram photo from Raushan Gupta');
  }
  function renderStories(d){const root=$('#storyGrid');(d.storyHighlights||[]).forEach((s,index)=>{
    const card=node('article','story-card reveal');card.style.transitionDelay=`${index*100}ms`;
    card.append(node('span','story-number',s.number||`0${index+1}`));card.append(node('span','story-icon',s.icon||'✦'));
    card.append(node('h3','',s.title||''));card.append(node('p','',s.description||''));root.append(card);
  });}
  function renderFeature(d){const grid=$('#featuredGrid');const selected=(d.featuredIds||[]).map(sourcePost).filter(Boolean);
    selected.forEach((p,index)=>{
      const card=node('a','feature-card reveal');card.style.transitionDelay=`${(index%3)*65}ms`;card.href=linkURL(p.url)||'#work';card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label',`Open ${p.title} on Instagram`);
      const media=createMedia(card,p,'feature-media',p.title);
      media.append(node('span','feature-badge',p.kind==='reel'?'↗ REEL':'↗ POST'));media.append(node('span','feature-play','▶'));
      const info=node('div','feature-info');info.append(node('span','small-cap',p.category||'Everyday Stories'));info.append(node('h3','',p.title||'Featured moment'));
      const bottom=node('div','view-more');bottom.append(node('b','', 'Watch on Instagram'));bottom.append(node('span','','↗'));info.append(bottom);card.append(info);grid.append(card);
    });
  }
  function renderStats(d){const grid=$('#statsGrid');(d.editorialStats||[]).forEach(s=>{
    const card=node('div','stat reveal');card.append(node('span','stat-val',s.value||'—'));card.append(node('span','stat-label',s.label||''));card.append(node('small','stat-footnote',s.footnote||''));grid.append(card);
  });}
  function filteredPosts(){if(currentFilter==='All')return posts; if(currentFilter==='Reels')return posts.filter(p=>p.kind==='reel');if(currentFilter==='Photos')return posts.filter(p=>p.kind==='photo');return posts.filter(p=>p.category===currentFilter);}
  function renderFilters(){const filters=['All','Reels','Photos','Star Spoofs','Everyday Comedy','Brand Stories','Off Camera','Desi Moments'];const root=$('#filterRow');
    filters.forEach(f=>{const count=f==='All'?posts.length:f==='Reels'?posts.filter(p=>p.kind==='reel').length:f==='Photos'?posts.filter(p=>p.kind==='photo').length:posts.filter(p=>p.category===f).length;
      if(!count) return; const btn=node('button','filter-btn',`${f}  ${count}`);btn.type='button';btn.setAttribute('aria-pressed',String(f===currentFilter));btn.addEventListener('click',()=>{currentFilter=f;visibleLimit=16;root.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));renderGallery();});root.append(btn);
    });}
  function galleryCard(p){const card=node('button','gallery-card');card.type='button';card.setAttribute('aria-label',`Preview ${p.title}`);
    const media=createMedia(card,p,'gallery-image',p.title);
    media.append(node('span','gallery-tag',p.kind==='reel'?'↗ Reel':'✳ Photo'));
    const caption=node('div','gallery-meta');caption.append(node('strong','',p.title||'Everyday moment'));
    const small=node('small');small.append(node('span','',p.category||'Instagram'));small.append(node('span','','↗'));caption.append(small);card.append(caption);
    card.addEventListener('click',()=>openLightbox(p));return card;
  }
  function renderGallery(){const grid=$('#galleryGrid');grid.replaceChildren();const selection=filteredPosts();selection.slice(0,visibleLimit).forEach(p=>grid.append(galleryCard(p)));$('#loadMore').hidden=visibleLimit>=selection.length;}
  function openLightbox(p){
    lastFocused=document.activeElement;
    const modal=$('#lightbox'),img=$('#lightboxImage'),fallback=$('#lightboxFallback');
    img.style.display='none';fallback.hidden=true;img.removeAttribute('src');
    img.alt=p.title||'Raushan Instagram image';img.referrerPolicy='no-referrer';
    setText('#lightboxTitle',p.title);setLink('#lightboxOriginal',p.url);
    const urls=[...new Set([p.imageLocal,p.image].map(safeAsset).filter(Boolean))];
    img.onload=()=>{img.style.display='block';fallback.hidden=true;};
    img.onerror=()=>{if(urls.length){img.src=urls.shift();return;}img.style.display='none';fallback.hidden=false;};
    if(urls.length)img.src=urls.shift();else fallback.hidden=false;
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');$('#lightboxClose').focus();
  }
  function closeLightbox(){const modal=$('#lightbox');modal.classList.remove('open');modal.setAttribute('aria-hidden','true');$('#lightboxImage').removeAttribute('src');document.body.classList.remove('no-scroll');if(lastFocused?.focus)lastFocused.focus();}
  function renderGallerySection(d){posts=(d.posts||[]).filter(p=>p.sourceAccount==='raushangupta128');renderFilters();renderGallery();$('#loadMore').addEventListener('click',()=>{visibleLimit+=12;renderGallery();});$('#lightboxClose').addEventListener('click',closeLightbox);$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))closeLightbox();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#lightbox').classList.contains('open'))closeLightbox();});}
  function renderBrandStory(d){
    const c=d.featuredBrandStory||{};
    const post=sourcePost(c.postId);
    if(!c.enabled||!post) return;
    const section=$('#brandFeature');if(!section)return;
    section.hidden=false;
    setText('#brandEyebrow',c.eyebrow||'STORYTELLING');
    setText('#brandHeadlineTop',c.headlineTop||'When a product');
    setText('#brandHeadlineAccent',c.headlineAccent||'joins the punchline.');
    setText('#brandDescription',c.description||'');
    setText('#brandDisclaimer',c.disclaimer||'');
    setLink('#brandPostLink',post.url);setLink('#brandVisualLink',post.url);
    imageAt($('#brandVisual'),[post.imageLocal,post.image],post.title+' — Instagram image');
  }
  function renderContact(d){setText('#contactCopy',d.contact?.message);setText('#footerTagline',d.identity?.tagline);setText('#copyrightName',d.identity?.displayName);setText('#year',new Date().getFullYear());setText('#footerLogo',(d.identity?.firstName||'Raushan').toUpperCase()+'✳');
    const types=$('#ctaTypes');(d.contact?.collaborationTypes||[]).forEach(t=>types.append(node('span','',t)));
    if(d.contact?.email){const email=$('#emailCTA');email.hidden=false;email.href='mailto:'+encodeURIComponent(d.contact.email);}
    if(d.partnershipAttribution?.enabled){const label=$('#partnerCredit');label.hidden=false;label.textContent=d.partnershipAttribution.text||'';}
    const sections=d.sections||{};for(const [key,id] of Object.entries({hero:'heroSection',about:'about',feature:'work',gallery:'gallery',collaboration:'contact'})){if(sections[key]===false)$('#'+id)?.remove();}
  }
  function setupObserver(){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{rootMargin:'0px 0px -30px 0px',threshold:.06});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
  function init(d){DATA=d;if(!d||!d.identity||!Array.isArray(d.posts))throw new Error('influencer.json is missing identity or posts.');
    applyTheme(d.theme);if(d.seo?.title)document.title=d.seo.title;const meta=$('meta[name="description"]');if(meta&&d.seo?.description)meta.content=d.seo.description;
    posts=d.posts.filter(p=>p.sourceAccount==='raushangupta128');renderHeader(d);renderHero(d);renderAbout(d);renderStories(d);renderFeature(d);renderBrandStory(d);renderStats(d);renderGallerySection(d);renderContact(d);setupObserver();$('#loading').classList.add('hidden');setTimeout(()=>$('#loading')?.remove(),700);
  }
  async function boot(){let d=null;
    if(location.protocol!=='file:') {try{const r=await fetch('data/influencer.json',{cache:'no-store'});if(r.ok)d=await r.json();}catch(e){console.warn('JSON fetch failed; using offline cache',e);}}
    if(!d)d=window.RAUSHAN_PORTFOLIO_DATA;
    if(!d){$('#loading').textContent='Data unavailable. Please run update-offline.bat to regenerate offline-data.js.';return;}
    try{init(d);}catch(e){console.error(e);$('#loading').textContent='Unable to load influencer data. Check influencer.json and update-offline.bat.';}
  }
  document.addEventListener('DOMContentLoaded',boot);
})();
