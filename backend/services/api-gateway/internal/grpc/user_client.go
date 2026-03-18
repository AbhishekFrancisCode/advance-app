package grpc

import (
	"context"
	"fmt"
	"log"

	"api-gateway/internal/resilience"
	userpb "api-gateway/proto/user"

	"github.com/sony/gobreaker"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type UserClient struct {
	Client userpb.UserServiceClient
	cb     *gobreaker.CircuitBreaker
}

func NewUserClient() *UserClient {

	conn, err := grpc.NewClient(
		"user-service:50052",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("Failed to connect user service: %v", err)
	}

	client := userpb.NewUserServiceClient(conn)

	return &UserClient{
		Client: client,
		cb:     resilience.NewCircuitBreaker("user-service"),
	}
}

func (u *UserClient) UpdateUserProfile(
	ctx context.Context,
	userID string,
	name string,
	phone string,
	email string,
	address string,
	dob string,
	avatar string,
) (*userpb.UserResponse, error) {

	resp, err := u.Client.UpdateUserProfile(
		ctx,
		&userpb.UpdateUserRequest{
			UserId:  userID,
			Name:    name,
			Phone:   phone,
			Email:   email,
			Address: address,
			Dob:     dob,
			Avatar:  avatar,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UserClient) GetUserByEmail(
	ctx context.Context, email string,
) (*userpb.UserProfileResponse, error) {
	resp, err := u.Client.GetUserByEmail(
		ctx,
		&userpb.GetUserByEmailRequest{Email: email},
	)
	fmt.Println("responce grpc : ", resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UserClient) GetUserById(ctx context.Context,
	userID string,
) (*userpb.UserProfileResponse, error) {
	resp, err := u.Client.GetUserById(
		ctx,
		&userpb.GetUserRequest{UserId: userID},
	)
	fmt.Println("responce grpc : ", resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UserClient) DeleteUser(ctx context.Context, userID string) (*userpb.UserResponse, error) {

	resp, err := u.Client.DeleteUser(
		ctx,
		&userpb.GetUserRequest{
			UserId: userID,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}
