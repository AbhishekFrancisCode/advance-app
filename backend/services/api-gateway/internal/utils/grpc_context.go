package utils

import (
	"context"
	"strings"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/metadata"
)

func CreateGrpcContext(c *gin.Context) context.Context {

	authHeader := c.GetHeader("Authorization")

	token := strings.TrimPrefix(authHeader, "Bearer ")

	md := metadata.New(map[string]string{
		"authorization": token,
	})

	ctx := metadata.NewOutgoingContext(context.Background(), md)

	return ctx
}
