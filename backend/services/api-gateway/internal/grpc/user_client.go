package grpc

import (
	"context"
	"fmt"
	"log"

	pb "api-gateway/proto/user"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type UserClient struct {
	Client pb.UserServiceClient
}

func NewUserClient() *UserClient {

	conn, err := grpc.NewClient(
		"localhost:50052",
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		log.Fatalf("Failed to connect user service: %v", err)
	}

	client := pb.NewUserServiceClient(conn)

	return &UserClient{
		Client: client,
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
) (*pb.UserResponse, error) {

	resp, err := u.Client.UpdateUserProfile(
		ctx,
		&pb.UpdateUserRequest{
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

func (u *UserClient) GetUserDataByEmail(
	ctx context.Context, email string,
) (*pb.UserProfileResponse, error) {
	resp, err := u.Client.GetUserByEmail(
		ctx,
		&pb.GetUserByEmailRequest{Email: email},
	)
	fmt.Println("responce grpc : ", resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UserClient) GetUserDataById(ctx context.Context,
	userID string,
) (*pb.UserProfileResponse, error) {
	resp, err := u.Client.GetUserById(
		ctx,
		&pb.GetUserRequest{UserId: userID},
	)
	fmt.Println("responce grpc : ", resp)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UserClient) DeleteUser(ctx context.Context, userID string) (*pb.UserResponse, error) {

	resp, err := u.Client.DeleteUser(
		ctx,
		&pb.GetUserRequest{
			UserId: userID,
		},
	)

	if err != nil {
		return nil, err
	}

	return resp, nil
}
