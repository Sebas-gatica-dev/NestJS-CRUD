/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
  } from './config/constants';

@Module({
    controllers: [AppController],
    imports: 
    [ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
          }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get<string>(DB_HOST),
                port: +configService.get<number>(DB_PORT),
                username: configService.get(DB_USER),
                password: configService.get(DB_PASSWORD),
                database: configService.get(DB_DATABASE),
                entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
              inject: [ConfigService],
          }),
        UserModule,
        AuthModule,
        ProfileModule,
    ],
    
})

export class AppModule {}
