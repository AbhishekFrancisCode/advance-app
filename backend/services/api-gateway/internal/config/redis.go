package config

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var Ctx = context.Background()

func InitRedis() *redis.Client {

	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379", // docker service name
		Password: "",
		DB:       0,
	})

	// test connection
	_, err := rdb.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("Redis connection failed:", err)
	}

	log.Println("Redis connected")

	return rdb
}
