package main

import (
	"api-gateway/internal/config"
	"api-gateway/internal/grpc" // Initializes gRPC clients
	"api-gateway/internal/middleware"
	"api-gateway/internal/observability"
	"api-gateway/internal/routes" // Registers API routes
	"api-gateway/pkg/logger"
	"context"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize connections to all microservices
	grpc.InitClients()

	//RedisClient
	redisClient := config.InitRedis()

	// 🔹 Build dependencies (IMPORTANT)
	deps := &config.Dependencies{
		Redis:      redisClient,
		AuthClient: grpc.AuthSvc, // adjust if different
	}

	// Create Gin HTTP server
	router := gin.Default()
	router.Use(gin.Recovery())
	router.Use(middleware.RequestLogger())
	router.Use(middleware.TracingMiddleware())
	// router.Use(middleware.JWTMiddleware())

	// Debug route to test load balancing
	routes.RegisterDebugRoutes(router)

	// Register user routes
	routes.RegisterUserRoutes(router)
	routes.RegisterAuthRoutes(router)
	routes.NotificationRoutes(router)

	//Register Health + Readiness routes
	routes.RegisterHealthRoutes(router, deps)

	// Assign correlation ID
	router.Use(middleware.RequestID())

	// rate limit: 60 requests per minute
	router.Use(middleware.RateLimiter(redisClient, 60, time.Minute))

	//Logger Slog
	logger.Init()

	//opentelementry
	shutdown := observability.InitTracer("api-gateway")
	defer shutdown(context.Background())

	// Start API Gateway server on port 8080
	router.Run(":8080")
}
