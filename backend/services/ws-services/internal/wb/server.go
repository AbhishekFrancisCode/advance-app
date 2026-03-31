package ws

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // allow localhost
	},
}

func HandleWebSocket(c *gin.Context) {
	userID := c.Query("userId")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	WS.Register(userID, conn)

	defer func() {
		WS.Unregister(userID)
		conn.Close()
	}()

	// keep connection alive
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}
