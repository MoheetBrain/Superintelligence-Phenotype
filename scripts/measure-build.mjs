import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
async function files(dir) {
  const result = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    if ((await stat(path)).isDirectory()) result.push(...(await files(path)));
    else result.push(path);
  }
  return result;
}
const rows = [];
for (const path of await files('dist')) {
  const data = await readFile(path);
  rows.push({ path, bytes: data.length, gzipBytes: gzipSync(data).length });
}
const initial = rows.filter((r) => /\.(js|css)$/.test(r.path));
const all = rows.reduce((n, r) => n + r.bytes, 0);
const report = {
  measuredAt: new Date().toISOString(),
  node: process.version,
  targets: { initialJsCssGzipBytes: 1000000, totalInitialTransferBytes: 2000000 },
  initialJsCssGzipBytes: initial.reduce((n, r) => n + r.gzipBytes, 0),
  allDistUncompressedBytes: all,
  files: rows,
  note: 'Gzip measured locally at default zlib level. The static preview may transfer uncompressed files. All-dist size includes optional notices, so it is a conservative transfer upper bound; HTTP headers excluded.',
};
await writeFile('docs/build-size.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (report.initialJsCssGzipBytes > 1000000 || all > 2000000) process.exitCode = 1;
