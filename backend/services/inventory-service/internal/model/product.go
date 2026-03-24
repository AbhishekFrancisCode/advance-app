package model

import "gorm.io/gorm"

type Product struct {
	ID    string `gorm:"primaryKey"`
	Name  string
	Stock string
	Price float64
	gorm.Model
}
