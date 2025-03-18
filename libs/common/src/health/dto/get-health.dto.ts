import {
  Directive,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

enum HealthStatus {
  OK = 'ok',
  DEGRADED = 'degraded',
}

enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
}

registerEnumType(HealthStatus, {
  name: 'OrderStatus',
});
registerEnumType(ConnectionStatus, {
  name: 'OrderStatus',
});

@ObjectType()
@Directive('@shareable')
export class GetHealthDto {
  @Field()
  status: HealthStatus;

  @Field()
  rabbitmq: ConnectionStatus;

  @Field()
  rabbitResponseTime: string;

  @Field()
  database: ConnectionStatus;

  @Field()
  dbResponseTime: string;

  @Field()
  redis: ConnectionStatus;

  @Field()
  redisResponseTime: string;
}
