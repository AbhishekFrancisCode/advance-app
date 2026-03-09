package grpc

import (
	"context"
	"log"

	authpb "api-gateway/proto/auth"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// AuthClient wraps the gRPC AuthService client
type AuthClient struct {
	Client authpb.AuthServiceClient
}

// NewAuthClient creates a connection to the Auth Service
func NewAuthClient() *AuthClient {

	// Connect to Auth Service running on port 50051
	conn, err := grpc.NewClient(
		"localhost:50051",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("Failed to connect to Auth Service: %v", err)
	}

	client := authpb.NewAuthServiceClient(conn)

	return &AuthClient{
		Client: client,
	}
}

// Login calls Auth Service Login RPC
func (a *AuthClient) Login(email string, password string, userAgent string,
	ipAddress string) (*authpb.AuthResponse, error) {

	resp, err := a.Client.Login(
		context.Background(),
		&authpb.LoginRequest{
			Email:     email,
			Password:  password,
			UserAgent: userAgent,
			IpAddress: ipAddress,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}

// Register calls Auth Service Register RPC
func (a *AuthClient) Register(email string, password string, name string,
	phone string,
	userAgent string,
	ipAddress string,
) (*authpb.AuthResponse, error) {

	resp, err := a.Client.Register(
		context.Background(),
		&authpb.RegisterRequest{
			Email:     email,
			Password:  password,
			Name:      name,
			Phone:     phone,
			UserAgent: userAgent,
			IpAddress: ipAddress,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) RefreshToken(refreshToken string) (*authpb.RefreshResponse, error) {
	resp, err := a.Client.RefreshToken(
		context.Background(),
		&authpb.RefreshRequest{RefreshToken: refreshToken},
	)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

// Logout calls Auth Services RPC
func (a *AuthClient) Logout(userId string) (*authpb.MessageResponse, error) {
	resp, err := a.Client.Logout(
		context.Background(),
		&authpb.LogoutRequest{
			UserId: userId,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) GetSessions(userId string) (*authpb.SessionsResponse, error) {
	resp, err := a.Client.GetSessions(
		context.Background(),
		&authpb.GetSessionsRequest{
			UserId: userId,
		},
	)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) LogoutSession(sessionId string) (*authpb.MessageResponse, error) {
	resp, err := a.Client.LogoutSession(
		context.Background(),
		&authpb.LogoutSessionRequest{
			SessionId: sessionId,
		},
	)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
