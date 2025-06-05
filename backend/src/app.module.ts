import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SeedService } from './seeds/seed.service';  // Import your SeedService

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI environment variable is not defined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PermissionsModule,
  ],
  providers: [SeedService],  // Provide SeedService here
  exports: [SeedService],    // Optional if you want to inject elsewhere
})
export class AppModule {}
