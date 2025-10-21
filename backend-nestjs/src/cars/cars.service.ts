import { Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { CreateCarDTO } from './dto/create-car.dto';
import { UpdateCarDTO } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: 1,
      title: 'Toyota Prius',
      description: 'Fore hire',
      is_booked: false,
      is_available: true,
      created_at: new Date(),
    },
  ];

  findAll(): Car[] {
    return this.cars;
  }

  findById(id: number): Car {
    const post = this.cars.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('Car not found');
    }

    return post;
  }

  create(createCarData: CreateCarDTO) : Car {
    const newCar: Car = {
      id: this.getNextId(),
      ...createCarData,
      is_booked: false,
      is_available: true,
      created_at: new Date()
    }

    this.cars.push(newCar);
    return newCar;
  }

  update(id: number, updateCarData: Partial<UpdateCarDTO>): Car {
    const currentCarId = this.cars.findIndex(car => car.id === id);
    if (currentCarId === -1) {
      throw new NotFoundException('Car not found');
    }

    this.cars[currentCarId] = {
      ...this.cars[currentCarId],
      ...updateCarData,
      updated_at: new Date()
    }

    return this.cars[currentCarId];
  }

  remove(id: number) : {message: string} {
    const currentCarIndex = this.cars.findIndex(car => car.id === id);
    if (currentCarIndex === -1) {
      throw new NotFoundException('Car not found');
    }

    this.cars.splice(currentCarIndex, 1);

    return {message: 'Car deleted successfully'}
  }

  private getNextId(): number {
    return this.cars.length > 0 ?
      Math.max(...this.cars.map(car => car.id)) + 1 : 1
  }
}
