const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Read CSS
const themeCss = fs.readFileSync(path.join(rootDir, 'css', 'theme.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(rootDir, 'css', 'layout.css'), 'utf8');
const combinedCss = `\n/* === CSS THEME === */\n${themeCss}\n\n/* === CSS LAYOUT === */\n${layoutCss}\n`;

// 2. Read scenarios in order
const scenarioFiles = [
  'amadeus-unused-atc.js',
  'amadeus-cat31-fail.js',
  'amadeus-partial-fxx.js',
  'amadeus-split-partial-pax.js',
  'amadeus-void-and-sell.js',
  'amadeus-void-ticket.js',
  'amadeus-add-baggage-ssr.js',
  'amadeus-add-docs-apis.js',
  'amadeus-retrieve-toolkit.js',
  'amadeus-partial-fqp.js',
  'amadeus-rebook-fxo.js',
  'amadeus-rebook-tte-retry.js',
  'amadeus-heett-void-check.js',
  'amadeus-add-seat-sm.js',
  'amadeus-add-meal-ssr.js',
  'amadeus-add-wheelchair.js',
  'amadeus-add-infant.js',
  'amadeus-emd-view.js',
  'amadeus-refund-trf-atc.js',
  'amadeus-refund-trf-tax.js',
  'amadeus-history-rhi-rhfa.js',
  'amadeus-cancel-xa.js',
  'amadeus-ignore-ig.js',
  'amadeus-ir-redisplay.js',
  'amadeus-tqt-tte.js'
];

let scenariosJs = '/* === SCENARIOS REGISTRY === */\n';
scenarioFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, 'scenarios', file), 'utf8');
  scenariosJs += `\n/* --- ${file} --- */\n${content}\n`;
});

// 3. Read format, engine and app
const formatJs = fs.readFileSync(path.join(rootDir, 'js', 'format.js'), 'utf8');
const engineJs = fs.readFileSync(path.join(rootDir, 'js', 'engine.js'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
const coreJs = `\n/* === FORMATTERS === */\n${formatJs}\n\n/* === SCENARIOS REGISTRY === */\n${scenariosJs}\n\n/* === ENGINE === */\n${engineJs}\n\n/* === APP CONTROLLER === */\n${appJs}\n`;

// 4. Base HTML
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

// Replace stylesheet links with inlined style
let portableHtml = indexHtml.replace(
  /<link rel="stylesheet" href="css\/theme\.css" \/>\s*<link rel="stylesheet" href="css\/layout\.css" \/>/,
  `<style>${combinedCss}</style>`
);

// Replace all script tags from <!-- Shared Formatters --> to end of scripts
const scriptSectionRegex = /<!-- Shared Formatters -->[\s\S]*<!-- Core Engine & Application UI -->[\s\S]*?<script src="js\/app\.js"><\/script>/;

portableHtml = portableHtml.replace(
  scriptSectionRegex,
  `<script>\n${coreJs}\n</script>`
);

// Write dist/TrainingGDS-amadeus.html
const outDist = path.join(distDir, 'TrainingGDS-amadeus.html');
fs.writeFileSync(outDist, portableHtml, 'utf8');

// Write root convenience copy TrainingGDS-amadeus-portable.html
const outRoot = path.join(rootDir, 'TrainingGDS-amadeus-portable.html');
fs.writeFileSync(outRoot, portableHtml, 'utf8');

console.log(`Successfully built portable bundles:`);
console.log(`- Dist: ${outDist} (${(fs.statSync(outDist).size / 1024).toFixed(1)} KB)`);
console.log(`- Root: ${outRoot} (${(fs.statSync(outRoot).size / 1024).toFixed(1)} KB)`);
console.log(`Scenarios: ${scenarioFiles.length}`);

