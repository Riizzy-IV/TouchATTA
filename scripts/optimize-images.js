const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'apps', 'siver-botanique', 'public', 'img');

// targetWidth = null means "keep original size, just re-encode"
const PLAN = {
  // Imagens em uso ativo — redimensionadas para 2x do tamanho real exibido
  'fachada-02.png':        { targetWidth: 2880, quality: 78 },
  'fachada-cena-02.png':   { targetWidth: 2880, quality: 78 },
  'fachada.png':           { targetWidth: 1500, quality: 80 },
  'hero.png':              { targetWidth: 2880, quality: 78 },
  'Logo Siver.png':        { targetWidth: null, quality: 90 },
  'logo-branco.png':       { targetWidth: 400,  quality: 92 },
  'logo.png':              { targetWidth: 1000, quality: 92 },
  'sivercon.png':          { targetWidth: 200,  quality: 92 },
  'strelitzia.png':        { targetWidth: 900,  quality: 85 },

  // Imagens sem uso atual no código, mas mantidas para módulos futuros (Áreas Comuns, etc.)
  'fachada-01.png':        { targetWidth: 1500, quality: 80 },
  'fachada-01b.png':       { targetWidth: 1500, quality: 80 },
  'floral.png':            { targetWidth: 1600, quality: 85 },
  'floral-botanical.png':  { targetWidth: 1600, quality: 85 },
  'hero.jpeg':              { targetWidth: 1600, quality: 80, outName: 'hero-jpeg.avif' },
  'outdoor.jpeg':           { targetWidth: 1600, quality: 80 },
  'piscina-01.png':        { targetWidth: 2880, quality: 80 },
  'piscina-01-edit.png':   { targetWidth: 2880, quality: 80 },
  'piscina-01-glare.png':  { targetWidth: 2880, quality: 80 },
  'piscina-02.png':        { targetWidth: 2880, quality: 80 },
  'piscina-02-edit.png':   { targetWidth: 2880, quality: 80 },
  'sivercon-bola.png':     { targetWidth: 200,  quality: 92 },
  'strelitzia-hd.png':     { targetWidth: 1200, quality: 88 },
};

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const [file, cfg] of Object.entries(PLAN)) {
    const srcPath = path.join(DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP (não encontrado): ${file}`);
      continue;
    }

    const outName = cfg.outName || file.replace(/\.(png|jpe?g)$/i, '.avif');
    const outPath = path.join(DIR, outName);

    const before = fs.statSync(srcPath).size;
    let pipeline = sharp(srcPath);
    if (cfg.targetWidth) {
      pipeline = pipeline.resize({ width: cfg.targetWidth, withoutEnlargement: true });
    }
    await pipeline.avif({ quality: cfg.quality, effort: 6 }).toFile(outPath);

    const after = fs.statSync(outPath).size;
    totalBefore += before;
    totalAfter += after;

    console.log(
      `${file.padEnd(28)} ${(before / 1024 / 1024).toFixed(2)}MB -> ${outName.padEnd(28)} ${(after / 1024).toFixed(0)}KB  (-${(100 - (after / before) * 100).toFixed(0)}%)`
    );
  }

  console.log('---');
  console.log(`Total antes:  ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total depois: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
}

run();
