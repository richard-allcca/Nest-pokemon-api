import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log('🚀 ParseMongoIdPipe', { value, metadata });
    if (!isValidObjectId(value))
      throw new BadRequestException('Invalid MongoDB ID');

    return value;
  }
}
