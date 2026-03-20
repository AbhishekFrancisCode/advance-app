import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk: NodeSDK | null = null;

export function initTracing() {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://jaeger:4317',
  });

  const sdk = new NodeSDK({
    traceExporter,
    resource: resourceFromAttributes({
      'service.name': 'auth-service',
    }),
  });

  sdk.start();

  console.log('OpenTelemetry tracing initialized for auth-service');
}

export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    console.log('Tracing shutdown');
  }
}
