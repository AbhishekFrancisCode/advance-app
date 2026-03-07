package main

import (
	"api-gateway/internal/grpc"   // Initializes gRPC clients
	"api-gateway/internal/routes" // Registers API routes

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize connections to all microservices
	grpc.InitClients()

	// Create Gin HTTP server
	router := gin.Default()

	// Register user routes
	routes.RegisterUserRoutes(router)
	routes.RegisterAuthRoutes(router)

	// Start API Gateway server on port 8080
	router.Run(":8080")
}
