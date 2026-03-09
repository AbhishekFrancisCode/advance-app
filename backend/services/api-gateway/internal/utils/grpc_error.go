package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func HandleGrpcError(c *gin.Context, err error) {

	st, ok := status.FromError(err)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})
		return
	}

	switch st.Code() {

	case codes.NotFound:
		c.JSON(http.StatusNotFound, gin.H{
			"error": st.Message(),
		})

	case codes.InvalidArgument:
		c.JSON(http.StatusBadRequest, gin.H{
			"error": st.Message(),
		})

	case codes.Unauthenticated:
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": st.Message(),
		})

	case codes.PermissionDenied:
		c.JSON(http.StatusForbidden, gin.H{
			"error": st.Message(),
		})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": st.Message(),
		})
	}
}
