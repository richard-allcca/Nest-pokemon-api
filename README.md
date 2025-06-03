# Pokedex

## Description

Aplicación de ejemplo con NestJS que muestra un listado de Pokémon y sus detalles.

## Project start

```bash
# install dependencies
$ npm install

# start the application
$ npm run start:dev
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
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
