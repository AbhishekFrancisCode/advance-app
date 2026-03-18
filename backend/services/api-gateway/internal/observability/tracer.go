package observability

import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"

	"google.golang.org/grpc"
)

func InitTracer(serviceName string) func(context.Context) error {

	ctx := context.Background()

	conn, err := grpc.Dial(
		"jaeger:4317",
		grpc.WithInsecure(),
	)

	if err != nil {
		log.Fatalf("failed to connect to jaeger: %v", err)
	}

	exporter, err := otlptracegrpc.New(
		ctx,
		otlptracegrpc.WithGRPCConn(conn),
	)

	if err != nil {
		log.Fatalf("failed to create exporter: %v", err)
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceName(serviceName),
		)),
	)

	otel.SetTracerProvider(tp)

	return tp.Shutdown
}
