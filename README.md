# Pokedex

API REST de ejemplo con NestJS que muestra un listado de Pokémon y sus detalles.

## Project start

```bash
# install dependencies
$ npm install

# start the application
$ npm run start:dev

# Inicializar la base de datos
$ docker compose up -d
```

## Compile and run the project

```bash
# watch mode development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Fix problems with CRLF nd LF

```bash
  # Add into eslint config
  "rules": {
    'prettier/prettier': ['error', { 'endOfLine': 'auto' }]
  }

  # or

  # change all files to LF
  git config --global core.autocrlf input

  # change all files to CRLF
  git config --global core.autocrlf true
```

## Configuración para servir contenido estático

Primero instalar el paquete `@nestjs/serve-static`:

```bash
npm i @nestjs/serve-static
```

Luego, en el archivo `app.module.ts`, importar el módulo `ServeStaticModule` y configurarlo:

```typescript
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
})
export class AppModule {}
```

## Comandos CLI

```bash
# generar un nuevo recurso (controlador, servicio y módulo)
$ nest g resource <nombre>

# generar un nuevo módulo
$ nest g module <nombre>

# generar un nuevo controlador
$ nest g controller <nombre>

# generar un nuevo servicio
$ nest g service <nombre>

# generar un nuevo guard
$ nest g guard <nombre>

# generar un nuevo interceptor
$ nest g interceptor <nombre>

# generar un nuevo pipe
$ nest g pipe <nombre>

# generar un nuevo proveedor
$ nest g provider <nombre>

# generar un nuevo DTO
$ nest g dto <nombre>

# generar un nuevo middleware
$ nest g middleware <nombre>
```

## Agregar prefijo a las rutas

Para agregar un prefijo a todas las rutas de la aplicación, se puede utilizar el método `setGlobalPrefix` en el archivo `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
```
