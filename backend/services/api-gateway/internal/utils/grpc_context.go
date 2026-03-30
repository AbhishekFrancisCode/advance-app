package utils

import (
	"api-gateway/pkg/logger"
	"context"
	"strings"

	"github.com/gin-gonic/gin"
	"go.opentelemetry.io/otel/propagation"
	"google.golang.org/grpc/metadata"
)

func CreateGrpcContext(c *gin.Context) context.Context {

	authHeader := c.GetHeader("Authorization")

	token := strings.TrimPrefix(authHeader, "Bearer ")

	requestID := c.GetString("request_id")

	prop := propagation.TraceContext{}
	carrier := propagation.HeaderCarrier{}

	logger.Log.Info(
		"login request",
		"requestId", requestID,
		"service", "api-gateway",
	)

	md := metadata.New(map[string]string{
		"authorization": token,
		"x-request-id":  requestID,
	})
	ctx := c.Request.Context()

	prop.Inject(ctx, carrier)
	for k, v := range carrier {
		md.Set(strings.ToLower(k), v[0])
	}
	ctx = metadata.NewOutgoingContext(ctx, md)

	return ctx
}
