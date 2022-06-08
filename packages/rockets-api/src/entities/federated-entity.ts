import { Entity } from 'typeorm';
import { FederatedPostgresEntity } from '@concepta/nestjs-federated';

@Entity('federated')
export class FederatedEntity extends FederatedPostgresEntity {}
