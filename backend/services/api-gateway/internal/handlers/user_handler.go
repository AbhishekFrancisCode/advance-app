package handlers

import (
	"api-gateway/internal/grpc"
	"api-gateway/internal/resilience"
	"api-gateway/internal/utils"
	authpb "api-gateway/proto/auth"
	userpb "api-gateway/proto/user"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LoginRequest represents login payload from client
type UpdateUserRequest struct {
	UserId  string `json:"userId`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Avatar  string `json:"avatar"`
	Address string `json:"address"`
	Dob     string `json:"dob"`
}

type GetUserByEmailRequest struct {
	Email string `json:"email"`
}

var userCB = resilience.NewCircuitBreaker("user-service")

func UpdateUserProfile(c *gin.Context) {

	var req UpdateUserRequest

	// read request body
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	// example: user_id extracted from JWT middleware
	userID := c.GetString("user_id")
	ctx := utils.CreateGrpcContext(c)
	result, err := authCB.Execute(func() (interface{}, error) {

		return grpc.UserSvc.Client.UpdateUserProfile(
			ctx,
			&userpb.UpdateUserRequest{
				UserId:  userID,
				Name:    req.Name,
				Phone:   req.Phone,
				Email:   req.Email,
				Address: req.Address,
				Dob:     req.Dob,
				Avatar:  req.Avatar,
			},
		)
	})
	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	resp := result.(*authpb.AuthResponse)
	c.JSON(200, resp)
}

func GetUserByEmail(c *gin.Context) {
	var req GetUserByEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	email := c.GetString("email")
	ctx := utils.CreateGrpcContext(c)

	resp, err := grpc.UserSvc.GetUserDataByEmail(ctx, email)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	fmt.Println("response : ", resp)
	c.JSON(http.StatusOK, resp)

}

func GetUserById(c *gin.Context) {
	userID := c.GetString("user_id")

	if userID == "" {
		c.JSON(404, gin.H{
			"error": "user_id not found in context",
		})
		return
	}
	ctx := utils.CreateGrpcContext(c)

	utils.HandleGrpcCall(c, func() (interface{}, error) {
		return grpc.UserSvc.GetUserDataById(ctx, userID)
	})

}

func DeleteUser(c *gin.Context) {

	userID := c.GetString("user_id")

	ctx := utils.CreateGrpcContext(c)

	utils.HandleGrpcCall(c, func() (interface{}, error) {
		return grpc.UserSvc.DeleteUser(ctx, userID)
	})
}
