import { Param } from '@nestjs/common';
import {
  CrudBody,
  CrudCreateOne,
  CrudDeleteOne,
  CrudReadOne,
  CrudRequest,
  CrudRequestInterface,
  CrudUpdateOne,
  CrudController,
  CrudCreateMany,
  CrudReadMany,
  CrudRecoverOne,
} from '@concepta/nestjs-crud';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedUserInterface } from '@concepta/ts-common';
import {
  AccessControlCreateMany,
  AccessControlCreateOne,
  AccessControlDeleteOne,
  AccessControlQuery,
  AccessControlReadMany,
  AccessControlReadOne,
  AccessControlRecoverOne,
  AccessControlUpdateOne,
} from '@concepta/nestjs-access-control';
import { AuthUser } from '@concepta/nestjs-common';
import {
  UserAccessQueryService,
  UserController as _UserController,
  UserCreateDto,
  UserCreateManyDto,
  UserResource,
  UserUpdateDto,
} from '@concepta/nestjs-user';
import { UserDto } from './dtos/user.dto';
import { UserPaginatedDto } from './dtos/user-paginated.dto';

/**
 * User controller.
 */
@CrudController({
  path: 'user',
  model: {
    type: UserDto,
    paginatedType: UserPaginatedDto,
  },
  join: {
    pets: {
      eager: true,
    },
  },
})
@AccessControlQuery({
  service: UserAccessQueryService,
})
@ApiTags('user')
export class UserController extends _UserController {
  /**
   * Get many
   *
   * @param crudRequest the CRUD request object
   */
  @CrudReadMany()
  @AccessControlReadMany(UserResource.Many)
  async getMany(@CrudRequest() crudRequest: CrudRequestInterface) {
    return super.getMany(crudRequest);
  }

  /**
   * Get one
   *
   * @param crudRequest the CRUD request object
   */
  @CrudReadOne()
  @AccessControlReadOne(UserResource.One)
  async getOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return super.getOne(crudRequest);
  }

  /**
   * Create many
   *
   * @param crudRequest the CRUD request object
   * @param userCreateManyDto user create many dto
   */
  @CrudCreateMany()
  @AccessControlCreateMany(UserResource.Many)
  async createMany(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userCreateManyDto: UserCreateManyDto,
  ) {
    return super.createMany(crudRequest, userCreateManyDto);
  }

  /**
   * Create one
   *
   * @param crudRequest the CRUD request object
   * @param userCreateDto user create dto
   */
  @CrudCreateOne()
  @AccessControlCreateOne(UserResource.One)
  async createOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userCreateDto: UserCreateDto,
  ) {
    return super.createOne(crudRequest, userCreateDto);
  }

  /**
   * Update one
   *
   * @param crudRequest the CRUD request object
   * @param userUpdateDto user update dto
   */
  @CrudUpdateOne()
  @AccessControlUpdateOne(UserResource.One)
  async updateOne(
    @CrudRequest() crudRequest: CrudRequestInterface,
    @CrudBody() userUpdateDto: UserUpdateDto,
    @Param('id') userId?: string,
    @AuthUser() authorizededUser?: AuthenticatedUserInterface,
  ) {
    return super.updateOne(
      crudRequest,
      userUpdateDto,
      userId,
      authorizededUser,
    );
  }

  /**
   * Delete one
   *
   * @param crudRequest the CRUD request object
   */
  @CrudDeleteOne()
  @AccessControlDeleteOne(UserResource.One)
  async deleteOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return super.deleteOne(crudRequest);
  }

  /**
   * Recover one
   *
   * @param crudRequest the CRUD request object
   */
  @CrudRecoverOne()
  @AccessControlRecoverOne(UserResource.One)
  async recoverOne(@CrudRequest() crudRequest: CrudRequestInterface) {
    return super.recoverOne(crudRequest);
  }
}
