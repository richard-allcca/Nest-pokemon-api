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

# Llenar la base de datos con datos de ejemplo
http://localhost:3000/api/v2/seed
```

## Compile and run the project

```bash
# watch mode development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Note about modules

> Todas las carpetas dentro de `src` tienen módulos y en estos se debe registrar los controladores, servicios y demás clases para que se puedan utilizar, de lo contrario no funcionarán y si se necesita `importar` un módulo en otro, se debe hacer a través de la propiedad `imports` del decorador `@Module`.

Como ejemplo toma el módulo `CommonModule`, que se encarga de proporcionar los adaptadores HTTP. Este módulo debe ser importado en cualquier otro módulo que necesite utilizar estos adaptadores.

```typescript
@Module({
  providers: [AxiosAdapter, FetchAdapter], // Registering the adapters as providers
  exports: [AxiosAdapter, FetchAdapter], // Exporting the adapters for use in other modules
})
export class CommonModule {}
```

## Note about Injection

Para inyectar un adaptador HTTP en un servicio, primero debes asegurarte de que el adaptador esté registrado como proveedor en el módulo correspondiente y declarado en `exports`. Luego, puedes inyectarlo directamente en el constructor del servicio.

```typescript
@Injectable()
export class SomeService {
  constructor(private readonly httpClient: AxiosAdapter) {}
}
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

Puedes utilizar al final de los comandos la bandera `--no-spec` para evitar la generación de archivos de pruebas unitarias.

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

## Conexión a la base de datos mongo con Mongoose y @nestjs/mongoose

[Documentación oficial para trabajar con MongoDB](https://docs.nestjs.com/techniques/mongodb)

Para conectar la aplicación a una base de datos MongoDB utilizando Mongoose y el paquete `@nestjs/mongoose`, se deben seguir los siguientes pasos:

1. Instalar las dependencias necesarias:

```bash
npm install @nestjs/mongoose mongoose
```

2. Importar el módulo `MongooseModule` en el archivo `app.module.ts` y configurar la conexión a la base de datos:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
})
export class AppModule {}
```

3. Crear un esquema de Mongoose para definir la estructura de los documentos en la colección:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
```

4. Importar el esquema en el módulo correspondiente y registrar el modelo:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './pokemon.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
})
export class PokemonModule {}
```

5. Inyectar el modelo en el servicio o controlador donde se necesite utilizarlo:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from './pokemon.schema';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    const createdPokemon = new this.pokemonModel(createPokemonDto);
    return createdPokemon.save();
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemonModel.find().exec();
  }

  async findOne(id: string): Promise<Pokemon> {
    return this.pokemonModel.findById(id).exec();
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    return this.pokemonModel.findByIdAndUpdate(id, updatePokemonDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Pokemon> {
    return this.pokemonModel.findByIdAndDelete(id).exec();
  }
};
```

## Establecer un código de estado personalizado HTTP en las respuestas

Para establecer el código de estado HTTP en las respuestas de los controladores, se puede utilizar el decorador `@HttpCode()`

### Usando el decorador `@HttpCode()`

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Set the HTTP status code to 201 Created
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }
}
```
