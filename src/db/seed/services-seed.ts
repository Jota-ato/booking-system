import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'; // Swap out with your pool provider if using neon/pg
import { Pool } from 'pg';
import { services } from '../schema';

const csvServices = [
  { name: 'BLOQUEO MANUAL', description: null, price: '0.00', durationMinutes: 60, isActive: true },
  { name: 'Ojo de Gato', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 90, isActive: true },
  { name: 'Acrílico', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 120, isActive: true },
  { name: 'Tech Gel', description: 'Combina lo mejor del acrílico y del gel. Limado suave sin olores fuertes', price: '400.00', durationMinutes: 90, isActive: true },
  { name: 'Soft Gel', description: 'Extensión de uñas con tips suaves de gel', price: '350.00', durationMinutes: 90, isActive: true },
  { name: 'Dual System', description: 'Estructura perfecta y acabado impecable. Corrección de crecimiento y forma de la uña natural', price: '400.00', durationMinutes: 100, isActive: true },
  { name: 'Balance', description: 'Refuerzo de la uña natural con geles nivelables como Rubber o Builder gel', price: '400.00', durationMinutes: 60, isActive: true }
];

async function seedServicesOnly() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('🌱 Seeding services from CSV...');
  
  // Optional: clear old services if you want a clean state
  // await db.delete(services);

  await db.insert(services).values(csvServices);
  
  console.log('✅ Services successfully seeded!');
  await pool.end();
}

seedServicesOnly().catch((err) => {
  console.error('❌ Failed to seed services:', err);
  process.exit(1);
});