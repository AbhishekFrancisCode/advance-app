package grpc

import (
	"api-gateway/internal/resilience"
	notifypb "api-gateway/proto/notification"
	"context"
	"log"

	"github.com/sony/gobreaker"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type NotificationClient struct {
	Client notifypb.NotificationServiceClient
	cb     *gobreaker.CircuitBreaker
}

func NewNotificationClient() *NotificationClient {
	conn, err := grpc.NewClient(
		"notification-service:50053",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatal("Failed to connect usr services: %v", err)
	}

	client := notifypb.NewNotificationServiceClient(conn)

	return &NotificationClient{
		Client: client,
		cb:     resilience.NewCircuitBreaker("notification-service"),
	}
}

func (n *NotificationClient) GetNotifications(
	ctx context.Context,
	userID string,
) (*notifypb.GetNotificationsResponse, error) {
	result, err := n.cb.Execute(func() (interface{}, error) {

		return n.Client.GetNotifications(ctx, &notifypb.GetNotificationsRequest{UserId: userID})
	})

	if err != nil {
		return nil, err
	}

	return result.(*notifypb.GetNotificationsResponse), nil
}

func (n *NotificationClient) GetDlqEvents(
	ctx context.Context,
	userID string,
) (*notifypb.GetDlqEventsResponse, error) {
	resp, err := n.Client.GetDlqEvents(ctx, &notifypb.GetDlqEventsRequest{UserId: userID})
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (n *NotificationClient) ReplayDlqEvent(
	ctx context.Context,
	id string,
) (*notifypb.ReplayDlqEventResponse, error) {
	resp, err := n.Client.ReplayDlqEvent(ctx, &notifypb.ReplayDlqEventRequest{Id: id})
	if err != nil {
		return nil, err
	}

	return resp, nil
}
