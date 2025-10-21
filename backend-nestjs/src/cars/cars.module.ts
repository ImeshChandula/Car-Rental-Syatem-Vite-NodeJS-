import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';

@Module({
  imports: [
    // makes the car repository available for injection
    TypeOrmModule.forFeature([Car]),
  ],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
