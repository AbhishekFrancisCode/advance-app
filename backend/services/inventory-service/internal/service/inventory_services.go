package service

import (
	"context"
	"inventory-service/internal/repository"
	"log/slog"

	"gorm.io/gorm"
)

type InventoryService struct {
	repo   *repository.ProductRepository
	logger *slog.Logger
}

func NewInventoryService(db *gorm.DB, logger *slog.Logger) *InventoryService {
	return &InventoryService{
		repo:   repository.NewProductREpository(db),
		logger: logger,
	}
}

func (s *InventoryService) ReserveStock(ctx context.Context, productID string) (bool, error) {
	rows, err := s.repo.DecrementStock(ctx, productID)

	if err != nil {
		s.logger.Error("DB error", "error", err)
		return false, err
	}

	if rows == 0 {
		s.logger.Warn("Stock not avalible", "productID", productID)
		return false, nil
	}

	s.logger.Info("stock reserved", "productId", productID)
	return true, nil
}
