package resilience

import (
	"time"

	"github.com/sony/gobreaker"
)

func NewCircuitBreaker(name string) *gobreaker.CircuitBreaker {

	settings := gobreaker.Settings{
		Name:        name,
		MaxRequests: 3, // allowed in half-open state

		Interval: 10 * time.Second, // reset failure count
		Timeout:  5 * time.Second,  // open → half-open

		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures >= 3
		},
	}

	return gobreaker.NewCircuitBreaker(settings)
}
