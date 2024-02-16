import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PetCrudService } from './pet-crud.service';
import {
  AccessControlReadOne,
  AccessControlReadMany,
  AccessControlCreateOne,
  AccessControlUpdateOne,
} from '@concepta/nestjs-access-control';
import {
  CrudBody,
  CrudController,
  CrudCreateOne,
  CrudReadMany,
  CrudReadOne,
  CrudRequest,
  CrudRequestInterface,
  CrudUpdateOne,
} from '@concepta/nestjs-crud';
import { PetResource } from './pet.types';
import { PetDto } from './dtos/pet.dto';
import { PetPaginatedDto } from './dtos/pet.paginated.dto';
import { PetCreateDto } from './dtos/pet-create.dto';
import { PetInterface } from './interfaces/pet.interface';
import { PetUpdateDto } from './dtos/pet-update.dto';

/**
 * Pet controller.
 */
@ApiTags(PetResource.One)
@ApiBearerAuth()
@CrudController({
  path: PetResource.One,
  model: {
    type: PetDto,
    paginatedType: PetPaginatedDto,
  },
})
export class PetController {
  constructor(private readonly petCrudService: PetCrudService) {}

  @CrudReadMany()
  @AccessControlReadMany(PetResource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface) {
    return this.petCrudService.getMany(crudRequest);
  }

  @CrudReadOne()
  @AccessControlReadOne(PetResource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return await this.petCrudService.getOne(crudRequest);
  }

  @CrudCreateOne()
  @AccessControlCreateOne(PetResource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() petCreateOneDto: PetCreateDto,
  ): Promise<PetInterface> {
    return this.petCrudService.createOne(crudRequest, petCreateOneDto);
  }

  @CrudUpdateOne()
  @AccessControlUpdateOne(PetResource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() petUpdateOneDto: PetUpdateDto,
  ): Promise<PetInterface> {
    return this.petCrudService.updateOne(crudRequest, petUpdateOneDto);
  }
}
