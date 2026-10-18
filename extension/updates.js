(() => {
 const repo='https://github.com/yomidee/NostalgicTube';
 function parts(value){return /^v?\d+(?:\.\d+){0,3}$/.test(value)?value.replace(/^v/,'').split('.').map(Number):null;}
 function canonical(value){const p=parts(value);if(!p)return null;if(p.length>=3&&p[0]===4){if(p[1]===0&&p[2]===0)return [0,0,4];return [0,p[1],p[2],p[3]||0];}if(p.length>=3&&!p[3]&&p[0]>=1&&p[0]<=3&&p[1]===0&&p[2]===0)return [0,0,p[0]];return p;}
 function compare(a,b){const x=canonical(a),y=canonical(b);if(!x||!y)throw new Error('Invalid version');for(let i=0;i<4;i++){const d=(x[i]||0)-(y[i]||0);if(d)return Math.sign(d);}return 0;}
 function select(releases){if(!Array.isArray(releases))throw new Error('Invalid releases');return releases.filter(r=>!r.draft&&parts(r.tag_name)).map(r=>({version:r.tag_name.replace(/^v/,''),url:repo+'/releases/tag/'+r.tag_name})).sort((a,b)=>compare(b.version,a.version)||(Number(b.version.startsWith('0.'))-Number(a.version.startsWith('0.'))))[0]||null;}

 globalThis.NostalgicUpdates={compare,select};
})();

