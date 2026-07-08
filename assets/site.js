/* Perit Lewis — interactions */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce) document.documentElement.classList.add('anim-ready');

  var head=document.querySelector('.site-head');
  var toggle=document.querySelector('.nav-toggle');
  var drawer=document.querySelector('.drawer');
  var lightTop=document.body.classList.contains('light-top');
  var lightPage=document.body.classList.contains('light-page');

  // header: solid on scroll + hide on scroll-down, reveal on scroll-up
  var lastY=window.scrollY;
  function onScroll(){
    if(!head)return;
    var y=window.scrollY, solid=y>40;
    head.classList.toggle('solid', solid);
    if(lightPage) head.classList.add('on-light');
    else if(lightTop) head.classList.toggle('on-light', !solid);
    var drawerOpen = drawer && drawer.classList.contains('open');
    if(!drawerOpen){
      if(y>150 && y>lastY+3) head.classList.add('hide');
      else if(y<lastY-3 || y<150) head.classList.remove('hide');
    }
    lastY=y;
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile drawer
  if(toggle&&drawer){
    toggle.addEventListener('click',function(){drawer.classList.add('open');});
    var close=drawer.querySelector('.close');
    if(close)close.addEventListener('click',function(){drawer.classList.remove('open');});
  }

  // ---- scroll reveal (auto-tag + stagger) ----------------------
  function tag(el,delay){
    if(!el) return;
    if(delay) el.style.setProperty('--rvd', delay+'ms');
    if(!el.classList.contains('reveal') && !el.classList.contains('in')) el.classList.add('reveal');
  }
  function stagger(parentSel, childSel, step, cap){
    document.querySelectorAll(parentSel).forEach(function(p){
      Array.prototype.forEach.call(p.querySelectorAll(childSel), function(el,i){
        tag(el, Math.min(i,cap)*step);
      });
    });
  }
  stagger('.pf2-grid','.pf2-card',70,6);
  stagger('.pp-gallery','.g',55,8);
  stagger('.gallery','.g-item',60,6);
  stagger('.jobs','.job',110,4);
  stagger('.stats','.stat',80,4);
  stagger('.pp-narrative','p',45,6);
  stagger('.na-twocol','p',90,2);
  stagger('.cform','.field',60,6);
  stagger('.cinfo','.blk',70,4);
  ['.pf2-title','.pf2-lead','.pf2-scroll','.pp-title','.pp-head .pp-specs','.pp-explore',
   '.job-title','.job-meta','.hero-inner','.hero-counter','.scroll-cue','.na-card',
   '.c-lead','.statement .q','.na-dark-inner'].forEach(function(s){
    document.querySelectorAll(s).forEach(function(el){ tag(el,0); });
  });

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.1, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  // hero / project-hero / behind-practice images also get the .in zoom trigger
  document.querySelectorAll('.pp-hero,.na-dark').forEach(function(el){io.observe(el);});

  // ---- placeholder imagery -------------------------------------
  // Architecture photos by keyword (hot-linked from LoremFlickr).
  // Replace this whole block — or each .ph — with real <img>/URLs later.
  var KW={
    restoration:'architecture,historic,stone',
    open:'garden,landscape,park',
    residences:'house,architecture,modern',
    infrastructure:'road,bridge,construction',
    buildings:'building,facade,office',
    structures:'steel,structure,construction',
    hero:'architecture,building,facade',
    studio:'architecture,interior,studio',
    'default':'architecture,building'
  };
  var TEXT={ // map a visible category label -> keyword
    'restoration':'restoration','open spaces':'open','residences':'residences',
    'infrastructure':'infrastructure','buildings':'buildings','structures':'structures'
  };
  function setImg(el,url){ el.style.backgroundImage="url('"+url+"')"; }
  var lock=11;
  document.querySelectorAll('.ph').forEach(function(el){
    // real photo takes priority over keyword placeholders
    var real=el.getAttribute('data-img');
    if(real){ setImg(el,real); return; }
    var kw=el.getAttribute('data-kw');
    if(!kw){
      var c=el.closest('[data-cat]');
      if(c) kw=KW[c.getAttribute('data-cat')];
    }
    if(!kw){
      var feat=el.closest('.feat');
      if(feat){var t=feat.querySelector('.cat'); if(t){kw=KW[TEXT[t.textContent.trim().toLowerCase()]];}}
    }
    if(!kw) kw=KW['default'];
    lock++;
    setImg(el,"https://loremflickr.com/900/1100/"+encodeURIComponent(kw)+"?lock="+lock);
  });

  // portfolio editorial banner — crossfade background on hover
  (function(){
    var stage=document.querySelector('.pf-stage'); if(!stage) return;
    var bgs=stage.querySelectorAll('.pf-bg');
    var items=stage.querySelectorAll('.pf-list a[data-img]');
    var top=0;
    function show(src){
      var back=bgs[1-top];
      back.style.backgroundImage="url('"+src+"')";
      back.classList.add('show');
      bgs[top].classList.remove('show');
      top=1-top;
    }
    var def=stage.getAttribute('data-default')||(items[0]&&items[0].getAttribute('data-img'));
    if(def){ bgs[0].style.backgroundImage="url('"+def+"')"; bgs[0].classList.add('show'); }
    // preload so the swap is instant
    items.forEach(function(a){ var i=new Image(); i.src=a.getAttribute('data-img'); });
    items.forEach(function(a){
      a.addEventListener('mouseenter',function(){ show(a.getAttribute('data-img')); });
    });
    var list=stage.querySelector('.pf-list');
    if(list&&def){ list.addEventListener('mouseleave',function(){ show(def); }); }
  })();

  // portfolio filtering
  var filters=document.querySelectorAll('.filter');
  var cards=document.querySelectorAll('.card,.pf2-card');
  if(filters.length){
    filters.forEach(function(f){
      f.addEventListener('click',function(){
        filters.forEach(function(x){x.classList.remove('active');});
        f.classList.add('active');
        var cat=f.getAttribute('data-cat');
        cards.forEach(function(c){
          var show = cat==='all' || c.getAttribute('data-cat')===cat;
          c.classList.toggle('hide',!show);
        });
      });
    });
    // arrive pre-filtered from a home section link, e.g. portfolio.html#restoration
    var hash=(location.hash||'').replace('#','');
    if(hash){
      var pre=document.querySelector('.filter[data-cat="'+hash+'"]');
      if(pre) pre.click();
    }
  }
})();
