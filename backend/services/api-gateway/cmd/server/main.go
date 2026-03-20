package main

import (
	"api-gateway/internal/config"
	"api-gateway/internal/grpc" // Initializes gRPC clients
	"api-gateway/internal/middleware"
	"api-gateway/internal/observability"
	"api-gateway/internal/routes" // Registers API routes
	"api-gateway/pkg/logger"
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {

	grpc.InitClients()                // Initialize connections to all microservices
	redisClient := config.InitRedis() //Initialize RedisClient
	logger.Init()                     //Initialize logger Slog
	deps := &config.Dependencies{
		Redis:      redisClient,
		AuthClient: grpc.AuthSvc, // adjust if different
	}

	//Router
	router := gin.Default()
	router.Use(gin.Recovery())
	router.Use(middleware.RequestLogger())
	router.Use(middleware.TracingMiddleware())
	router.Use(middleware.RequestID())                               // Assign correlation ID
	router.Use(middleware.RateLimiter(redisClient, 60, time.Minute)) // rate limit: 60 requests per minute
	// router.Use(middleware.JWTMiddleware())

	//Routes
	routes.RegisterUserRoutes(router)
	routes.RegisterAuthRoutes(router)
	routes.NotificationRoutes(router)
	routes.RegisterDebugRoutes(router)        // Debug route to test load balancing
	routes.RegisterHealthRoutes(router, deps) //Register Health + Readiness routes

	//opentelementry
	tracerShutdown := observability.InitTracer("api-gateway")

	srv := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %s\n", err)
		}
	}()

	log.Println("API Gateway running on port 8080")

	//Listen for shutdown signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown signal received...")

	//Graceful shutdown timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//Stop HTTP server
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced shutdown:", err)
	}

	//Close Redis
	if err := redisClient.Close(); err != nil {
		log.Println("Redis close error:", err)
	}

	//Close gRPC connections (if you added Close method)
	if grpc.AuthSvc != nil {
		grpc.AuthSvc.Close()
	}

	//Flush tracing
	defer tracerShutdown(ctx)

	log.Println("Server exited gracefully")
}
