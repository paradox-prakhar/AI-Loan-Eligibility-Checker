import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function main() {
  await prisma.$connect();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`FinWise API listening on port ${env.PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start FinWise API', error);
  process.exit(1);
});