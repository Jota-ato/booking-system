import { db } from "../index"; 
import { extras, type NewExtra } from "../schema/extras"; 

const legacyExtrasData: string[] = [
  'Pro Manicure',
  'Técnica Dual',
  'Extensión (Técnica escultural)',
  'Extensión tip SoftGel',
  'Tonos naturales',
  'Variedad de Colores',
  'Acabado Matte/Brillo',
  'Color Gel',
  'Frances',
  'Efectos',
  'Relieves',
  'Arte y Diseño',
  'Completo',
  'Gemas',
  'Diseño 3D'
];

const generateRandomPrice = (max: number): string => {
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