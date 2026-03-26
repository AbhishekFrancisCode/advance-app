package routes

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ExternalService struct {
	Name string
	URL  string
}

func getServices() []ExternalService {
	return []ExternalService{
		{"auth-service", "http://auth-service:3001/health"},
		{"user-service", "http://user-service:3002/health"},
		{"inventory-service", "http://inventory-service:2112/health"},
		{"notification-service", "http://notification-service:3003/health"},
	}
}

func RegisterServiceHealthRoute(r *gin.Engine) {
	r.GET("/services/health", func(c *gin.Context) {

		services := getServices()

		type Response struct {
			Name         string `json:"name"`
			Status       string `json:"status"`
			ResponseTime int64  `json:"responseTime"`
		}

		var results []Response

		client := http.Client{
			Timeout: 2 * time.Second,
		}

		for _, svc := range services {

			start := time.Now()

			resp, err := client.Get(svc.URL)
			duration := time.Since(start).Milliseconds()

			if err != nil || resp.StatusCode != http.StatusOK {
				results = append(results, Response{
					Name:         svc.Name,
					Status:       "DOWN",
					ResponseTime: 0,
				})
				continue
			}

			results = append(results, Response{
				Name:         svc.Name,
				Status:       "UP",
				ResponseTime: duration,
			})
		}

		c.JSON(http.StatusOK, results)
	})
}
