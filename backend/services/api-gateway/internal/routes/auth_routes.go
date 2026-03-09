package routes

import (
	"api-gateway/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine) {

	auth := router.Group("/auth")

	auth.POST("/login", handlers.Login)
	auth.POST("/register", handlers.Register)
	auth.POST("/refresh", handlers.RefreshToken)

}
