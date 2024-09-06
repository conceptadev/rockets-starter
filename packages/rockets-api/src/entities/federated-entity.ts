import { Entity, ManyToOne } from 'typeorm';
import { FederatedPostgresEntity } from '@concepta/nestjs-federated';
import { UserEntity } from './user.entity';

@Entity('federated')
export class FederatedEntity extends FederatedPostgresEntity {
  @ManyToOne(() => UserEntity, (user) => user.federates)
  user!: UserEntity;
}
