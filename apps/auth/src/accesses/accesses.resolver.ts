import { UseGuards } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { CacheControl, PaginateGraph, PaginateQueryGraph } from '@app/common';
import { GetAccessDto } from './dto/get-access.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtAccessGuard } from '../guards/jwt-access.guard';
import { ListAccessDto } from './dto/list-access.dto';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GetEndpointDto } from './dto/get-endpoint.dto';

@Resolver(() => GetAccessDto)
export class AccessesResolver {
  constructor(private readonly accessesService: AccessesService) {}

  @Mutation(() => GetAccessDto, { name: 'createAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  async create(@Args('createAccessDto') createAccessDto: CreateAccessDto) {
    return this.accessesService.create(createAccessDto);
  }

  @Query(() => ListAccessDto, { name: 'accesses' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @CacheControl({ maxAge: 100 })
  async findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() { query, config },
  ) {
    return this.accessesService.findAll(query, config);
  }

  @Query(() => GetAccessDto, { name: 'access' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  @CacheControl({ maxAge: 100 })
  async findOne(@Args('id') id: string) {
    return this.accessesService.findOne({ id: +id });
  }

  @Mutation(() => GetAccessDto, { name: 'updateAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  async update(
    @Args('id') id: string,
    @Args('updateAccessDto') updateAccessDto: UpdateAccessDto,
  ) {
    return this.accessesService.update({ id: +id }, updateAccessDto);
  }

  @Mutation(() => GetAccessDto, { name: 'deleteAccess' })
  @UseGuards(JwtAuthGuard, JwtAccessGuard)
  async remove(@Args('id') id: string) {
    return this.accessesService.remove({ id: +id });
  }

  @CacheControl({ inheritMaxAge: true })
  @ResolveField(() => [GetEndpointDto], { name: 'endpoints', nullable: true })
  async endpoints(@Parent() access: GetAccessDto) {
    return this.accessesService.getEndpointsByAccessId(access.id);
  }
}
