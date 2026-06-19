import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Evitamos el memory leak guardando la instancia en el objeto global de Node
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 2. Configuramos el Pool exactamente como lo requiere Prisma 7
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Exportamos la instancia única
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;