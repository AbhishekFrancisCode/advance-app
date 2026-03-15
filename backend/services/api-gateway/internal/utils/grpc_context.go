package utils

import (
	"api-gateway/pkg/logger"
	"context"
	"strings"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/metadata"
)

func CreateGrpcContext(c *gin.Context) context.Context {

	authHeader := c.GetHeader("Authorization")

	token := strings.TrimPrefix(authHeader, "Bearer ")

	requestID := c.GetString("request_id")

	logger.Log.Info(
		"login request",
		"requestId", requestID,
		"service", "api-gateway",
	)

	md := metadata.New(map[string]string{
		"authorization": token,
		"x-request-id":  requestID,
	})

	ctx := metadata.NewOutgoingContext(context.Background(), md)

	return ctx
}
