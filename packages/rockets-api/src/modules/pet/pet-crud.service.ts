import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@concepta/nestjs-crud';
import { PetEntity } from './pet.entity';

export class PetCrudService extends TypeOrmCrudService<PetEntity> {
  constructor(
    @InjectRepository(PetEntity)
    public repo: Repository<PetEntity>,
  ) {
    super(repo);
  }
}
