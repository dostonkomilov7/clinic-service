import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize"
import {ConfigModule} from "@nestjs/config"
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      logging: console.log,
      synchronize: true,
      sync: {
        force: process.env.NODE_ENV === 'development',
        alter: true
      } 
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
