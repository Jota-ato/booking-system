import { db } from "../index"; // Importa tu instancia configurada de Drizzle/Neon
import { extras, type NewExtra } from "../schema/extras"; // Ajusta el path a tu archivo

// 1. Centralizamos los datos heredados de los ENUMs
const legacyExtrasData: string[] = [
  // Antiguos ServiceItem
  'Pro Manicure',
  'Técnica Dual',
  'Extensión (Técnica escultural)',
  'Extensión tip SoftGel',
  'Tonos naturales',
  'Variedad de Colores',
  'Acabado Matte/Brillo',
  // Antiguos ServiceExtra
  'Color Gel',
  'Frances',
  'Efectos',
  'Relieves',
  'Arte y Diseño',
  'Completo',
  'Gemas',
  'Diseño 3D'
];

// 2. Función pura para generar el precio asegurando el formato `string` (precisión de 2 decimales)
const generateRandomPrice = (max: number): string => {
  // Genera un número entre 5 y max (para evitar extras de $0)
  const randomValue = Math.random() * (max - 5) + 5; 
  return randomValue.toFixed(2); // Retorna un string ej: "45.50"
};

// 3. Script principal de ejecución
async function seedExtras() {
  console.log("🌱 Iniciando el sembrado de la tabla 'extras'...");

  try {
    // Mapeamos los strings a la estructura estricta de Drizzle (NewExtra)
    const valuesToInsert: NewExtra[] = legacyExtrasData.map((extraName) => ({
      name: extraName,
      description: `Descripción autogenerada para ${extraName}`,
      // El precio se envía como string para satisfacer el tipo 'numeric' de Postgres
      price: generateRandomPrice(99), 
    }));

    // Inserción en bloque (Bulk Insert) para mayor eficiencia en Neon
    await db.insert(extras).values(valuesToInsert);

    console.log(`✅ ¡Éxito! Se insertaron ${valuesToInsert.length} extras correctamente.`);
  } catch (error) {
    console.error("❌ Error durante el sembrado de extras:", error);
    process.exit(1);
  }
}

// Ejecutar
seedExtras();