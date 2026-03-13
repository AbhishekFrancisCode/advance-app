package grpc

import (
	pb "api-gateway/proto/notification"
	"context"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type NotificationClient struct {
	Client pb.NotificationServiceClient
}

func NewNotificationClient() *NotificationClient {
	conn, err := grpc.NewClient(
		"localhost:50053",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatal("Failed to connect usr services: %v", err)
	}

	client := pb.NewNotificationServiceClient(conn)

	return &NotificationClient{
		Client: client,
	}
}

func (n *NotificationClient) GetNotifications(
	ctx context.Context,
	userID string,
) (*pb.GetNotificationsResponse, error) {
	resp, err := n.Client.GetNotifications(ctx, &pb.GetNotificationsRequest{UserId: userID})

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (n *NotificationClient) GetDlqEvents(
	ctx context.Context,
	userID string,
) (*pb.GetDlqEventsResponse, error) {
	resp, err := n.Client.GetDlqEvents(ctx, &pb.GetDlqEventsRequest{UserId: userID})
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (n *NotificationClient) ReplayDlqEvent(
	ctx context.Context,
	id string,
) (*pb.ReplayDlqEventResponse, error) {
	resp, err := n.Client.ReplayDlqEvent(ctx, &pb.ReplayDlqEventRequest{Id: id})
	if err != nil {
		return nil, err
	}

	return resp, nil
}
