import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDTO } from './dto/create-car.dto';
import { CarExistsPipe } from './pipes/car-exists.pipe';
import { UpdateCarDTO } from './dto/update-car.dto';
import { Car as CarEntity } from './entities/car.entity';

// http://localhost:5000/cars

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('search') search?: string): Promise<CarEntity[]> {
    return this.carsService.findAll(search);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe, CarExistsPipe) id: number): Promise<CarEntity>{
    return this.carsService.findOne(id);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async create(@Body() createCarData: CreateCarDTO) : Promise<CarEntity> {
    return this.carsService.create(createCarData);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe, CarExistsPipe) id: number,
    @Body() updateCarData: UpdateCarDTO,
  ): Promise<CarEntity> {
    return this.carsService.update(id, updateCarData);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe, CarExistsPipe) id: number): Promise<void> {
    await this.carsService.remove(id);
  }
}
