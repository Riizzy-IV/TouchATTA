import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

const DIR = 'C:\\Users\\win\\Desktop\\SHOW CASE TESTE\\showcase\\public\\Planta Vertice';

const files = (await readdir(DIR)).filter(f => f.endsWith('.png'));
console.log(`Convertendo ${files.length} PNGs para AVIF...`);

let ok = 0, erros = 0;

for (const file of files) {
  const input  = path.join(DIR, file);
  const output = path.join(DIR, file.replace('.png', '.avif'));

  try {
    const meta = await sharp(input).metadata();
    const hasAlpha = meta.channels === 4 || meta.hasAlpha;

    await sharp(input)
      .heif({
        compression: 'av1',
        quality: 75,          // 0-100, bom equilíbrio qualidade/tamanho
        lossless: false,
        ...(hasAlpha ? {} : {}), // heif preserva alpha automaticamente
      })
      .toFile(output);

    // Verifica se o AVIF gerado tem alpha
    const outMeta = await sharp(output).metadata();
    const preserved = !hasAlpha || outMeta.hasAlpha;

    console.log(`✓ ${file} → ${file.replace('.png', '.avif')} (alpha: ${hasAlpha ? preserved ? 'OK' : 'PERDIDA!' : 'n/a'})`);
    ok++;
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    erros++;
  }
}

console.log(`\nConcluído: ${ok} OK, ${erros} erros`);
console.log('Próximo passo: remover os PNGs originais se tudo OK');
