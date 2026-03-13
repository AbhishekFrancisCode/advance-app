package routes

import (
	"api-gateway/internal/handlers"
	"api-gateway/internal/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterUserRoutes registers all user related endpoints
func NotificationRoutes(router *gin.Engine) {
	user := router.Group("/notification")

	user.GET("/", middleware.JWTMiddleware(), handlers.GetNotificationsData)
	user.GET("/dlq", middleware.JWTMiddleware(), middleware.AdminJWT(), handlers.GetDlqEvents)
	user.POST("/dlq/:id/replay", middleware.JWTMiddleware(), middleware.AdminJWT(), handlers.ReplayDlqEvent)

}
