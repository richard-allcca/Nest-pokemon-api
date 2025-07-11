import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase().trim();

      // INFO 1° método: usando el modelo directamente
      const pokemon = new this.pokemonModel(createPokemonDto);
      return pokemon.save();

      // INFO 2° método: usando un método de modelo
      // const pokemon = await this.pokemonModel.create(createPokemonDto);
      // return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
    throw new InternalServerErrorException(
      'Unexpected error during Pokemon creation',
    );
  }

  findAll(queryParameters: { limit?: number; offset?: number }) {
    const { limit = 10, offset = 0 } = queryParameters;
    return this.pokemonModel
      .find() // Find all Pokemon documents
      .limit(limit) // Limit the number of results returned
      .skip(offset) // Skip the first 'offset' results
      .sort({ no: 1 }) // Sorting by 'no' field '1' for ascending order
      .select('-__v'); // Exclude the __v field from the result
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // INFO: Validating if term is a number
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    // INFO: Validating if term is a valid MongoDB ObjectId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // INFO: Validating if term is a string
    if (!pokemon && isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();

    try {
      return await this.pokemonModel.findByIdAndUpdate(
        pokemon.id,
        updatePokemonDto,
        {
          new: true,
        },
      );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // NOTE - 1 with term and Using findOne to ensure the Pokemon exists before deletion
    // const pokemon = await this.findOne(term);
    // return await this.pokemonModel.findByIdAndDelete(pokemon.id);

    // NOTE - 2 Using findByIdAndDelete directly
    const result = await this.pokemonModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }

    return result;
  }

  private handleExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 11000) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Pokemon in db ${JSON.stringify(error.keyValue)} already exists`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
