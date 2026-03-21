import { Metadata } from '@grpc/grpc-js';
import { context, propagation } from '@opentelemetry/api';

export function createGrpcMetadata(): Metadata {
  const metadata = new Metadata();

  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);

  Object.entries(carrier).forEach(([key, value]) => {
    metadata.set(key, value);
  });

  return metadata;
}
