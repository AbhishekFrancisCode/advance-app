package main

import (
	"log"

	"example.com/ws-service/internal/kafka"
	ws "example.com/ws-service/internal/wb"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// WebSocket endpoint
	r.GET("/ws", ws.HandleWebSocket)

	// Start Kafka consumer
	go kafka.StartConsumer()

	log.Println("WS Service running on :8081")
	r.Run(":8081")
}
