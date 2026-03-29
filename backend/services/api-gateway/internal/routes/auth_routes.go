package routes

import (
	"api-gateway/internal/handlers"
	"api-gateway/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.Engine) {

	auth := router.Group("/auth")

	auth.POST("/login", handlers.Login)

	auth.POST("/register", handlers.Register)

	auth.POST("/refresh", handlers.RefreshToken)

	auth.POST("/logout", middleware.JWTMiddleware(), handlers.Logout)

	auth.GET("/sessions", middleware.JWTMiddleware(), handlers.GetSessions)

	auth.POST("/logout-session", middleware.JWTMiddleware(), handlers.GetLogoutSession)

}
