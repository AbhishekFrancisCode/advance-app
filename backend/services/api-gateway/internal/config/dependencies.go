package config

import (
	"api-gateway/internal/grpc"

	"github.com/redis/go-redis/v9"
)

type Dependencies struct {
	Redis      *redis.Client
	AuthClient *grpc.AuthClient
}
