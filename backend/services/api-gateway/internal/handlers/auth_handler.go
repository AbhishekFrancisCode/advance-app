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
	Name     string `json:"name"`
	Phone    string `json:"phone"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

type LogoutRequest struct {
	UserId string `json:"userId"`
}

type LogoutSessionRequest struct {
	SessionID string `json:"sessionId"`
}

// Login handles POST /auth/login
// This endpoint forwards the request to Auth Service via gRPC
func Login(c *gin.Context) {
	log := utils.Logger(c)
	var req LoginRequest

	// Parse JSON body
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	userAgent := c.GetHeader("User-Agent")
	ip := c.ClientIP()
	ctx := utils.CreateGrpcContext(c)

	log.Info("calling auth login", "email", req.Email)

	// Call Auth Service using gRPC client
	resp, err := grpc.AuthSvc.Client.Login(
		ctx,
		&authpb.LoginRequest{
			Email:     req.Email,
			Password:  req.Password,
			UserAgent: userAgent,
			IpAddress: ip,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	log.Info("login successful")

	// Return token to client
	c.JSON(http.StatusOK, gin.H{
		"message":       resp.Message,
		"access_token":  resp.AccessToken,
		"refresh_token": resp.RefreshToken,
	})
}

// It forwards the request to Auth Service via gRPC
func Register(c *gin.Context) {
	log := utils.Logger(c)
	var req RegisterRequest

	// Parse request body
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	userAgent := c.GetHeader("User-Agent")
	ip := c.ClientIP()
	ctx := utils.CreateGrpcContext(c)

	log.Info("calling auth register", "email", req.Email)

	// Call Auth Service using gRPC
	resp, err := grpc.AuthSvc.Client.Register(
		ctx,
		&authpb.RegisterRequest{
			Email:     req.Email,
			Password:  req.Password,
			Name:      req.Name,
			Phone:     req.Phone,
			UserAgent: userAgent,
			IpAddress: ip,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	log.Info("user registered")
	// Return response from Auth Service
	c.JSON(http.StatusOK, gin.H{
		"message":      resp.Message,
		"accessToken":  resp.AccessToken,
		"refreshToken": resp.RefreshToken,
	})
}

func RefreshToken(c *gin.Context) {
	log := utils.Logger(c)
	var req RefreshRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.AuthSvc.Client.RefreshToken(
		ctx,
		&authpb.RefreshRequest{
			RefreshToken: req.RefreshToken,
		})

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}

	log.Info("Refresh token created")

	c.JSON(http.StatusOK, gin.H{
		"message":     resp.Message,
		"accessToken": resp.AccessToken,
	})
}

func Logout(c *gin.Context) {
	log := utils.Logger(c)
	var req LogoutRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.AuthSvc.Client.Logout(
		ctx, &authpb.LogoutRequest{
			UserId: req.UserId,
		})
	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	log.Info("User Logout", "UserId", req.UserId)
	c.JSON(http.StatusOK, gin.H{
		"message": resp.Message,
	})
}

func GetSessions(c *gin.Context) {
	log := utils.Logger(c)
	userID := c.GetString("user_id")
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.AuthSvc.Client.GetSessions(
		ctx,
		&authpb.GetSessionsRequest{
			UserId: userID,
		},
	)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	log.Info("User Session", "UserId", userID)
	c.JSON(200, resp)
}

func GetLogoutSession(c *gin.Context) {
	log := utils.Logger(c)
	var req LogoutSessionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.AuthSvc.Client.LogoutSession(
		ctx, &authpb.LogoutSessionRequest{
			SessionId: req.SessionID,
		})

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	log.Info("User Session logout", "SessionID", req.SessionID)
	c.JSON(http.StatusOK, resp)
}
