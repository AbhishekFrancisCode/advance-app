package handlers

import (
	"api-gateway/internal/grpc"
	"api-gateway/internal/utils"
	authpb "api-gateway/proto/auth"
	userpb "api-gateway/proto/user"

	"fmt"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
)

// LoginRequest represents login payload from client
type UpdateUserRequest struct {
	UserId  string `json:"userId"`
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
	resp, err := grpc.UserSvc.Client.UpdateUserProfile(
		ctx,
		&userpb.UpdateUserRequest{
			UserId:  userID,
			Name:    req.Name,
			Phone:   req.Phone,
			Email:   req.Email,
			Avatar:  req.Avatar,
			Address: req.Address,
			Dob:     req.Dob,
		},
	)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

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

	resp, err := grpc.UserSvc.Client.GetUserByEmail(ctx,
		&userpb.GetUserByEmailRequest{
			Email: email,
		})

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
		return grpc.UserSvc.GetUserById(ctx, userID)
	})
}

func GetMe(c *gin.Context) {

	userID := c.GetString("user_id")
	sessionID := c.GetString("sessionId")

	if userID == "" && sessionID == "" {
		c.JSON(404, gin.H{
			"error": "user_id nor session_is not found in context",
		})
		return
	}
	ctx := utils.CreateGrpcContext(c)

	userRes, err := grpc.UserSvc.Client.GetUserById(ctx,
		&userpb.GetUserRequest{UserId: userID})

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	c.JSON(200, gin.H{
		"user":             userRes,
		"currentSessionId": sessionID,
	})
}

func GetUserWithSessions(c *gin.Context) {
	var userRes *userpb.UserProfileResponse
	var sessionRes *authpb.SessionsResponse
	var err1, err2 error
	userID := c.GetString("user_id")
	sessionID := c.GetString("sessionId")

	if userID == "" && sessionID == "" {
		c.JSON(404, gin.H{
			"error": "user_id nor session_is not found in context",
		})
		return
	}
	ctx := utils.CreateGrpcContext(c)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		userRes, err1 = grpc.UserSvc.GetUserById(ctx, userID)
	}()

	go func() {
		defer wg.Done()
		sessionRes, err2 = grpc.AuthSvc.Client.GetSessions(
			ctx,
			&authpb.GetSessionsRequest{
				UserId: userID,
			},
		)
	}()
	wg.Wait()
	if err1 != nil {
		utils.HandleGrpcError(c, err1)
		return
	}

	if err2 != nil {
		utils.HandleGrpcError(c, err2)
		return
	}

	if sessionRes == nil {
		c.JSON(500, gin.H{"error": "sessions response is nil"})
	}

	c.JSON(200, gin.H{
		"user":     userRes,
		"sessions": sessionRes.Sessions,
	})
}

func DeleteUser(c *gin.Context) {

	userID := c.GetString("user_id")

	ctx := utils.CreateGrpcContext(c)

	utils.HandleGrpcCall(c, func() (interface{}, error) {
		return grpc.UserSvc.DeleteUser(ctx, userID)
	})
}
