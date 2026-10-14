import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'gmb-site');
const html = fs.readFileSync(path.join(site, 'index.html'), 'utf8');
const match = html.match(/<body>\s*([\s\S]*?)\s*<script src="site.js"/);
if (!match) throw new Error('Missing website markup');
const markup = match[1].replaceAll('href="mentions-legales.html"', 'href="/mentions-legales"').replaceAll('src="assets/', 'src="/gmb-assets/');
fs.writeFileSync(path.join(root, 'lib/gmb-markup.ts'), `export const gmbMarkup = ${JSON.stringify(markup)};\n`);
fs.copyFileSync(path.join(site, 'styles.css'), path.join(root, 'app/gmb.css'));
const interactionSource = fs.readFileSync(path.join(site, 'interactions.js'), 'utf8');
fs.writeFileSync(path.join(site, 'site.js'), interactionSource.replace('export function initializeGmb', 'function initializeGmb') + '\ninitializeGmb();\n');
fs.copyFileSync(path.join(site, 'site.js'), path.join(root, 'public/gmb-site.js'));
fs.mkdirSync(path.join(root, 'public/gmb-assets'), { recursive: true });
for (const asset of fs.readdirSync(path.join(site, 'assets'))) {
  fs.copyFileSync(path.join(site, 'assets', asset), path.join(root, 'public/gmb-assets', asset));
}
console.log('GMB content, styles and assets synchronized.');
