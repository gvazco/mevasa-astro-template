import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carpeta donde están las imágenes
const imagesDir = path.join(__dirname, "../src/assets/frames");
const outputFile = path.join(__dirname, "../src/assets/frames/images.js");

// Leer todas las imágenes webp
const files = fs
  .readdirSync(imagesDir)
  .filter((file) => file.toLowerCase().endsWith(".webp"))
  .sort((a, b) => {
    // Ordenar por número
    const numA = parseInt(a.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0);
    return numA - numB;
  });

console.log(`Encontradas ${files.length} imágenes webp`);

// Convertir cada imagen a base64
const images = files.map((file, index) => {
  const filePath = path.join(imagesDir, file);
  const imageBuffer = fs.readFileSync(filePath);
  const base64 = imageBuffer.toString("base64");

  // Obtener dimensiones (por defecto 1920x1080)
  // Si necesitas las dimensiones reales, puedes usar una librería como 'sharp'

  console.log(`Procesado: ${file} (${index + 1}/${files.length})`);

  return {
    id: `image_${index + 1}`,
    w: 1920,
    h: 1080,
    u: "",
    p: `data:image/webp;base64,${base64}`,
    e: 1,
  };
});

// Crear el contenido del archivo JS
const jsContent = `export const images = ${JSON.stringify(images, null, 2)};`;

// Asegurar que la carpeta de salida existe
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Escribir el archivo
fs.writeFileSync(outputFile, jsContent);

console.log(`✅ Archivo generado: ${outputFile}`);
console.log(`📊 Total de imágenes: ${images.length}`);
