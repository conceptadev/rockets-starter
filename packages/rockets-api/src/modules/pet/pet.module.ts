import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetEntity } from './pet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetCrudService } from './pet-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [PetController],
  providers: [PetCrudService],
})
export class PetModule {}
