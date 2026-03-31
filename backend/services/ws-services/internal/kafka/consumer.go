package kafka

import (
	"context"
	"encoding/json"
	"log"

	ws "example.com/ws-service/internal/wb"
	"github.com/segmentio/kafka-go"
)

type Event struct {
	Type      string `json:"type"`
	UserID    string `json:"userId"`
	SessionID string `json:"sessionId,omitempty"`
}

func StartConsumer() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
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
