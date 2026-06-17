import { PrismaClient, Role, TaskStatus, Priority } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// 1. Creamos la conexión nativa con Postgres
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Envolvemos la conexión en el adaptador de Prisma
const adapter = new PrismaPg(pool);

// 3. Instanciamos el cliente pasándole el adaptador (el estándar de Prisma 7)
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando la siembra de datos...');

  const user = await prisma.user.create({
    data: {
      email: 'carolina.dev@example.com',
      name: 'Carolina Carrera',
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Data & Engineering Team',
      description: 'Espacio principal para proyectos de desarrollo y análisis.',
      members: {
        create: {
          userId: user.id,
          role: Role.OWNER,
        },
      },
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Sistema de Predicción de Demanda y Optimización',
      description: 'Análisis de histórico de ventas utilizando el dataset de Olist.',
      workspaceId: workspace.id,
    },
  });

  const tasks = await prisma.task.createMany({
    data: [
      {
        title: 'Extraer y limpiar el dataset de Olist',
        description: 'Eliminar nulos y estandarizar formatos de fecha.',
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        position: 0,
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: 'Diseñar esquema de base de datos relacional',
        description: 'Mapear las tablas de clientes, órdenes y productos.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.URGENT,
        position: 0,
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: 'Entrenar modelo base de regresión',
        description: 'Probar algoritmos iniciales con los datos limpios.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        position: 0,
        projectId: project.id,
        assigneeId: user.id,
      },
    ],
  });

  console.log(`✅ ¡Éxito! Se crearon tareas para el proyecto: ${project.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });