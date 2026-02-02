/**
 * シーリングスタンプのフレーム画像を生成するスクリプト
 * 
 * 元のシーリング画像を解析し、以下の処理を行う:
 * 1. 中央の四角いくぼみ部分を完全に透明にする
 * 2. バラやティーポットの彫刻部分（明るい部分）だけを半透明として残す
 * 3. 背景（暗い部分）も透明にする
 * 
 * 使用方法: node scripts/generate-frame.js
 */

import sharp from 'sharp';
import path from 'path';

async function generateFrame() {
  const inputPath = path.join(__dirname, '../public/assets/images.png');
  const outputPath = path.join(__dirname, '../public/assets/seal-frame.png');
  
  console.log('シーリング画像を読み込み中...');
  
  // 元の画像を読み込む
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  
  console.log(`画像サイズ: ${width}x${height}`);
  
  // 画像のピクセルデータを取得
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const pixels = new Uint8Array(data);
  const centerX = width / 2;
  const centerY = height / 2;
  const circleRadius = Math.min(width, height) * 0.22; // 中央の透明エリア
  
  // 各ピクセルを処理
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = pixels[idx + 3];

      // 中央からの距離を計算
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < circleRadius) {
        // 中央の円形エリアは完全に透明
        pixels[idx + 3] = 0;
      } else if (a === 0) {
        // 元々透明な部分はそのまま
        continue;
      }
      // それ以外の部分（周囲のシーリング）はそのまま残す
    }
  }
  
  console.log('フレーム画像を保存中...');
  
  // 処理済みピクセルデータを新しい画像として保存
  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
    .png()
    .toFile(outputPath);
  
  console.log(`✅ フレーム画像を生成しました: ${outputPath}`);
}

generateFrame().catch(console.error);
