package routes

import (
	"os"

	"github.com/gin-gonic/gin"
)

func RegisterDebugRoutes(router *gin.Engine) {

	router.GET("/whoami", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"instance": os.Getenv("HOSTNAME"),
		})
	})

}
