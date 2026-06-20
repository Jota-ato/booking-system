import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { appointments, customers, services,  } from '../schema';

// Data parsed directly from Services_rows.csv
const servicesData = [
  { name: 'BLOQUEO MANUAL', description: null, price: '0.00', durationMinutes: 60, isActive: true },
  { name: 'Ojo de Gato', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 90, isActive: true },
  { name: 'Acrílico', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 120, isActive: true },
  { name: 'Tech Gel', description: 'Combina lo mejor del acrílico y del gel. Limado suave sin olores fuertes', price: '400.00', durationMinutes: 90, isActive: true },
  { name: 'Soft Gel', description: 'Extensión de uñas con tips suaves de gel', price: '350.00', durationMinutes: 90, isActive: true },
  { name: 'Dual System', description: 'Estructura perfecta y acabado impecable. Corrección de crecimiento y forma de la uña natural', price: '400.00', durationMinutes: 100, isActive: true },
  { name: 'Balance', description: 'Refuerzo de la uña natural con geles nivelables como Rubber o Builder gel', price: '400.00', durationMinutes: 60, isActive: true }
];

// Mock customers utilizing 10-digit CDMX landlines/mobiles (+52 55 ...)
const customersData = [
  { name: 'Ximena', lastName: 'Hernández', phone: '+525512345678', email: 'ximena.her@gmail.com' },
  { name: 'Valeria', lastName: 'Gómez', phone: '+525587654321', email: 'vale.gomez@outlook.com' },
  { name: 'Camila', lastName: 'Mendoza', phone: '+525543218765', email: 'cam_mendoza@gmail.com' },
  { name: 'Sofía', lastName: 'Rodríguez', phone: '+525598761234', email: 'sofi.rod@live.com.mx' },
  { name: 'Fernanda', lastName: 'Sánchez', phone: '+525534567890', email: 'fer.sanchez@gmail.com' },
  { name: 'Daniela', lastName: 'Pérez', phone: '+525523456789', email: 'dan_perez@yahoo.com' },
  { name: 'Gabriela', lastName: 'López', phone: '+525576543210', email: 'gaby_lopez@gmail.com' }
];

const dailyTimeSlots = [
  { hour: 10, minute: 0 },
  { hour: 12, minute: 30 },
  { hour: 15, minute: 0 },
  { hour: 17, minute: 30 },
  { hour: 20, minute: 0 }
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('⏳ Cleaning existing tables...');
  await db.delete(appointments);
  await db.delete(services);
  await db.delete(customers);

  console.log('🌱 Seeding tables...');
  const insertedServices = await db.insert(services).values(servicesData).returning();
  const insertedCustomers = await db.insert(customers).values(customersData).returning();

  // Exclude 'BLOQUEO MANUAL' from standard booking rotations
  const bookableServices = insertedServices.filter(s => s.name !== 'BLOQUEO MANUAL');

  const appointmentsToInsert = [];
  
  // 7 days starting from today: June 13, 2026
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date('2026-06-13T00:00:00');
    targetDate.setDate(targetDate.getDate() + i);

    // Random choice of 3 to 5 appointments per day
    const totalAppointmentsToday = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    const shuffledSlots = [...dailyTimeSlots].sort(() => Math.random() - 0.5);

    for (let j = 0; j < totalAppointmentsToday; j++) {
      const customer = insertedCustomers[Math.floor(Math.random() * insertedCustomers.length)];
      const service = bookableServices[Math.floor(Math.random() * bookableServices.length)];
      const slot = shuffledSlots[j];

      const startTime = new Date(targetDate);
      startTime.setHours(slot.hour, slot.minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + service.durationMinutes);

      // Random status assignment according to appointmentStatusEnum definitions
      const statuses: ('PENDING' | 'CONFIRMED' | 'COMPLETED')[] = ['PENDING', 'CONFIRMED', 'COMPLETED'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      appointmentsToInsert.push({
        customerId: customer.id,
        serviceId: service.id,
        
        // Match explicit snapshots requested by your schema structural constraints
        customerNameSnapshot: `${customer.name} ${customer.lastName}`,
        serviceNameSnapshot: service.name,
        servicePriceSnapshot: service.price,
        serviceDurationSnapshot: service.durationMinutes,
        
        appointmentDate: startTime, 
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: randomStatus
      });
    }
  }

  console.log(`🌱 Inserting ${appointmentsToInsert.length} dynamic appointments...`);
  await db.insert(appointments).values(appointmentsToInsert);

  console.log('✅ Seeding complete!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Error during complete seeding process:', err);
  process.exit(1);
});