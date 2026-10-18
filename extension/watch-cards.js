(() => {
 const text=value=>typeof value==='string'?value:value?.simpleText||value?.content||(value?.runs||[]).map(r=>r.text||'').join('');
 function duration(value,depth=0){if(!value||typeof value!=='object'||depth>12)return '';const direct=text(value.thumbnailOverlayTimeStatusRenderer?.text)||text(value.thumbnailBadgeViewModel?.text);if(/^\d+(?::\d{2}){1,2}$/.test(direct))return direct;for(const child of Object.values(value)){if(child&&typeof child==='object'){const found=duration(child,depth+1);if(found)return found;}}return '';}
 function render(container,batch,append){
   if(!append)container.replaceChildren();
   const fragment=document.createDocumentFragment();
   for(const video of batch){
     if(!/^[\w-]{11}$/.test(video.id||''))continue;
     const row=document.createElement('article');row.className='nt-watch-card';
     const thumbnail=document.createElement('a');thumbnail.className='nt-watch-thumbnail';thumbnail.href='/watch?v='+video.id;thumbnail.setAttribute('aria-label',video.title);
     const image=document.createElement('img');image.src='https://i.ytimg.com/vi/'+video.id+'/hqdefault.jpg';image.alt='';image.loading='lazy';image.decoding='async';thumbnail.append(image);
     const time=text(video.renderer?.videoRenderer?.lengthText)||duration(video.renderer);
     if(time){const badge=document.createElement('span');badge.className='nt-watch-duration';badge.textContent=time;thumbnail.append(badge);}
     const details=document.createElement('div');details.className='nt-watch-details';
     const title=document.createElement('a');title.className='nt-watch-title';title.href=thumbnail.href;title.textContent=video.title;title.title=video.title;details.append(title);
     if(video.channel){const channel=document.createElement('p');channel.className='nt-watch-channel';channel.textContent=video.channel;details.append(channel);}
     const original=video.renderer?.videoRenderer;
     const metadata=(video.renderer?.lockupViewModel?.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows||[]).flatMap(r=>(r.metadataParts||[]).map(p=>text(p.text)));
     const views=text(original?.shortViewCountText||original?.viewCountText)||metadata.find(part=>/views|visitas|visualizaciones|vues|Aufrufe/i.test(part))||'';
     const meta=document.createElement('p');meta.className='nt-watch-meta';meta.textContent=[views,video.published].filter(Boolean).join(' · ');details.append(meta);
     row.append(thumbnail,details);fragment.append(row);
   }
   container.append(fragment);
 }
 globalThis.NostalgicWatchCards={render};
})();
