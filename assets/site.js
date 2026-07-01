/* Perit Lewis — interactions */
(function(){
  // solid header on scroll
  var head=document.querySelector('.site-head');
  var lightTop=document.body.classList.contains('light-top');
  var lightPage=document.body.classList.contains('light-page');
  function onScroll(){
    if(!head)return;
    var solid=window.scrollY>40;
    head.classList.toggle('solid', solid);
    if(lightPage) head.classList.add('on-light');
    else if(lightTop) head.classList.toggle('on-light', !solid);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile drawer
  var toggle=document.querySelector('.nav-toggle');
  var drawer=document.querySelector('.drawer');
  if(toggle&&drawer){
    toggle.addEventListener('click',function(){drawer.classList.add('open');});
    var close=drawer.querySelector('.close');
    if(close)close.addEventListener('click',function(){drawer.classList.remove('open');});
  }

  // reveal on scroll
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

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
