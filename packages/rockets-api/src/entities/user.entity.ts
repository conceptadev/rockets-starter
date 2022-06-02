import { UserPostgresEntity } from '@concepta/nestjs-user/dist/entities/user-postgres.entity';
import { Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends UserPostgresEntity {}
