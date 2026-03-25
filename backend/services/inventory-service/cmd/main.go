package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"inventory-service/internal/db"
	"inventory-service/internal/kafka"
	telemetry "inventory-service/internal/observability"
	"inventory-service/internal/service"

	grpcserver "inventory-service/internal/grpc"

	"github.com/gin-gonic/gin"
)

func main() {
	//Logger
	shutdownTracer := telemetry.InitTracer()
	defer shutdownTracer(context.Background())
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	log.Println("Tracer initialized")

	//Context
	ctx := context.Background()

	//DB Init
	database := db.InitDB()

	//Service Layer
	inventoryService := service.NewInventoryService(database, logger)

	//Kafka
	producer := kafka.NewProducer()
	consumer := kafka.NewConsumer(inventoryService, producer, logger)

	go consumer.Start()

	//gRPC Server
	grpcSrv := grpcserver.NewGRPCServer(inventoryService, logger, "50054")
	grpcSrv.Start()

	// HTTP Server (health + metrics)
	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "inventory",
		})
	})

	go func() {
		logger.Info("HTTP server running", "port", 2112)
		if err := router.Run(":2112"); err != nil {
			logger.Error("HTTP server failed", "error", err)
		}
	}()

	//Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	logger.Info("Shutdown signal received")

	// Stop Kafka
	consumer.Stop()

	// Stop gRPC
	grpcSrv.Stop()

	// Give time for cleanup
	ctxTimeout, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	<-ctxTimeout.Done()

	logger.Info("Inventory service shutdown complete")
}
