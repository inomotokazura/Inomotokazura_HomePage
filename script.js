const message = document.getElementById('like-message');
document.querySelectorAll('.like-tile').forEach(button => {
  button.addEventListener('click', () => {
    message.textContent = button.dataset.message;
    message.animate([{transform:'scale(.94)',opacity:.4},{transform:'scale(1.04)',opacity:1},{transform:'scale(1)',opacity:1}],{duration:380,easing:'ease-out'});
  });
});


// ORDER の3つのポップアップに共通の動作
[['open-service-dialog','service-dialog'],['open-flow-dialog','flow-dialog'],['open-price-dialog','price-dialog']].forEach(([openId, dialogId]) => {
  const opener = document.getElementById(openId);
  const dialog = document.getElementById(dialogId);
  if (!opener || !dialog) return;
  opener.addEventListener('click', () => dialog.showModal());
  dialog.querySelectorAll('.service-close, .service-bottom-close').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
});

// WORKS / ORIGINAL WORK: カードから詳細ポップアップを開く
(() => {
 const dialog=document.getElementById('work-detail-dialog');
 if(!dialog)return;
 const title=dialog.querySelector('#work-detail-title'), content=dialog.querySelector('#work-detail-content');
 document.querySelectorAll('#works .work-card, #original-work .work-card').forEach(card=>{
  card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-haspopup','dialog');
  const open=()=>{
   title.textContent=card.querySelector('.card-body h3')?.textContent||'作品詳細';
   content.replaceChildren();
   const data=card.querySelector('.work-detail-data');
   if(data){content.append(...Array.from(data.children,child=>child.cloneNode(true)));content.querySelectorAll('[hidden]').forEach(el=>el.removeAttribute('hidden'));}
   else {const p=document.createElement('p');p.textContent=card.querySelector('.card-body p')?.textContent||'';content.append(p)}
   dialog.showModal();
  };
  card.addEventListener('click',e=>{if(e.target.closest('a,button'))return;open()});
  card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===card){e.preventDefault();open()}});
 });
 dialog.querySelectorAll('.service-close,.service-bottom-close').forEach(b=>b.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
})();
