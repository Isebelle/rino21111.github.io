// Small screens use drawers; the room and sunlight controls keep the full viewport.
(()=>{
 const narrow=window.matchMedia('(max-width:1050px)'),body=document.body;
 const catalog=document.getElementById('catalogPanel'),inspector=document.getElementById('inspectorPanel'),backdrop=document.getElementById('panelBackdrop');
 const catalogToggle=document.getElementById('toggleCatalog'),inspectorToggle=document.getElementById('toggleInspector');
 let open=null;
 function show(which,restoreFocus=false){
  const previous=open;open=narrow.matches?which:null;
  body.classList.toggle('drawer-catalog',open==='catalog');body.classList.toggle('drawer-inspector',open==='inspector');backdrop.hidden=!open;
  catalogToggle.setAttribute('aria-expanded',String(open==='catalog'));inspectorToggle.setAttribute('aria-expanded',String(open==='inspector'));
  catalog.inert=narrow.matches&&open!=='catalog';inspector.inert=narrow.matches&&open!=='inspector';
  if(open){const panel=open==='catalog'?catalog:inspector;panel.querySelector('[data-close-panel]').focus({preventScroll:true});}
  else if(restoreFocus&&previous)(previous==='catalog'?catalogToggle:inspectorToggle).focus({preventScroll:true});
 }
 catalogToggle.onclick=()=>show(open==='catalog'?null:'catalog');inspectorToggle.onclick=()=>show(open==='inspector'?null:'inspector');
 backdrop.onclick=()=>show(null,true);document.querySelectorAll('[data-close-panel]').forEach(b=>b.onclick=()=>show(null,true));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){e.preventDefault();show(null,true)}});
 catalog.addEventListener('click',e=>{if(narrow.matches&&e.target.closest('.card'))show(null,true)});
 narrow.addEventListener('change',()=>show(null));show(null);
})();
