import fs from "fs";

// ================= SETTINGS =================
const TOTAL_PRODUCTS = 1000;
const OUTPUT_FILE = "products_seed.sql";

// Categorías reales de tu DB
const categories = [
  { id: 1, name: "Periféricos", products: ["Teclado", "Ratón", "Auriculares", "Webcam"] },
  { id: 2, name: "Componentes", products: ["Placa base", "RAM", "SSD", "Fuente"] },
  { id: 3, name: "Monitores", products: ["Monitor"] },
  { id: 11, name: "CPU", products: ["Intel Core", "AMD Ryzen"] },
  { id: 12, name: "GPU", products: ["NVIDIA RTX", "AMD Radeon"] }
];

// Datitos extra
const brands = [
  "ASUS", "MSI", "Gigabyte", "Corsair",
  "Logitech", "Razer", "Samsung",
  "Kingston", "AORUS"
];

const models = [
  "X", "Pro", "Elite",
  "V2", "Turbo", "Ultra",
  "OC", "Plus", "Max"
];

const suffixes = [
  "RGB", "Gaming", "Edition",
  "4K", "144Hz", "240Hz",
  "ARGB", "Wireless"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function randomStock() {
  return Math.floor(Math.random() * 150) + 1;
}

function randomDiscount() {
  return Math.random() > 0.85
    ? Math.floor(Math.random() * 5) + 1
    : "NULL";
}

function randomImage(category) {
  return `img/${category.toLowerCase()}_${Math.floor(Math.random() * 20) + 1}.jpg`;
}

let sql = `INSERT INTO products
(name, description, price, stock, category_id, image_url, active, discount_id)
VALUES
`;

let values = [];

for (let i = 0; i < TOTAL_PRODUCTS; i++) {

  const cat = random(categories);
  const productType = random(cat.products);
  const brand = random(brands);
  const model = random(models);
  const suffix = random(suffixes);

  const name = `${productType} ${brand} ${model}`;
  const description = `${name} ${suffix} de alto rendimiento`;

  const price = randomBetween(19.99, 1999.99);
  const stock = randomStock();

  values.push(`(
  '${name}',
  '${description}',
  ${price},
  ${stock},
  ${cat.id},
  '${randomImage(productType)}',
  1,
  ${randomDiscount()}
)`);

}

sql += values.join(",\n") + ";";

fs.writeFileSync(OUTPUT_FILE, sql);

console.log("✅ Archivo creado:", OUTPUT_FILE);
console.log("🚀 Total productos:", TOTAL_PRODUCTS);
