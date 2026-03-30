package routes

import (
	"api-gateway/internal/handlers"
	"api-gateway/internal/middleware"

	"github.com/gin-gonic/gin"
)

// RegisterUserRoutes registers all user related endpoints
func RegisterUserRoutes(router *gin.Engine) {
	user := router.Group("/users")

	user.PATCH("/profile", middleware.JWTMiddleware(), handlers.UpdateUserProfile)

	user.GET("/email", middleware.JWTMiddleware(), handlers.GetUserByEmail)

	user.GET("/me", middleware.JWTMiddleware(), handlers.GetMe)

	user.DELETE("/delete", middleware.JWTMiddleware(), handlers.DeleteUser)

}
