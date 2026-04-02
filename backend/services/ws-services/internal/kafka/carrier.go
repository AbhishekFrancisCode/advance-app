package kafka

import "github.com/segmentio/kafka-go"

// Carrier for OpenTelemetry
type kafkaHeaderCarrier map[string]string

func (c kafkaHeaderCarrier) Get(key string) string {
	return c[key]
}

func (c kafkaHeaderCarrier) Set(key string, value string) {
	c[key] = value
}

func (c kafkaHeaderCarrier) Keys() []string {
	keys := make([]string, 0, len(c))
	for k := range c {
		keys = append(keys, k)
	}
	return keys
}

// Convert kafka headers → carrier
func headersToCarrier(headers []kafka.Header) kafkaHeaderCarrier {
	carrier := kafkaHeaderCarrier{}
	for _, h := range headers {
		carrier[h.Key] = string(h.Value)
	}
	return carrier
}

// Convert carrier → kafka headers
func carrierToHeaders(carrier kafkaHeaderCarrier) []kafka.Header {
	headers := make([]kafka.Header, 0, len(carrier))
	for k, v := range carrier {
		headers = append(headers, kafka.Header{
			Key:   k,
			Value: []byte(v),
		})
	}
	return headers
}
