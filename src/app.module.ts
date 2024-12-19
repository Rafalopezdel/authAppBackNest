import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com', // Reemplaza con tu servidor SMTP
        port: 587, // Cambia según tu configuración
        secure: false, // Usa `true` si usas SSL/TLS
        auth: {
          user: 'your-email@example.com',
          pass: 'your-password',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
