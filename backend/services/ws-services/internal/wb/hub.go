package ws

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	UserID string
	Conn   *websocket.Conn
}

type Hub struct {
	clients map[string]*websocket.Conn // userId → connection
	mu      sync.RWMutex
}

var WS = NewHub()

func NewHub() *Hub {
	return &Hub{
		clients: make(map[string]*websocket.Conn),
	}
}

// Register connection
func (h *Hub) Register(userID string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients[userID] = conn
}

// Remove connection
func (h *Hub) Unregister(userID string) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.clients, userID)
}

// Send message to user
func (h *Hub) Send(userID string, data interface{}) {
	h.mu.RLock()
	conn, ok := h.clients[userID]
	h.mu.RUnlock()

	if !ok {
		return
	}

	conn.WriteJSON(data)
}
