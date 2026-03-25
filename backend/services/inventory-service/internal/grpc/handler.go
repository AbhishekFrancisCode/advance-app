package grpc

import (
	"context"
	"log/slog"

	"inventory-service/internal/service"
	proto "inventory-service/proto/inventory"
)

type Handler struct {
	proto.UnimplementedInventoryServiceServer
	service *service.InventoryService
	logger  *slog.Logger
}

func (h *Handler) GetStock(ctx context.Context, req *proto.GetStockRequest) (*proto.GetStockResponse, error) {
	return &proto.GetStockResponse{
		Stock: 10,
	}, nil
}
