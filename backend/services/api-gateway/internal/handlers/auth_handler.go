package handlers

import (
	"net/http"

	"api-gateway/internal/grpc"
	"api-gateway/internal/utils"
	authpb "api-gateway/proto/auth"

	"github.com/gin-gonic/gin"
)

// LoginRequest represents login payload from client
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type LogoutRequest struct {
	UserId string `json:"userId"`
}

// Login handles POST /auth/login
// This endpoint forwards the request to Auth Service via gRPC
func Login(c *gin.Context) {

	var req LoginRequest

	// Parse JSON body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Call Auth Service using gRPC client
	resp, err := grpc.AuthSvc.Client.Login(
		c,
		&authpb.LoginRequest{
			Email:    req.Email,
			Password: req.Password,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Return token to client
	c.JSON(http.StatusOK, gin.H{
		"access_token": resp.AccessToken,
	})
}

// It forwards the request to Auth Service via gRPC
func Register(c *gin.Context) {

	var req RegisterRequest

	// Parse request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Call Auth Service using gRPC
	resp, err := grpc.AuthSvc.Client.Register(
		c,
		&authpb.RegisterRequest{
			Email:    req.Email,
			Password: req.Password,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Return response from Auth Service
	c.JSON(http.StatusOK, gin.H{
		"message":      resp.Message,
		"accessToken":  resp.AccessToken,
		"refreshToken": resp.RefreshToken,
	})
}

func RefreshToken(c *gin.Context) {
	var req RefreshRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	resp, err := grpc.AuthSvc.Client.RefreshToken(
		c,
		&authpb.RefreshRequest{
			RefreshToken: req.RefreshToken,
		})

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message":     resp.Message,
		"accessToken": resp.AccessToken,
	})
}

func Logout(c *gin.Context) {
	var req LogoutRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	resp, err := grpc.AuthSvc.Client.Logout(
		c, &authpb.LogoutRequest{
			UserId: req.UserId,
		})
	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": resp.Message,
	})
}
