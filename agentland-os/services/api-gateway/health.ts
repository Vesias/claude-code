import { Request, Response } from 'express';
import { prisma } from './db';

export async function healthCheck(req: Request, res: Response) {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'api-gateway',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown',
      memory: 'ok',
      uptime: process.uptime()
    }
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.status = 'degraded';
    health.checks.database = 'error';
  }

  // Check memory usage
  const used = process.memoryUsage();
  const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
  if (heapUsedMB > 500) {
    health.status = 'degraded';
    health.checks.memory = 'high';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
}