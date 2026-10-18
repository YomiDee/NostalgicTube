"""Build a deterministic installable ZIP; Python standard library only."""
from pathlib import Path
import json, zipfile

root=Path(__file__).resolve().parents[1]
source=root/'extension'
version=json.loads((source/'manifest.json').read_text(encoding='utf-8-sig'))['version']
target=root/'dist'/f'NostalgicTube-{version}-Brave.zip'
target.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(source.rglob('*')):
        if not file.is_file(): continue
        info=zipfile.ZipInfo('NostalgicTube/'+file.relative_to(source).as_posix(),date_time=(1980,1,1,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        info.external_attr=0o100644 << 16
        archive.writestr(info,file.read_bytes())
print(target)
