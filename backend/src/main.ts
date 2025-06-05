import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend origin
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    credentials: true, // Allow cookies or auth headers if needed
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  // Run the seed script after app creation but before listening
  const seedService = app.get(SeedService);
  await seedService.seedSuperAdmin();
  await seedService.seedPermissions();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();