package routes

import (
	"api-gateway/internal/config"

	"github.com/gin-gonic/gin"
)

func RegisterHealthRoutes(r *gin.Engine, deps *config.Dependencies) {

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "api-gateway",
		})
	})

	r.GET("/ready", func(c *gin.Context) {

		checks := map[string]string{}

		// Redis
		if err := deps.Redis.Ping(c).Err(); err != nil {
			checks["redis"] = "down"
		} else {
			checks["redis"] = "up"
		}

		// gRPC Auth Service
		if err := deps.AuthClient.HealthCheck(c); err != nil {
			checks["auth_service"] = "down"
		} else {
			checks["auth_service"] = "up"
		}

		status := "ready"

		for _, v := range checks {
			if v == "down" {
				status = "not_ready"
				break
			}
		}

		c.JSON(200, gin.H{
			"status": status,
			"checks": checks,
		})
	})
}
