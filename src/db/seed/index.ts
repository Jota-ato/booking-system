import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
// Asegúrate de importar todas las tablas de tu esquema
import { appointments, customers, services, extras, serviceExtras } from '../schema'; 
import type { NewExtra } from '../schema/extras';

// 1. Datos base unificados (Usando duraciones de 150 mins de services-seed.ts)
const servicesData = [
  { name: 'BLOQUEO MANUAL', description: "", price: '0.00', durationMinutes: 150, isActive: true },
  { name: 'Ojo de Gato', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 150, isActive: true },
  { name: 'Acrílico', description: 'técnica clásica para uñas largas, resistentes y de diseño', price: '450.00', durationMinutes: 150, isActive: true },
  { name: 'Tech Gel', description: 'Combina lo mejor del acrílico y del gel. Limado suave sin olores fuertes', price: '400.00', durationMinutes: 150, isActive: true },
  { name: 'Soft Gel', description: 'Extensión de uñas con tips suaves de gel', price: '350.00', durationMinutes: 150, isActive: true },
  { name: 'Dual System', description: 'Estructura perfecta y acabado impecable. Corrección de crecimiento y forma de la uña natural', price: '400.00', durationMinutes: 150, isActive: true },
  { name: 'Balance', description: 'Refuerzo de la uña natural con geles nivelables como Rubber o Builder gel', price: '400.00', durationMinutes: 150, isActive: true }
];

const customersData = [
  { name: 'Ximena', lastName: 'Hernández', phone: '+525512345678', email: 'ximena.her@gmail.com' },
  { name: 'Valeria', lastName: 'Gómez', phone: '+525587654321', email: 'vale.gomez@outlook.com' },
  { name: 'Camila', lastName: 'Mendoza', phone: '+525543218765', email: 'cam_mendoza@gmail.com' },
  { name: 'Sofía', lastName: 'Rodríguez', phone: '+525598761234', email: 'sofi.rod@live.com.mx' },
  { name: 'Fernanda', lastName: 'Sánchez', phone: '+525534567890', email: 'fer.sanchez@gmail.com' },
  { name: 'Daniela', lastName: 'Pérez', phone: '+525523456789', email: 'dan_perez@yahoo.com' },
  { name: 'Gabriela', lastName: 'López', phone: '+525576543210', email: 'gaby_lopez@gmail.com' }
];

const legacyExtrasData: string[] = [
  'Pro Manicure', 'Técnica Dual', 'Extensión (Técnica escultural)', 'Extensión tip SoftGel', 
  'Tonos naturales', 'Variedad de Colores', 'Acabado Matte/Brillo', 'Color Gel', 
  'Frances', 'Efectos', 'Relieves', 'Arte y Diseño', 'Completo', 'Gemas', 'Diseño 3D'
];

const dailyTimeSlots = [
  { hour: 10, minute: 0 }, { hour: 12, minute: 30 }, { hour: 15, minute: 0 }, 
  { hour: 17, minute: 30 }, { hour: 20, minute: 0 }
];

// Helper para precios aleatorios en formato string
const generateRandomPrice = (max: number): string => {
  return (Math.random() * (max - 5) + 5).toFixed(2);
};

// ==========================================
// FUNCIÓN PRINCIPAL DE EJECUCIÓN
// ==========================================
async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  // 2. LIMPIEZA EN ORDEN INVERSO (Previene errores de Foreign Keys)
  console.log('🧹 Limpiando tablas existentes...');
  await db.delete(appointments);
  await db.delete(serviceExtras); // La tabla pivote se borra antes que sus dependencias
  await db.delete(extras);
  await db.delete(services);
  await db.delete(customers);

  // 3. INSERCIÓN DE ENTIDADES INDEPENDIENTES
  console.log('🌱 Sembrando Servicios, Extras y Clientes...');
  const insertedServices = await db.insert(services).values(servicesData).returning();
  const insertedCustomers = await db.insert(customers).values(customersData).returning();

  const extrasValues: NewExtra[] = legacyExtrasData.map((name) => ({
    name,
    description: `Descripción para ${name}`,
    price: generateRandomPrice(99),
  }));
  const insertedExtras = await db.insert(extras).values(extrasValues).returning();

  // 4. VINCULAR SERVICIOS CON EXTRAS (Tabla Pivote)
  console.log('🔗 Vinculando extras a los servicios...');
  const bookableServices = insertedServices.filter(s => s.name !== 'BLOQUEO MANUAL');
  const serviceExtrasToInsert = [];

  for (const service of bookableServices) {
    // Asignar entre 2 y 5 extras aleatorios a cada servicio
    const numberOfExtras = Math.floor(Math.random() * 4) + 2; 
    const shuffledExtras = [...insertedExtras].sort(() => 0.5 - Math.random()).slice(0, numberOfExtras);
    
    for (const extra of shuffledExtras) {
      serviceExtrasToInsert.push({
        serviceId: service.id,
        extraId: extra.id,
      });
    }
  }
  await db.insert(serviceExtras).values(serviceExtrasToInsert);

  // 5. INSERCIÓN DE ENTIDADES DEPENDIENTES (Citas)
  console.log('📅 Generando citas dinámicas...');
  const appointmentsToInsert = [];
  
  // 7 días a partir del 13 de Junio 2026
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date('2026-06-13T00:00:00');
    targetDate.setDate(targetDate.getDate() + i);

    const totalAppointmentsToday = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    const shuffledSlots = [...dailyTimeSlots].sort(() => Math.random() - 0.5);

    for (let j = 0; j < totalAppointmentsToday; j++) {
      const customer = insertedCustomers[Math.floor(Math.random() * insertedCustomers.length)];
      const service = bookableServices[Math.floor(Math.random() * bookableServices.length)];
      const slot = shuffledSlots[j];

      const startTime = new Date(targetDate);
      startTime.setHours(slot.hour, slot.minute, 0, 0);

      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 150); // 150 min duration

      const statuses: ('PENDING' | 'CONFIRMED' | 'COMPLETED')[] = ['PENDING', 'CONFIRMED', 'COMPLETED'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      appointmentsToInsert.push({
        customerId: customer.id,
        serviceId: service.id,
        customerNameSnapshot: `${customer.name} ${customer.lastName}`,
        serviceNameSnapshot: service.name,
        servicePriceSnapshot: service.price,
        appointmentDate: startTime, 
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: randomStatus
      });
    }
  }

  console.log(`🚀 Insertando ${appointmentsToInsert.length} citas...`);
  await db.insert(appointments).values(appointmentsToInsert);

  console.log('✅ ¡Proceso de sembrado maestro completado con éxito!');
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Error crítico durante el sembrado:', err);
  process.exit(1);
});