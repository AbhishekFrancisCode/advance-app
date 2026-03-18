/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';

export function initTracing() {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://jaeger:4317',
  });

  const sdk = new NodeSDK({
    traceExporter,
    resource: resourceFromAttributes({
      'service.name': 'notification-service',
    }),
  });

  sdk.start();

  console.log('Tracing initialized for notification-service');
}
