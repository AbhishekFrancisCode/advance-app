package kafka

import (
	"context"
	"encoding/json"
	"log"
	"log/slog"

	ws "example.com/ws-service/internal/wb"
	"github.com/segmentio/kafka-go"
	"go.opentelemetry.io/otel"
)

type Event struct {
	Type      string `json:"type"`
	UserID    string `json:"userId"`
	SessionID string `json:"sessionId,omitempty"`
}

type Consumer struct {
	consumer *kafka.Reader
	logger   *slog.Logger
}

func NewConsumer(logger *slog.Logger) *Consumer {
	return &Consumer{
		consumer: kafka.NewReader(kafka.ReaderConfig{
			Brokers: []string{"kafka:9092"},
			Topic:   "session-events",
			GroupID: "ws-service",
		}),
		logger: logger,
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
		tr := otel.Tracer("ws-service")
		ctx, span := tr.Start(ctx, "KafkaConsume-order_created")

		var payload map[string]string
		json.Unmarshal(msg.Value, &payload)

		// productID := payload["productId"]

		// success, _ := c.service.ReserveStock(context.Background(), productID)

		// if success {
		// 	c.producer.Publish(ctx, "stock_reserved", payload)
		// } else {
		// 	c.producer.Publish(ctx, "stock_failed", payload)
		// }
		span.End()
	}
}

func (c *Consumer) Stop() {
	c.consumer.Close()
}

func StartConsumer() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092 "},
		Topic:   "session-events",
		GroupID: "ws-service",
	})

	log.Println("Kafka consumer started...")

	for {
		msg, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Println("Kafka error:", err)
			continue
		}

		var event Event
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			log.Println("JSON error:", err)
			continue
		}

		log.Println("Event received:", event.Type)

		ws.WS.Send(event.UserID, event)
	}
}
