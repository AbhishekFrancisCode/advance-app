package handlers

import (
	"api-gateway/internal/grpc"
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

func UpdateUserProfile(c *gin.Context) {

	var req UpdateUserRequest

	// read request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// example: user_id extracted from JWT middleware
	userID := c.GetString("user_id")

	resp, err := grpc.UserSvc.UpdateUserProfile(
		userID,
		req.Name,
		req.Phone,
		req.Email,
		req.Address,
		req.Dob,
		req.Avatar,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, resp)
}

type GetUserByEmailRequest struct {
	Email string `json:"email"`
}

func GetUserByEmail(c *gin.Context) {
	var req GetUserByEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	email := c.GetString("email")

	resp, err := grpc.UserSvc.GetUserDataByEmail(email)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("response : ", resp)
	c.JSON(http.StatusOK, resp)

}

func GetUserById(c *gin.Context) {
	userID := c.GetString("user_id")
	fmt.Println("User ID from context:", userID)

	if userID == "" {
		c.JSON(404, gin.H{
			"error": "user_id not found in context",
		})
		return
	}

	resp, err := grpc.UserSvc.GetUserDataById(userID)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)

}
