/**
 * TAC Photo Color Grading
 * Uniforme kleurbehandeling voor alle website foto's.
 * 
 * Stijl: warm schaduwen (bruin-rood), gedesatureerde midtones,
 * subtiele teal/groen tint in highlights, verhoogd contrast,
 * lichte vignette. Aansluitend bij brand: licorice #111 + teal #10242F + sage #B4CA80
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC = path.join(__dirname, '..', 'public');

const files = [
  { in: 'hero.png',     out: 'hero.webp' },
  { in: 'service1.png', out: 'service1.webp' },
  { in: 'service2.png', out: 'service2.webp' },
  { in: 'team_new.png', out: 'team.webp' },
];

// Kleurgrading via channel manipulation
// Sharp ondersteunt linear + modulate + custom kernels
// We bouwen dit via recomb matrix (3x3 color matrix) + modulate

async function grade(inputPath, outputPath) {
  const img = sharp(inputPath);
  const meta = await img.metadata();
  
  await sharp(inputPath)
    // Stap 1: Licht contrast boost
    .linear(1.08, -8) // contrast verhogen, schaduwen iets donkerder

    // Stap 2: Kleurmatrix voor de grading
    // Warm schaduwen (rode/oranje boost in lows), teal in highlights
    // Recomb matrix: herschrijft RGB kanalen
    .recomb([
      // R-channel: licht verhoogd (warm)
      [1.05, 0.00, -0.02],
      // G-channel: heel licht verhoogd (sage groen)
      [0.00, 0.98,  0.02],
      // B-channel: licht verhoogd in midtones (teal hint)
      [-0.02, 0.03, 1.00],
    ])

    // Stap 3: Saturatie verlagen (editorial, niet overdreven levendig)
    .modulate({
      saturation: 0.82,   // 18% minder saturatie
      brightness: 1.02,   // heel lichte brightening
      hue: 0,
    })

    // Stap 4: Vignette via composite (donkere rand)
    .composite([{
      input: await sharp({
        create: {
          width: meta.width,
          height: meta.height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
      .composite([{
        input: Buffer.from(
          `<svg width="${meta.width}" height="${meta.height}">
            <defs>
              <radialGradient id="v" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stop-color="black" stop-opacity="0"/>
                <stop offset="100%" stop-color="black" stop-opacity="0.35"/>
              </radialGradient>
            </defs>
            <rect width="${meta.width}" height="${meta.height}" fill="url(#v)"/>
          </svg>`
        ),
        blend: 'over'
      }])
      .png()
      .toBuffer(),
      blend: 'multiply'
    }])

    // Output: WebP, hoge kwaliteit
    .webp({ quality: 85, effort: 4 })
    .toFile(outputPath);

  const origKB = Math.round(fs.statSync(inputPath).size / 1024);
  const outKB = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`✓ ${path.basename(outputPath)}: ${origKB}KB → ${outKB}KB`);
}

async function run() {
  console.log('Applying TAC color grade to all photos...\n');
  for (const f of files) {
    await grade(
      path.join(PUBLIC, f.in),
      path.join(PUBLIC, f.out)
    );
  }
  console.log('\nDone! All photos graded with uniform TAC look.');
}

run().catch(console.error);
