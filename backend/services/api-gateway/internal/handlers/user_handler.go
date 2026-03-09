package handlers

import (
	"api-gateway/internal/grpc"
	"api-gateway/internal/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// LoginRequest represents login payload from client
type UpdateUserRequest struct {
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
	resp, err := grpc.UserSvc.UpdateUserProfile(
		ctx,
		userID,
		req.Name,
		req.Phone,
		req.Email,
		req.Address,
		req.Dob,
		req.Avatar,
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
	resp, err := grpc.UserSvc.GetUserDataById(ctx, userID)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	c.JSON(http.StatusOK, resp)

}

func DeleteUser(c *gin.Context) {

	userID := c.GetString("user_id")

	ctx := utils.CreateGrpcContext(c)

	resp, err := grpc.UserSvc.DeleteUser(ctx, userID)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}
