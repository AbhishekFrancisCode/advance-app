package middleware

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func RateLimiter(redisClient *redis.Client, limit int, window time.Duration) gin.HandlerFunc {

	return func(c *gin.Context) {

		ctx := context.Background()

		ip := c.ClientIP()

		key := "rate_limit:ip:" + ip

		count, err := redisClient.Incr(ctx, key).Result()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Rate limiter error",
			})
			c.Abort()
			return
		}

		// set expiration only on first request
		if count == 1 {
			redisClient.Expire(ctx, key, window)
		}

		if count > int64(limit) {

			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests",
			})

			c.Abort()
			return
		}

		c.Next()
	}
}
