"""Import reviewed source documents without changing Desktop originals.
Historical selections use original one-based inclusive line ranges, recorded in the manifest.
Run only on explicit source refresh; routine website builds use the committed content.
"""
from pathlib import Path
import base64, hashlib, json, re, shutil
root = Path.home() / 'Desktop/SUPERINTEL'
out = Path('content/research')
selections = {
 'AI-Safety-Generalization-Risks.md': [(1,107),(122,215),(228,745),(776,778)],
 'Improve-Game-Theory-Phrase.md': [(1,99),(165,183),(213,398),(478,1582)],
}
reviewed = {
 'CLUSTERING_MATRIX.md', 'INDEX.md', 'NOVELTY_AUDIT.md',
 'PROGRAMME_OVERVIEW.md', 'RELEASE_ORDER.md', 'SUPERINTELLIGENCE_RESEARCH_ATLAS.csv',
 'P1_when_capability_iteration_outruns_assurance.md', 'P2_hazardous_inference_frontier.md',
 'P3_recursive_epistemic_dependence.md', 'P4_control_frontier.md',
 'P5_closing_the_loop.md', 'P6_correlated_lineage_resilience.md', 'P7_updating_hazard_model.md',
 *selections,
}
discovered = {str(p.relative_to(root)) for p in root.rglob('*') if p.is_file()}
if discovered != reviewed:
 raise ValueError('Source inventory changed. Review new/missing files and extraction boundaries before import.')
for directory in ['documents', 'images']:
 (out/directory).mkdir(parents=True, exist_ok=True)
manifest=[]
for p in sorted(root.rglob('*')):
 if not p.is_file(): continue
 raw=p.read_bytes()
 item={'original':str(p.relative_to(root)), 'bytes':len(raw), 'sha256':hashlib.sha256(raw).hexdigest()}
 if p.name in selections:
  lines=raw.decode().splitlines(keepends=True)
  name=p.stem+'-research-extract.md'
  segments=[]
  for start,end in selections[p.name]:
   segments.append(f'> Editorial marker: original source lines {start}–{end}. Speaker labels are preserved where present; a segment beginning mid-response is ChatGPT text.\n\n'+''.join(lines[start-1:end]))
  value='\n\n---\n\n'.join(segments)
  def picture(m):
   data=base64.b64decode(m[3]); name=Path(m[1]).stem+'.jpg'
   (out/'images'/name).write_bytes(data)
   return f'![{m[1]}](/research/assets/{name})'
  value=re.sub(r'!\[([^]]+)\]\(data:image/(\w+);base64,([^)]*)\)',picture,value)
  header=f'# {p.stem.replace("-", " ")} — historical research extracts\n\n**Archive author:** Moheet Khawaja  \n**Conversation date:** 13 September 2026 (source timezone unspecified)  \n**Site edition:** 15 September 2026\n\n> Historical discussion, not established findings. “you asked” denotes Moheet Khawaja; “chatgpt response” denotes the AI assistant. Third-party text remains attributed to its stated author (Q provenance), not claimed as Moheet’s original work. Personal account administration and unrelated stock-selection passages are omitted, with original line ranges recorded below. Strong claims and their corrections are retained. Neither archived assistant claims nor quoted reports have been independently established by this publication.\n\n'
  (out/'documents'/name).write_text(header+value)
  item.update(published_source=name,mode='research extracts',included_line_ranges=selections[p.name],omission_reason='Personal account administration, trading instructions and unrelated stock-selection discussions; originals retained locally.')
 else:
  shutil.copyfile(p,out/'documents'/p.name)
  item.update(published_source=p.name,mode='complete, byte-identical')
 item['published_sha256']=hashlib.sha256((out/'documents'/item['published_source']).read_bytes()).hexdigest()
 manifest.append(item)
(out/'source-manifest.json').write_text(json.dumps({'edition_date':'2026-09-15','files':manifest},indent=2,ensure_ascii=False)+'\n')
print(f'Imported {len(manifest)} documents; originals unchanged.')
