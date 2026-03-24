package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	_ = godotenv.Load()
	// grpc.InitClients() // Initialize connections to all microservices

	//Router
	router := gin.Default()
	router.Use(gin.Recovery())

}
