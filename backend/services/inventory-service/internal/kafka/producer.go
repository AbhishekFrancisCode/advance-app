package kafka

import (
	"context"
	"encoding/json"

	"github.com/segmentio/kafka-go"
	"go.opentelemetry.io/otel"
)

type Producer struct {
	producer *kafka.Writer
}

func NewProducer() *Producer {
	return &Producer{producer: &kafka.Writer{
		Addr:     kafka.TCP("localhost:9092"),
		Balancer: &kafka.LeastBytes{},
	}}
}

func (p *Producer) Publish(ctx context.Context, topic string, payload map[string]string) {
	data, _ := json.Marshal(payload)

	carrier := kafkaHeaderCarrier{}
	otel.GetTextMapPropagator().Inject(ctx, carrier)

	headers := carrierToHeaders(carrier)

	p.producer.WriteMessages(context.Background(), kafka.Message{
		Topic:   topic,
		Value:   data,
		Headers: headers,
	})
}
