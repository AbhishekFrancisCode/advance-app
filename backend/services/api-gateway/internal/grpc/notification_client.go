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
