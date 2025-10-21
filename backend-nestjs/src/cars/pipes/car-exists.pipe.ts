import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { CarsService } from '../cars.service';

@Injectable()
export class CarExistsPipe implements PipeTransform {
  constructor(private readonly carService: CarsService) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.carService.findById(value);
    } catch (e) {
      throw new NotFoundException(`Car not found with ID ${value}`);
    }
    return value;
  }
}
