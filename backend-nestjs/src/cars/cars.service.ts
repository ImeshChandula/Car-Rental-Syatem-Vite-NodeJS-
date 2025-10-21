import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDTO } from './dto/create-car.dto';
import { UpdateCarDTO } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async findAll(search?: string): Promise<Car[]> {
    if (search) {
      return this.carRepository.find({
        where: {
          title: Like(`%${search}%`),
        },
      });
    }
    
    return this.carRepository.find();
  }

  async findOne(id: number): Promise<Car> {
    const singleCar = await this.carRepository.findOneBy({id})
    if (!singleCar) {
      throw new NotFoundException(`Car not found with ID ${id}`);
    }

    return singleCar;
  }

  async create(createCarData: CreateCarDTO) : Promise<Car> {
    const newCar = this.carRepository.create({...createCarData});

    return this.carRepository.save(newCar);
  }

  async update(id: number, updateCarData: UpdateCarDTO): Promise<Car> {
    const findCarToUpdate = await this.findOne(id);
    Object.assign(findCarToUpdate, updateCarData);

    return this.carRepository.save(findCarToUpdate);
  }

  async remove(id: number) : Promise<void> {
    const findCarToDelete = await this.findOne(id);
    await this.carRepository.remove(findCarToDelete);
  }
}
