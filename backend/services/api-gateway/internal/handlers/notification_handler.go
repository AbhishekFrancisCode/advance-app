package handlers

import (
	"api-gateway/internal/grpc"
	"api-gateway/internal/utils"

	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReplayDlqEventRequest struct {
	Id string `json:"id"`
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

func GetDlqEvents(c *gin.Context) {
	userID := c.GetString("user_id")
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.NotifySvc.GetDlqEvents(
		ctx, userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, resp.Events)
}

func ReplayDlqEvent(c *gin.Context) {
	id := c.Param("id")
	fmt.Println("Notification_handler_id", id)
	ctx := utils.CreateGrpcContext(c)
	resp, err := grpc.NotifySvc.ReplayDlqEvent(ctx, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, resp)
}
