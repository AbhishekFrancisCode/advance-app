package middleware

import (
	"github.com/gin-gonic/gin"

	"github.com/google/uuid"
)

func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {

		requestID := c.GetHeader("X-Request-ID")

		if requestID == "" {
			requestID = uuid.New().String()
		}

		c.Set("request_id", requestID)

		c.Writer.Header().Set("X-Request-ID", requestID)

		c.Next()
	}
}

/*
Adding Request ID / Correlation ID tracing is extremely useful in distributed systems like your architecture.

Client
   ↓
NGINX
   ↓
API Gateway
   ↓
gRPC
   ↓
Microservices
   ↓
Kafka events

Without a correlation ID, debugging becomes very hard.
Every request gets a unique ID like: That same ID travels across the system.
*/
