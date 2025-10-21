import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CarsService } from '../cars.service';

@Injectable()
export class CarExistsPipe implements PipeTransform {
  constructor(private readonly carService: CarsService) {}

  async transform(value: number, metadata: ArgumentMetadata) {
    await this.carService.findOne(value);
    return value;
  }
}
