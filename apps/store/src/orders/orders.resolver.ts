import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../libs';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import {
  CacheControl,
  CurrentUser,
  AccessGuard,
  JwtAuthGuard,
  PaginateGraph,
  PaginateQueryGraph,
} from '@app/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ListOrderDto } from './dto/list-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { GetOrderItemDto } from './dto/get-order-items.dto';

@Resolver(() => GetOrderDto)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => GetOrderDto, { name: 'createOrder' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  async create(
    @CurrentUser() user: User,
    @Args('createOrderDto') createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Query(() => ListOrderDto, { name: 'orders' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  @CacheControl({ maxAge: 100, scope: 'PRIVATE' })
  async findAll(
    @Args() _: PaginateQueryGraph,
    @PaginateGraph() { query, config },
    @CurrentUser() user: User,
  ) {
    return this.ordersService.findAll(query, config, user);
  }

  @Query(() => GetOrderDto, { name: 'order' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  @CacheControl({ maxAge: 100, scope: 'PRIVATE' })
  async findOne(@CurrentUser() user: User, @Args('id') id: string) {
    return this.ordersService.findOne({ id: +id }, user);
  }

  @Mutation(() => GetOrderDto, { name: 'updateOrder' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  async update(
    @CurrentUser() user: User,
    @Args('id') id: string,
    @Args('updateOrderDto') updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update({ id: +id }, updateOrderDto, user);
  }

  @Mutation(() => GetOrderDto, { name: 'deleteOrder' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  async remove(@CurrentUser() user: User, @Args('id') id: string) {
    return this.ordersService.remove({ id: +id }, user);
  }

  @Mutation(() => GetOrderDto, { name: 'clearOrderItems' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  async clearOrderItems(@CurrentUser() user: User, @Args('id') id: string) {
    return this.ordersService.clearItems({ id: +id }, user);
  }

  @Mutation(() => GetOrderDto, { name: 'cancelOrder' })
  @UseGuards(JwtAuthGuard, AccessGuard)
  async cancelOrder(@CurrentUser() user: User, @Args('id') id: string) {
    return this.ordersService.cancelOrder({ id: +id }, user);
  }

  @ResolveField(() => [GetOrderItemDto], { name: 'order_items' })
  async orderItems(@Parent() order: GetOrderDto) {
    return this.ordersService.getOrderItemsByOrderId(order.id);
  }
}
