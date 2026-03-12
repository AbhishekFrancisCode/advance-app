import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { KAFKA_EVENT } from '../decorators/kafka-event.decorator';
import { KafkaEventHandler } from '../event-handler.interface';

@Injectable()
export class EventRouterService implements OnModuleInit {
  private handlers = new Map<string, KafkaEventHandler>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    //NestJS stores every service/class registered in the module as a provider.
    const providers = this.discoveryService.getProviders();
    //Each provider is wrapped in an internal Nest object called InstanceWrapper.
    /*wrapper = {
        instance: UserRegisteredHandler {},
        metatype: class UserRegisteredHandler
    }*/
    for (const wrapper of providers) {
      const instance = wrapper.instance as unknown;

      if (!instance) continue;
      //That decorator stored metadata on the class.
      //Reflect.getMetadata() retrieves that metadata.
      //eg: event = "user_registered"
      const event = Reflect.getMetadata(
        KAFKA_EVENT,
        (instance as object).constructor,
      ) as string | undefined;

      if (event && typeof instance === 'object') {
        this.handlers.set(event, instance as KafkaEventHandler);
      }
      /*eg: handlers Map:
                "user_registered" → UserRegisteredHandler
                "discount_notification" → DiscountHandler */
    }
  }
  //eg: Kafka consumer receives
  /*topic: user_registered
    payload: { userId, email, name } */
  async route(event: string, payload: unknown) {
    const handler = this.handlers.get(event);

    if (!handler) {
      console.warn(`No handler found for event: ${event}`);
      return;
    }
    //UserRegisteredHandler.handle(payload)
    await handler.handle(payload);
  }
}
