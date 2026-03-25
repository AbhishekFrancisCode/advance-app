package grpc

import (
	"log/slog"
	"net"

	"inventory-service/internal/service"

	inventorypb "inventory-service/proto/inventory"

	"google.golang.org/grpc"
)

type GRPCServer struct {
	server *grpc.Server
	port   string
	logger *slog.Logger
}

func NewGRPCServer(
	inventoryService *service.InventoryService,
	logger *slog.Logger,
	port string,
) *GRPCServer {

	s := grpc.NewServer()

	inventorypb.RegisterInventoryServiceServer(s, &Handler{
		service: inventoryService,
		logger:  logger,
	})

	return &GRPCServer{
		server: s,
		port:   port,
		logger: logger,
	}
}

func (g *GRPCServer) Start() {
	lis, err := net.Listen("tcp", ":"+g.port)
	if err != nil {
		g.logger.Error("Failed to start gRPC listener", "error", err)
		panic(err)
	}

	go func() {
		g.logger.Info("gRPC server running", "port", g.port)
		if err := g.server.Serve(lis); err != nil {
			g.logger.Error("gRPC server failed", "error", err)
		}
	}()
}

func (g *GRPCServer) Stop() {
	g.logger.Info("Stopping gRPC server")
	g.server.GracefulStop()
}
