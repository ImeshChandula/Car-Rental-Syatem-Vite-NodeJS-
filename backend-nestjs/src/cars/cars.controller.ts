import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import type { Car as CarInterface } from './interfaces/car.interface';
import { CreateCarDTO } from './dto/create-car.dto';
import { CarExistsPipe } from './pipes/car-exists.pipe';
import { UpdateCarDTO } from './dto/update-car.dto';

// http://localhost:5000/cars

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  findAll(@Query('search') search?: string): CarInterface[] {
    const allCars = this.carsService.findAll();

    if (search) {
      return allCars.filter((singleCar) =>
        singleCar.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return allCars;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe, CarExistsPipe) id: number): CarInterface{
    return this.carsService.findById(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  create(@Body() createCarData: CreateCarDTO) : CarInterface {
    return this.carsService.create(createCarData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe, CarExistsPipe) id: number,
    @Body() updateCarData: UpdateCarDTO,
  ): CarInterface {
    return this.carsService.update(id, updateCarData);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe, CarExistsPipe) id: number): void {
    this.carsService.remove(id);
  }
}
