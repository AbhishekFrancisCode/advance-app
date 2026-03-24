package repository

import (
	"context"
	"inventory-service/internal/model"

	"gorm.io/gorm"
)

type ProductRepository struct {
	db *gorm.DB
}

func NewProductREpository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) DecrementStock(ctx context.Context, productID string) (int64, error) {
	tx := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("id = ? AND stock > 0", productID).
		Update("stock", gorm.Expr("stock - 1"))

	return tx.RowsAffected, tx.Error
}
