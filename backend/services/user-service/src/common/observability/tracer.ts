import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';

let sdk: NodeSDK | null = null; // ✅ keep let

export function initTracing() {
  const traceExporter = new OTLPTraceExporter({
    url: 'http://jaeger:4317',
  });

  sdk = new NodeSDK({
    traceExporter,
    resource: resourceFromAttributes({
      'service.name': 'user-service', // 🔥 IMPORTANT
    }),
  });

  sdk.start();

  console.log('Tracing initialized for user-service');
}

export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    console.log('Tracing shutdown');
  }
}
