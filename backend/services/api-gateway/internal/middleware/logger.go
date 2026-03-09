package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func RequestLogger() gin.HandlerFunc {

	return func(c *gin.Context) {

		start := time.Now()

		// process request
		c.Next()

		latency := time.Since(start)

		userID := c.GetString("user_id")

		log.Printf(
			"[API] %s %s | status=%d | latency=%s | user_id=%s",
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			latency,
			userID,
		)
	}
}
