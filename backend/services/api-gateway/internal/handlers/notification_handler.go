package handlers

import (
	"api-gateway/internal/grpc"
	"api-gateway/internal/utils"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GetNotificationRequest struct {
	UserId string `json:"userId"`
}

func GetNotificationsData(c *gin.Context) {
	userID := c.GetString("user_id")
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.NotifySvc.GetNotifications(
		ctx, userID,
	)

	if err != nil {
		utils.HandleGrpcError(c, err)
		return
	}
	fmt.Println("notification data", resp)
	c.JSON(http.StatusOK, resp)
}
