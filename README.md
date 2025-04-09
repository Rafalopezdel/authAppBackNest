# 🛡️ AuthApp - Backend

Este proyecto es el backend de un sistema de autenticación desarrollado con NestJS y MongoDB. Proporciona un CRUD completo de usuarios y endpoints seguros para registro e inicio de sesión.

## 🚀 Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://www.docker.com/)
- JWT (JSON Web Token)
- Bcrypt (para hashing de contraseñas)

## 🐳 Levantar la base de datos con Docker

```bash
docker compose up -d
```

⚙️ Configuración
1. Clona el repositorio:
```bash
git clone https://github.com/Rafalopezdel/authAppBackNest.git
cd authAppBackNest
```
2. Instala las dependencias:
```bash
npm install
```
3. Copiar el ```.env.template``` y renombrarlo a ```.env```
Edita el archivo .env en la raíz del proyecto con las siguientes variables:
```env
MONGO_URI=mongodb://localhost:27017/mean-db
JWT_SEED=Esta_es_la_key_secret
```
4. Inicia el servidor:
```bash
npm run start:dev
```

✅ Requisitos:

Node.js 18+

Docker (si deseas usar MongoDB como contenedor).

Nest CLI (opcional): npm i -g @nestjs/cli.
