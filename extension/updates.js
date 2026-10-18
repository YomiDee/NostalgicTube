(() => {
 const repo='https://github.com/yomidee/NostalgicTube';
 function parts(value){return /^v?\d+(?:\.\d+){0,3}$/.test(value)?value.replace(/^v/,'').split('.').map(Number):null;}
 function compare(a,b){const x=parts(a),y=parts(b);if(!x||!y)throw new Error('Invalid version');for(let i=0;i<4;i++){const d=(x[i]||0)-(y[i]||0);if(d)return Math.sign(d);}return 0;}
 function select(releases){if(!Array.isArray(releases))throw new Error('Invalid releases');return releases.filter(r=>!r.draft&&parts(r.tag_name)).map(r=>{const version=r.tag_name.slice(r.tag_name.startsWith('v')?1:0),name='NostalgicTube-'+version+'-Brave.zip';const asset=(r.assets||[]).find(a=>a.name===name&&a.browser_download_url===repo+'/releases/download/'+r.tag_name+'/'+name);return asset?{version,url:asset.browser_download_url}:null;}).filter(Boolean).sort((a,b)=>compare(b.version,a.version))[0]||null;}
 globalThis.NostalgicUpdates={compare,select};
})();
