import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function generateImages() {
  console.log('Generating PNG images from SVG...');

  // icon.svg -> icon.png (192x192)
  const iconSvg = readFileSync(join(publicDir, 'icon.svg'));
  await sharp(iconSvg)
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'icon.png'));
  console.log('✓ icon.png generated');

  // image.svg -> image.png (1200x630)
  const imageSvg = readFileSync(join(publicDir, 'image.svg'));
  await sharp(imageSvg)
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'image.png'));
  console.log('✓ image.png generated');

  // splash.svg -> splash.png (600x600)
  const splashSvg = readFileSync(join(publicDir, 'splash.svg'));
  await sharp(splashSvg)
    .resize(600, 600)
    .png()
    .toFile(join(publicDir, 'splash.png'));
  console.log('✓ splash.png generated');

  console.log('All images generated successfully!');
}

generateImages().catch(console.error);
