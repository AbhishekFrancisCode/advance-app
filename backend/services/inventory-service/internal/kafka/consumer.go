package kafka

import (
	"context"
	"encoding/json"
	"log/slog"

	"inventory-service/internal/service"

	"github.com/segmentio/kafka-go"
	"go.opentelemetry.io/otel"
)

type Consumer struct {
	consumer *kafka.Reader
	service  *service.InventoryService
	producer *Producer
	logger   *slog.Logger
}

func NewConsumer(s *service.InventoryService, p *Producer, logger *slog.Logger) *Consumer {
	return &Consumer{
		consumer: kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{"kafka:9092"},
			Topic:   "order_created",
			GroupID: "inventory-group",
		}),
		service:  s,
		producer: p,
		logger:   logger,
	}
}

func (c *Consumer) Start() {
	for {
		msg, err := c.consumer.ReadMessage(context.Background())
		if err != nil {
			c.logger.Error("Kafka read error", "error", err)
			continue
		}

		//Extract trace from Kafka headers
		ctx := otel.GetTextMapPropagator().Extract(
			context.Background(),
			headersToCarrier(msg.Headers),
		)

		//Start span
		tr := otel.Tracer("inventory-service")
		ctx, span := tr.Start(ctx, "KafkaConsume-order_created")

		var payload map[string]string
		json.Unmarshal(msg.Value, &payload)

		productID := payload["productId"]

		success, _ := c.service.ReserveStock(context.Background(), productID)

		if success {
			c.producer.Publish(ctx, "stock_reserved", payload)
		} else {
			c.producer.Publish(ctx, "stock_failed", payload)
		}
		span.End()
	}
}

func (c *Consumer) Stop() {
	c.consumer.Close()
}
