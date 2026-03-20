package grpc

import (
	"context"
	"log"

	"api-gateway/internal/resilience"
	authpb "api-gateway/proto/auth"

	"github.com/sony/gobreaker"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/emptypb"
)

// AuthClient wraps the gRPC AuthService client
type AuthClient struct {
	Client authpb.AuthServiceClient
	cb     *gobreaker.CircuitBreaker
	conn   *grpc.ClientConn
}

// NewAuthClient creates a connection to the Auth Service
func NewAuthClient() *AuthClient {

	// Connect to Auth Service running on port 50051
	conn, err := grpc.NewClient(
		"auth-service:50051",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("Failed to connect to Auth Service: %v", err)
	}

	client := authpb.NewAuthServiceClient(conn)

	return &AuthClient{
		Client: client,
		cb:     resilience.NewCircuitBreaker("auth-service"),
	}
}

// Login calls Auth Service Login RPC
func (a *AuthClient) Login(ctx context.Context, email string, password string, userAgent string,
	ipAddress string) (*authpb.AuthResponse, error) {

	result, err := a.cb.Execute(func() (interface{}, error) {

		return a.Client.Login(
			ctx,
			&authpb.LoginRequest{
				Email:     email,
				Password:  password,
				UserAgent: userAgent,
				IpAddress: ipAddress,
			},
		)
	})

	if err != nil {
		return nil, err
	}

	return result.(*authpb.AuthResponse), nil
}

func (a *AuthClient) HealthCheck(ctx context.Context) error {
	_, err := a.Client.Health(ctx, &emptypb.Empty{})
	return err
}

// Register calls Auth Service Register RPC
func (a *AuthClient) Register(ctx context.Context, email string, password string, name string,
	phone string,
	userAgent string,
	ipAddress string,
) (*authpb.AuthResponse, error) {

	result, err := a.cb.Execute(func() (interface{}, error) {

		return a.Client.Register(
			ctx,
			&authpb.RegisterRequest{
				Email:     email,
				Password:  password,
				Name:      name,
				Phone:     phone,
				UserAgent: userAgent,
				IpAddress: ipAddress,
			},
		)
	})
	if err != nil {
		return nil, err
	}

	return result.(*authpb.AuthResponse), nil
}

func (a *AuthClient) RefreshToken(ctx context.Context, refreshToken string) (*authpb.RefreshResponse, error) {
	result, err := a.cb.Execute(func() (interface{}, error) {

		return a.Client.RefreshToken(
			ctx,
			&authpb.RefreshRequest{RefreshToken: refreshToken},
		)
	})
	if err != nil {
		return nil, err
	}

	return result.(*authpb.RefreshResponse), nil
}

// Logout calls Auth Services RPC
func (a *AuthClient) Logout(ctx context.Context, userId string) (*authpb.MessageResponse, error) {
	resp, err := a.Client.Logout(
		ctx,
		&authpb.LogoutRequest{
			UserId: userId,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) GetSessions(ctx context.Context, userId string) (*authpb.SessionsResponse, error) {
	resp, err := a.Client.GetSessions(
		ctx,
		&authpb.GetSessionsRequest{
			UserId: userId,
		},
	)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) LogoutSession(ctx context.Context, sessionId string) (*authpb.MessageResponse, error) {
	resp, err := a.Client.LogoutSession(
		ctx,
		&authpb.LogoutSessionRequest{
			SessionId: sessionId,
		},
	)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (a *AuthClient) Close() {
	if a.conn != nil {
		a.conn.Close()
	}
}
