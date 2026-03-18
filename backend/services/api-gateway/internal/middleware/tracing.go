package middleware

import (
	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/otel"
)

func TracingMiddleware() gin.HandlerFunc {

	tracer := otel.Tracer("api-gateway")

	return func(c *gin.Context) {

		ctx, span := tracer.Start(c.Request.Context(), c.FullPath())

		defer span.End()

		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
