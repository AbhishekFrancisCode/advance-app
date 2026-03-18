import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { requestContext } from '../request-context';
import { context, propagation, trace } from '@opentelemetry/api';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(contextExec: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = contextExec.switchToRpc();

    const metadata = rpcContext.getContext<Metadata>();

    const requestId = metadata.get('x-request-id')?.[0] as string | undefined;

    if (requestId) {
      console.log(`[${requestId}] Incoming gRPC request`);
    }

    const store = new Map<string, unknown>();
    store.set('requestId', requestId);

    // Convert gRPC metadata to object for OpenTelemetry
    const metadataCarrier: Record<string, string> = {};
    const metaMap = metadata.getMap();

    Object.entries(metaMap).forEach(([key, value]) => {
      metadataCarrier[key] = String(value);
    });
    // Extract trace context
    const parentContext = propagation.extract(
      context.active(),
      metadataCarrier,
    );

    const tracer = trace.getTracer('auth-service');

    return requestContext.run(store, () =>
      context.with(parentContext, () => {
        const span = tracer.startSpan('grpc.request');

        return next.handle().pipe(
          tap({
            next: () => span.end(),
            error: () => span.end(),
          }),
        );
      }),
    );
  }
}
