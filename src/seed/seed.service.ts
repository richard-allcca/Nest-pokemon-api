import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/Axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(
    // private readonly pokemonService: PokemonService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpClient: AxiosAdapter,
  ) {}

  async seedExecute() {
    // NOTE - Clear the database before seeding
    await this.pokemonModel.deleteMany({});

    const data = await this.httpClient.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    // DESCRIPTION - Methods for insert data into the database

    // NOTE - Insert data into the database with service pokemonService
    // for (const { name, url } of data.results) {
    //   const id = url.split('/').slice(-2, -1)[0];
    //   console.log(`Name: ${name}, ID: ${id}`);
    //   await this.pokemonService.create({
    //     name: name.toLowerCase().trim(),
    //     no: +id,
    //   });
    // }

    // NOTE - Insert data into the database with model pokemonModel
    // for (const { name, url } of data.results) {
    //   const segment = url.split('/');
    //   const id = segment[segment.length - 2];
    //   // console.log(`Name: ${name}, ID: ${id}`);
    //   await this.pokemonModel.create({
    //     name: name.toLowerCase().trim(),
    //     no: +id,
    //   });
    // }

    // NOTE - Insert data into the database by group
    // const insertPromisesArray: Promise<any>[] = [];
    // for (const { name, url } of data.results) {
    //   const segment = url.split('/');
    //   const id = segment[segment.length - 2];
    //   // console.log(`Name: ${name}, ID: ${id}`);
    //   insertPromisesArray.push(this.pokemonModel.create({ name, no: +id }));
    // }

    // await Promise.all(insertPromisesArray);

    // NOTE - Insert data into the database by block
    const pokemonToInsert: { name: string; no: number }[] = [];
    for (const { name, url } of data.results) {
      const segment = url.split('/');
      const id = segment[segment.length - 2];
      // console.log(`Name: ${name}, ID: ${id}`);
      pokemonToInsert.push({ name, no: +id });
    }

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed successfully';
  }
}
