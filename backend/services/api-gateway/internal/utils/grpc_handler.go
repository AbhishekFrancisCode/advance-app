package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleGrpcCall(
	c *gin.Context,
	call func() (interface{}, error),
) {

	resp, err := call()

	if err != nil {
		HandleGrpcError(c, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}
