(function(){
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));}).filter(Boolean);
  var current=null,lock=0;
  function setActive(id){
    if(id===current)return;current=id;
    links.forEach(function(a){a.classList.remove('active');a.removeAttribute('aria-current');});
    var a=map[id];if(!a)return;a.classList.add('active');a.setAttribute('aria-current','true');
    var nav=a.closest('.toc');
    if(nav&&nav.scrollWidth>nav.clientWidth){ // mobile horizontal bar
      var l=a.offsetLeft-(nav.clientWidth-a.offsetWidth)/2;nav.scrollTo({left:l,behavior:'smooth'});
    }else if(nav&&nav.scrollHeight>nav.clientHeight){
      var r=a.getBoundingClientRect(),n=nav.getBoundingClientRect();
      if(r.top<n.top||r.bottom>n.bottom)a.scrollIntoView({block:'nearest'});
    }
  }
  function onScroll(){
    if(Date.now()<lock)return;
    var off=window.innerHeight*0.28,id=secs[0].id;
    for(var i=0;i<secs.length;i++){if(secs[i].getBoundingClientRect().top-off<=0)id=secs[i].id;}
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4)id=secs[secs.length-1].id;
    setActive(id);
  }
  var t;window.addEventListener('scroll',function(){if(t)return;t=requestAnimationFrame(function(){t=null;onScroll();});},{passive:true});
  window.addEventListener('resize',onScroll);
  links.forEach(function(a){a.addEventListener('click',function(){lock=Date.now()+900;setActive(a.getAttribute('href').slice(1));});});
  onScroll();
  document.querySelectorAll('.more-btn').forEach(function(btn){
    var label=btn.textContent;
    btn.addEventListener('click',function(){
      var panel=document.getElementById(btn.getAttribute('aria-controls'));
      var open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',open?'false':'true');
      if(open){panel.setAttribute('hidden','');btn.textContent=label;}
      else{panel.removeAttribute('hidden');btn.textContent='Ocultar el listado';}
    });
  });
})();
