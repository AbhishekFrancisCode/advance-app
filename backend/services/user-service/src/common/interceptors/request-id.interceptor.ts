import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { requestContext } from '../request-context';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();

    const metadata = rpcContext.getContext<Metadata>();

    const requestId = metadata.get('x-request-id')?.[0] as string | undefined;

    if (requestId) {
      console.log(`[${requestId}] Incoming gRPC request`);
    }

    const store = new Map<string, unknown>();
    store.set('requestId', requestId);

    return requestContext.run(store, () => next.handle());
  }
}
