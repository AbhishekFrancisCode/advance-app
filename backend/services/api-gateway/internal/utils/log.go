package utils

import (
	"log/slog"

	"github.com/gin-gonic/gin"
)

func Logger(c *gin.Context) *slog.Logger {

	requestID := c.GetString("request_id")

	return slog.Default().With(
		"requestId", requestID,
		"service", "api-gateway",
	)
}
