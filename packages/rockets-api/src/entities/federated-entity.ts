import { Entity } from 'typeorm';
import { FederatedPostgresEntity } from '@concepta/nestjs-federated';

@Entity()
export class FederatedEntity extends FederatedPostgresEntity {}
